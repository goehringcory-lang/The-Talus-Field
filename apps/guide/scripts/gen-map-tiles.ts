// =============================================================================
// gen-map-tiles.ts: the 3D map's two tile archives.
//
//   npm run map:tiles            build both archives, write tiles.generated.ts
//   npm run map:tiles -- --build=20260926   pin the Protomaps daily build
//
// Outputs (the archives are gitignored; the generated module is committed):
//   scripts/.mapcache/out/basemap-<ver>.pmtiles   vector basemap
//   scripts/.mapcache/out/dem-<ver>.pmtiles       Terrarium elevation, WebP
//   src/map/tiles.generated.ts                    version, extents, pack sizes
//
// Then upload both archives to R2 (the script prints the two commands) BEFORE
// merging the PR that commits the new tiles.generated.ts: the app asks the
// Worker for /vt/<ver>/... and /dem/<ver>/..., and an archive that is not in
// the bucket yet is a 404 for every tile.
//
// Sources, both licensed for commercial use with attribution:
//   Basemap    Protomaps daily planet build (OpenStreetMap, ODbL; Natural
//              Earth, public domain), cut to MAP_EXTENT by `pmtiles extract`,
//              which reads only the byte ranges it needs: no planet download.
//              https://docs.protomaps.com/basemaps/downloads
//   Elevation  Mapzen Terrain Tiles on AWS Open Data, Terrarium encoding.
//              Inside the United States at these zooms the source is USGS
//              3DEP (public domain); SRTM and GMTED2010 fill the low zooms.
//              https://registry.opendata.aws/terrain-tiles/
//              The same tiles scripts/gen-hike-tracks.mjs samples, so a
//              trail's profile and the terrain it is drawn on agree.
//
// Tooling: Node 22.5+ (node:sqlite), sharp (a devDependency), and the
// go-pmtiles CLI, which this script downloads once into .mapcache/ from the
// project's GitHub releases (Linux and macOS, x86_64 and arm64).
//
// The elevation is quantised to whole metres before encoding. Terrarium's
// blue channel carries 1/256 m, which is noise at 19 m a pixel and triples
// the size of a lossless WebP; dropping it takes the whole pyramid from
// ~55 MB to ~20 MB. The encoding stays lossless, because a lossy WebP moves
// the red and green channels and turns a cliff into a spike.
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'
import sharp from 'sharp'
import { PMTiles, type Source, type RangeResponse } from 'pmtiles'
import {
  BASEMAP_MAX_ZOOM,
  BASEMAP_MIN_ZOOM,
  DEM_MAX_ZOOM,
  DEM_MIN_ZOOM,
  MAP_EXTENT,
  OFFLINE_REGIONS,
  overviewTiles,
  regionTiles,
  tilesInBbox,
  type TileAddress,
} from '../src/map/regions'

const APP_DIR = path.resolve(import.meta.dirname, '..')
const CACHE = path.join(APP_DIR, 'scripts/.mapcache')
const OUT = path.join(CACHE, 'out')
const DEM_CACHE = path.join(CACHE, 'terrarium')
const GENERATED = path.join(APP_DIR, 'src/map/tiles.generated.ts')

const PMTILES_VERSION = '1.31.2'
const PROTOMAPS_BUILDS = 'https://build.protomaps.com'
const TERRARIUM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium'
const UA = 'TalusFieldGuide/1.0 (map tile pipeline; thetalusfieldjournal.com)'

const BASEMAP_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://protomaps.com">Protomaps</a>'
const DEM_ATTRIBUTION = 'Elevation: USGS 3DEP, SRTM, GMTED2010 via Mapzen Terrain Tiles'

// --- the pmtiles CLI ----------------------------------------------------------

