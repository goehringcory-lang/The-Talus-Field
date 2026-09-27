import { Hono } from 'hono'
import { PMTiles, type Source, type RangeResponse } from 'pmtiles'
import type { Env } from '../env'

// The Field Guide's 3D map tiles: a Protomaps vector basemap and a Terrarium
// elevation model, each one regional PMTiles archive in the MAP_TILES R2
// bucket, served here one tile per URL.
//
// Why per-tile URLs instead of letting MapLibre read the archive directly:
// PMTiles in the browser works by HTTP range requests, and the Cache API
// refuses to store a 206. The PWA's offline story is the service worker's
// cache-first tile cache plus download packs that are flat URL lists
// (apps/guide/src/offline/), so the archive is decomposed here and every tile
// gets a plain, immutable, cacheable URL like the Esri tiles before it.
//
// The version segment is the build stamp scripts/gen-map-tiles.mjs writes
// into apps/guide/src/map/tiles.generated.ts, and it names the R2 object:
// /vt/<ver>/z/x/y.mvt reads basemap/<ver>.pmtiles, /dem/<ver>/z/x/y.webp
// reads dem/<ver>.pmtiles. A rebuild uploads new objects under a new version,
// so every URL is immutable and an installed PWA never mixes two builds in
// one map. Old objects can be deleted once no deployed PWA references them.
//
// Mounted at the root like /tiles: no CORS middleware, ACAO * on every
// response (MapLibre fetches tiles cross-origin from the guide's origin).
// Every route 503s until the MAP_TILES binding exists, so deploying ahead of
// the upload is safe.

const VERSION_RE = /^[a-z0-9-]{1,40}$/
const INT_RE = /^\d{1,7}$/

const ARCHIVES = {
  vt: { prefix: 'basemap', ext: 'mvt', type: 'application/x-protobuf' },
  dem: { prefix: 'dem', ext: 'webp', type: 'image/webp' },
} as const
type Kind = keyof typeof ARCHIVES

// One PMTiles reader per archive per isolate: the header and directories are
// cached inside it, so a warm isolate answers a tile with one R2 range read.
const readers = new Map<string, PMTiles>()

class R2Source implements Source {
  constructor(
    private bucket: R2Bucket,
    private key: string,
  ) {}
  getKey(): string {
    return this.key
  }
  async getBytes(offset: number, length: number): Promise<RangeResponse> {
    const obj = await this.bucket.get(this.key, { range: { offset, length } })
    if (!obj) throw new ArchiveMissing(this.key)
    return { data: await obj.arrayBuffer(), etag: obj.etag }
  }
}

class ArchiveMissing extends Error {}

function readerFor(bucket: R2Bucket, key: string): PMTiles {
  let reader = readers.get(key)
  if (!reader) {
    reader = new PMTiles(new R2Source(bucket, key))
    readers.set(key, reader)
  }
  return reader
}

function bare(status: number): Response {
  return new Response(null, { status, headers: { 'Access-Control-Allow-Origin': '*' } })
}

export const mapTiles = new Hono<{ Bindings: Env }>()

mapTiles.get('/:kind{vt|dem}/:ver/:z/:x/:file', async (c) => {
  const bucket = c.env.MAP_TILES
  if (!bucket) return bare(503)
  const kind = c.req.param('kind') as Kind
  const spec = ARCHIVES[kind]
  const { ver, z, x, file } = c.req.param()
  const dot = file.lastIndexOf('.')
  const y = file.slice(0, dot)
  if (!VERSION_RE.test(ver) || file.slice(dot + 1) !== spec.ext) return bare(404)
  if (!INT_RE.test(z) || !INT_RE.test(x) || !INT_RE.test(y)) return bare(400)
  const zi = Number(z)
  const xi = Number(x)
  const yi = Number(y)
  // Bound to the real pyramid, like /tiles: every distinct triple is a
  // distinct edge-cache entry.
  if (zi > 16 || xi >= 2 ** zi || yi >= 2 ** zi) return bare(400)

  const cache = caches.default
  const cacheKey = new Request(new URL(c.req.url).toString())
  const hit = await cache.match(cacheKey)
  if (hit) return hit

  let tile: RangeResponse | undefined
  try {
    tile = await readerFor(bucket, `${spec.prefix}/${ver}.pmtiles`).getZxy(zi, xi, yi)
  } catch (err) {
    if (err instanceof ArchiveMissing) return bare(404)
    console.error('maptiles: read failed', { kind, ver, z, x, y, err })
    return bare(502)
  }
  // Outside the archive: an empty vector tile is a real answer (MapLibre
  // draws nothing), a missing elevation tile is a 404 the source's bounds
  // keep MapLibre from asking for in the first place.
  if (!tile) return kind === 'vt' ? bare(204) : bare(404)

  const resp = new Response(tile.data, {
    status: 200,
    headers: {
      'Content-Type': spec.type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  })
  c.executionCtx.waitUntil(cache.put(cacheKey, resp.clone()))
  return resp
})
