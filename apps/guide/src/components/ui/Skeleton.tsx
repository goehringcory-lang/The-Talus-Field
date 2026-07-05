// Loading placeholder block. The shimmer disables itself under
// prefers-reduced-motion (components.css), leaving a static paper-2 block.

type Props = {
  width?: string | number
  height?: string | number
  className?: string
}

export default function Skeleton({ width = '100%', height = 16, className }: Props) {
  return (
    <div
      className={`skeleton${className ? ` ${className}` : ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