function pmtilesBin(): string {
  const bin = path.join(CACHE, `pmtiles-${PMTILES_VERSION}`)
  if (fs.existsSync(bin)) return bin
  const os = { linux: 'Linux', darwin: 'Darwin' }[process.platform as string]
  const arch = { x64: 'x86_64', arm64: 'arm64' }[process.arch as string]
  if (!os || !arch) throw new Error(`No go-pmtiles build for ${process.platform}/${process.arch}; install it and put it at ${bin}`)
  const ext = os === 'Darwin' ? 'zip' : 'tar.gz'
  const url = `https://github.com/protomaps/go-pmtiles/releases/download/v${PMTILES_VERSION}/go-pmtiles_${PMTILES_VERSION}_${os}_${arch}.${ext}`
  console.log(`fetching ${url}`)
  const tmp = fs.mkdtempSync(path.join(CACHE, 'pmtiles-'))
  const archive = path.join(tmp, `pmtiles.${ext}`)
  execFileSync('curl', ['-sSfL', '-o', archive, url])
  if (ext === 'zip') execFileSync('unzip', ['-q', archive, 'pmtiles', '-d', tmp])
  else execFileSync('tar', ['xzf', archive, '-C', tmp, 'pmtiles'])
  fs.renameSync(path.join(tmp, 'pmtiles'), bin)
  fs.rmSync(tmp, { recursive: true })
  fs.chmodSync(bin, 0o755)
  return bin
}

// --- basemap ------------------------------------------------------------------

async function latestBuild(): Promise<string> {
  const day = new Date()
  for (let i = 0; i < 14; i++) {
    const stamp = day.toISOString().slice(0, 10).replaceAll('-', '')
    const res = await fetch(`${PROTOMAPS_BUILDS}/${stamp}.pmtiles`, { method: 'HEAD', headers: { 'User-Agent': UA } })
    if (res.ok) return stamp
    day.setUTCDate(day.getUTCDate() - 1)
  }
  throw new Error('No Protomaps daily build found in the last two weeks')
}

