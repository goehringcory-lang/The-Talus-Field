// Tiny inline elevation silhouette for hike list rows, drawn from the
// bundled 24-sample spark in trails.generated.ts. Decorative: the row's text
// carries the numbers, so this is aria-hidden.

type Props = { spark: number[] }

const W = 84
const H = 22

export default function TrackSparkline({ spark }: Props) {
  if (spark.length < 2) return null
  const lo = Math.min(...spark)
  const hi = Math.max(...spark)
  const span = Math.max(hi - lo, 100)
  const pts = spark
    .map((ft, i) => {
      const px = (i / (spark.length - 1)) * (W - 2) + 1
      const py = 1 + (H - 2) * (1 - (ft - lo) / span)
      return `${px.toFixed(1)},${py.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg className="hike-spark" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <polyline points={pts} fill="none" />
    </svg>
  )
}
