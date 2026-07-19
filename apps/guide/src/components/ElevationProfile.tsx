// =============================================================================
// ElevationProfile — the full-route elevation chart on a hike's detail page.
// Single-series area + line drawn from verified 3DEP samples; a pointer (or
// finger) scrubs a crosshair with a distance / elevation / grade readout.
// The vertical scale starts at the profile's floor (rounded down), which is
// honest for terrain: the y-axis labels state absolute elevations, and the
// range shown is exactly the hike's elevation band.
// =============================================================================

import { useCallback, useMemo, useRef, useState } from 'react'
import { formatElevation } from '../content/labels'

type Props = {
  /** [mi, ft] over the full walked route (out-and-backs already mirrored). */
  profile: [number, number][]
  highPointMi?: number
}

const H = 200
const PAD_L = 46
const PAD_R = 10
const PAD_T = 14
const PAD_B = 24

function niceStep(range: number, target: number): number {
  const raw = range / target
  const mag = 10 ** Math.floor(Math.log10(raw))
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (mag * m >= raw) return mag * m
  }
  return mag * 10
}

export default function ElevationProfile({ profile, highPointMi }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(640)
  const [scrub, setScrub] = useState<number | null>(null) // index into profile

  const measure = useCallback((el: HTMLDivElement | null) => {
    wrapRef.current = el
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(Math.max(280, w))
    })
    ro.observe(el)
  }, [])

  const totalMi = profile[profile.length - 1][0]
  const { minFt, maxFt } = useMemo(() => {
    let lo = Infinity
    let hi = -Infinity
    for (const [, ft] of profile) {
      if (ft < lo) lo = ft
      if (ft > hi) hi = ft
    }
    // Floor/ceiling to a clean 100 ft band; guarantee some vertical span so a
    // dead-flat walk doesn't divide by zero.
    lo = Math.floor(lo / 100) * 100
    hi = Math.max(Math.ceil(hi / 100) * 100, lo + 200)
    return { minFt: lo, maxFt: hi }
  }, [profile])

  const x = useCallback(
    (mi: number) => PAD_L + ((width - PAD_L - PAD_R) * mi) / totalMi,
    [width, totalMi],
  )
  const y = useCallback(
    (ft: number) => PAD_T + (H - PAD_T - PAD_B) * (1 - (ft - minFt) / (maxFt - minFt)),
    [minFt, maxFt],
  )

  const linePath = useMemo(
    () => profile.map(([mi, ft], i) => `${i === 0 ? 'M' : 'L'}${x(mi).toFixed(1)},${y(ft).toFixed(1)}`).join(''),
    [profile, x, y],
  )
  const areaPath = useMemo(
    () => `${linePath}L${x(totalMi).toFixed(1)},${y(minFt)}L${x(0).toFixed(1)},${y(minFt)}Z`,
    [linePath, x, y, totalMi, minFt],
  )

  const yTicks = useMemo(() => {
    const step = niceStep(maxFt - minFt, 4)
    const ticks: number[] = []
    for (let v = Math.ceil(minFt / step) * step; v <= maxFt; v += step) ticks.push(v)
    return ticks
  }, [minFt, maxFt])

  const xTicks = useMemo(() => {
    const step = niceStep(totalMi, 6)
    const ticks: number[] = []
    for (let v = 0; v <= totalMi + 1e-6; v += step) ticks.push(Math.round(v * 100) / 100)
    return ticks
  }, [totalMi])

  const onMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const mi = ((e.clientX - rect.left - PAD_L) / (width - PAD_L - PAD_R)) * totalMi
      if (mi < 0 || mi > totalMi) {
        setScrub(null)
        return
      }
      // nearest profile index
      let lo = 0
      let hi = profile.length - 1
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (profile[mid][0] < mi) lo = mid
        else hi = mid
      }
      setScrub(mi - profile[lo][0] < profile[hi][0] - mi ? lo : hi)
    },
    [width, totalMi, profile],
  )

  const scrubPt = scrub != null ? profile[scrub] : null
  // Grade over the neighboring points, so the readout matches what the eye sees.
  const scrubGrade = useMemo(() => {
    if (scrub == null) return 0
    const a = profile[Math.max(0, scrub - 1)]
    const b = profile[Math.min(profile.length - 1, scrub + 1)]
    const dm = (b[0] - a[0]) * 5280
    return dm > 0 ? ((b[1] - a[1]) / dm) * 100 : 0
  }, [scrub, profile])

  const highPt = useMemo(() => {
    if (highPointMi == null) return null
    let best = profile[0]
    for (const p of profile) if (p[1] > best[1]) best = p
    return best
  }, [profile, highPointMi])

  return (
    <div className="elev" ref={measure}>
      {scrubPt ? (
        <div className="elev__readout" role="status">
          <span className="elev__readout-mi">{scrubPt[0].toFixed(1)} mi</span>
          <span>{formatElevation(Math.round(scrubPt[1]))}</span>
          <span className="elev__readout-grade">
            {scrubGrade > 0.5 ? '↗' : scrubGrade < -0.5 ? '↘' : '→'} {Math.abs(scrubGrade).toFixed(0)}% grade
          </span>
        </div>
      ) : (
        <div className="elev__readout elev__readout--hint">Touch the profile for mile-by-mile numbers</div>
      )}
      <svg
        width={width}
        height={H}
        role="img"
        aria-label={`Elevation profile: ${formatElevation(Math.round(profile[0][1]))} at the start, ${
          highPt ? `${formatElevation(Math.round(highPt[1]))} at the high point, ` : ''
        }over ${totalMi.toFixed(1)} miles`}
        onPointerMove={onMove}
        onPointerLeave={() => setScrub(null)}
      >
        {/* gridlines + y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line className="elev__grid" x1={PAD_L} x2={width - PAD_R} y1={y(v)} y2={y(v)} />
            <text className="elev__tick" x={PAD_L - 6} y={y(v) + 3} textAnchor="end">
              {v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : v}
            </text>
          </g>
        ))}
        {/* x labels */}
        {xTicks.map((v) => (
          <text key={v} className="elev__tick" x={x(v)} y={H - 8} textAnchor="middle">
            {v} mi
          </text>
        ))}
        <path className="elev__area" d={areaPath} />
        <path className="elev__line" d={linePath} />
        {highPt && (
          <g>
            <circle className="elev__high" cx={x(highPt[0])} cy={y(highPt[1])} r={3.5} />
            <text
              className="elev__high-label"
              x={x(highPt[0])}
              y={y(highPt[1]) - 8}
              textAnchor={highPt[0] > totalMi * 0.8 ? 'end' : 'middle'}
            >
              {formatElevation(Math.round(highPt[1]))}
            </text>
          </g>
        )}
        {scrubPt && (
          <g>
            <line
              className="elev__crosshair"
              x1={x(scrubPt[0])}
              x2={x(scrubPt[0])}
              y1={PAD_T}
              y2={H - PAD_B}
            />
            <circle className="elev__dot" cx={x(scrubPt[0])} cy={y(scrubPt[1])} r={4.5} />
          </g>
        )}
      </svg>
    </div>
  )
}