function extractBasemap(bin: string, build: string, out: string) {
  if (fs.existsSync(out)) return
  const bbox = MAP_EXTENT.join(',')
  console.log(`extracting basemap ${build} to ${bbox}, z${BASEMAP_MIN_ZOOM}-z${BASEMAP_MAX_ZOOM}`)
  execFileSync(
    bin,
    [
      'extract',
      `${PROTOMAPS_BUILDS}/${build}.pmtiles`,
      out,
      `--bbox=${bbox}`,
      `--minzoom=${BASEMAP_MIN_ZOOM}`,
      `--maxzoom=${BASEMAP_MAX_ZOOM}`,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
}

// --- elevation ----------------------------------------------------------------

async function fetchTerrarium(z: number, x: number, y: number): Promise<Buffer> {
  const file = path.join(DEM_CACHE, `${z}-${x}-${y}.png`)
  if (fs.existsSync(file)) return fs.readFileSync(file)
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${TERRARIUM}/${z}/${x}/${y}.png`, { headers: { 'User-Agent': UA } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      fs.writeFileSync(file, buf)
      return buf
    } catch (err) {
      if (attempt >= 4) throw new Error(`terrarium ${z}/${x}/${y}: ${(err as Error).message}`, { cause: err })
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
}

/** Round a Terrarium tile to whole metres and encode it as lossless WebP. */
async function encodeDem(png: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 3) {
    // height = R*256 + G + B/256 - 32768; round the fraction into G (and R).
    if (data[i + 2] >= 128) {
      if (data[i + 1] === 255) {
        data[i + 1] = 0
        data[i] += 1
      } else {
        data[i + 1] += 1
      }
    }
    data[i + 2] = 0
  }
  return sharp(data, { raw: info }).webp({ lossless: true, effort: 6 }).toBuffer()
}

async function pool<T>(items: T[], size: number, fn: (item: T) => Promise<void>) {
  let next = 0
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) await fn(items[next++])
    }),
  )
}

async function buildDem(bin: string, out: string): Promise<Map<string, number>> {
  const addresses: [number, number, number][] = []
  for (let z = DEM_MIN_ZOOM; z <= DEM_MAX_ZOOM; z++) addresses.push(...tilesInBbox(MAP_EXTENT, z))
  console.log(`elevation: ${addresses.length} tiles, z${DEM_MIN_ZOOM}-z${DEM_MAX_ZOOM}`)

  const mbtiles = out.replace(/\.pmtiles$/, '.mbtiles')
  fs.rmSync(mbtiles, { force: true })
  const db = new DatabaseSync(mbtiles)
  db.exec(`CREATE TABLE metadata (name TEXT, value TEXT);
           CREATE TABLE tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB);
           CREATE UNIQUE INDEX tile_index ON tiles (zoom_level, tile_column, tile_row);`)
  const meta = db.prepare('INSERT INTO metadata VALUES (?, ?)')
  for (const [k, v] of Object.entries({
    name: 'Talus Field Yosemite elevation',
    format: 'webp',
    type: 'baselayer',
    encoding: 'terrarium',
    bounds: MAP_EXTENT.join(','),
    center: '-119.6,37.73,10',
    minzoom: String(DEM_MIN_ZOOM),
    maxzoom: String(DEM_MAX_ZOOM),
    attribution: DEM_ATTRIBUTION,
  })) meta.run(k, v)

  const insert = db.prepare('INSERT INTO tiles VALUES (?, ?, ?, ?)')
  const sizes = new Map<string, number>()
  let done = 0
  // Encode in parallel, insert in address order so the archive is
  // byte-identical from one run to the next.
  const encoded = new Map<string, Buffer>()
  await pool(addresses, 8, async ([z, x, y]) => {
    encoded.set(`${z}/${x}/${y}`, await encodeDem(await fetchTerrarium(z, x, y)))
    if (++done % 100 === 0) console.log(`  ${done}/${addresses.length}`)
  })
  for (const [z, x, y] of addresses) {
    const tile = encoded.get(`${z}/${x}/${y}`)!
    insert.run(z, x, 2 ** z - 1 - y, tile) // MBTiles rows are TMS: y counts up from the south
    sizes.set(`dem/${z}/${x}/${y}`, tile.length)
  }
  db.close()

  fs.rmSync(out, { force: true })
  execFileSync(bin, ['convert', mbtiles, out], { stdio: ['ignore', 'ignore', 'inherit'] })
  fs.rmSync(mbtiles)
  return sizes
}

// --- measuring the packs ------------------------------------------------------

class FileRangeSource implements Source {
  private fd: number
  constructor(private file: string) {
    this.fd = fs.openSync(file, 'r')
  }
  getKey() {
    return this.file
  }
  async getBytes(offset: number, length: number): Promise<RangeResponse> {
    const buf = Buffer.alloc(length)
    const n = fs.readSync(this.fd, buf, 0, length, offset)
    return { data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + n) }
  }
}

/** Bytes each tile occupies once decompressed: what the Worker serves and the phone stores. */
async function vectorSizes(file: string, tiles: TileAddress[]): Promise<Map<string, number>> {
  const archive = new PMTiles(new FileRangeSource(file))
  const sizes = new Map<string, number>()
  for (const t of tiles) {
    if (t.kind !== 'vt' || sizes.has(`vt/${t.z}/${t.x}/${t.y}`)) continue
    const tile = await archive.getZxy(t.z, t.x, t.y)
    sizes.set(`vt/${t.z}/${t.x}/${t.y}`, tile ? tile.data.byteLength : 0)
  }
  return sizes
}

function sumPack(tiles: TileAddress[], sizes: Map<string, number>): { tiles: number; bytes: number } {
  let bytes = 0
  for (const t of tiles) bytes += sizes.get(`${t.kind}/${t.z}/${t.x}/${t.y}`) ?? 0
  return { tiles: tiles.length, bytes }
}

// --- main ---------------------------------------------------------------------

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(DEM_CACHE, { recursive: true })
  const bin = pmtilesBin()
  const pinned = process.argv.find((a) => a.startsWith('--build='))?.slice(8)
  const build = pinned ?? (await latestBuild())

  const basemapTmp = path.join(OUT, `basemap-${build}.pmtiles`)
  extractBasemap(bin, build, basemapTmp)
  const demTmp = path.join(OUT, 'dem-work.pmtiles')
  const demSizes = await buildDem(bin, demTmp)

  // One version names both archives: the basemap's build date plus a hash of
  // both files, so a re-cut of either turns over every tile URL.
  const hash = crypto.createHash('sha256')
  hash.update(fs.readFileSync(basemapTmp))
  hash.update(fs.readFileSync(demTmp))
  const version = `${build}-${hash.digest('hex').slice(0, 8)}`
  const basemapOut = path.join(OUT, `basemap-${version}.pmtiles`)
  const demOut = path.join(OUT, `dem-${version}.pmtiles`)
  fs.copyFileSync(basemapTmp, basemapOut)
  fs.renameSync(demTmp, demOut)

  const overview = overviewTiles()
  const regions = Object.fromEntries(OFFLINE_REGIONS.map((r) => [r.id, regionTiles(r.id)]))
  const sizes = new Map([...demSizes, ...(await vectorSizes(basemapOut, [overview, ...Object.values(regions)].flat()))])
  const packs = {
    overview: sumPack(overview, sizes),
    ...Object.fromEntries(Object.entries(regions).map(([id, tiles]) => [id, sumPack(tiles, sizes)])),
  }

  const body = `// GENERATED by scripts/gen-map-tiles.ts. Do not edit; rerun \`npm run map:tiles\`.
//
// The tile archives this build of the app reads. The version is a URL
// segment (/vt/<ver>/..., /dem/<ver>/...) and names the R2 objects, so both
// archives must be in the MAP_TILES bucket before this file ships.

export const TILESET = {
  version: ${JSON.stringify(version)},
  basemapBuild: ${JSON.stringify(build)},
  basemap: { minzoom: ${BASEMAP_MIN_ZOOM}, maxzoom: ${BASEMAP_MAX_ZOOM}, attribution: ${JSON.stringify(BASEMAP_ATTRIBUTION)} },
  dem: { minzoom: ${DEM_MIN_ZOOM}, maxzoom: ${DEM_MAX_ZOOM}, encoding: 'terrarium' as const, attribution: ${JSON.stringify(DEM_ATTRIBUTION)} },
  bounds: ${JSON.stringify(MAP_EXTENT)} as [number, number, number, number],
  /** Tiles and stored bytes per offline pack, measured from the archives. */
  packs: ${JSON.stringify(packs, null, 2).replace(/\n/g, '\n  ')} as Record<string, { tiles: number; bytes: number }>,
}
`
  fs.writeFileSync(GENERATED, body)

  const mb = (n: number) => `${(n / 1e6).toFixed(1)} MB`
  console.log(`\nversion ${version}`)
  console.log(`  basemap ${mb(fs.statSync(basemapOut).size)}  ${basemapOut}`)
  console.log(`  dem     ${mb(fs.statSync(demOut).size)}  ${demOut}`)
  for (const [id, p] of Object.entries(packs)) console.log(`  pack ${id.padEnd(15)} ${String(p.tiles).padStart(5)} tiles  ${mb(p.bytes)}`)
  console.log(`\nwrote ${path.relative(APP_DIR, GENERATED)}. Upload before merging:`)
  console.log(`  npx wrangler r2 object put talus-map-tiles/basemap/${version}.pmtiles --file=${basemapOut} --remote`)
  console.log(`  npx wrangler r2 object put talus-map-tiles/dem/${version}.pmtiles --file=${demOut} --remote`)
}

await main()
