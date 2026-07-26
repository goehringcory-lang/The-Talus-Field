// =============================================================================
// Live park webcams on /today. The one thing the field-day view was missing:
// the forecast says what the day should be, the sun times say when the light
// goes, the waits say how long the gate takes — none of them say what it
// actually looks like out there right now.
//
// This is the guide's only third-party image load, so it is fenced carefully:
//
//   * Offline renders nothing. Not an error, not a placeholder — the whole
//     block disappears, same posture as WaitsLine. Being out of signal in the
//     park is the normal case here, and a row of broken frames would read as
//     the app failing.
//   * Data Saver renders links instead of images. Four camera frames is real
//     bandwidth on a park LTE bar, and a visitor who has asked their phone to
//     economize has said what they want.
//   * Every frame that fails hides itself; if they all fail, the block hides
//     too, so a dead upstream never leaves a heading over nothing.
//   * The service worker never touches these: its fetch handler returns early
//     for cross-origin requests (everything except the /tiles proxy), so a
//     webcam frame can't land in the runtime cache and be served back hours
//     later as if it were live. A stale "live" camera would be worse than none.
// =============================================================================

import { useEffect, useState } from 'react'
import './WebcamStrip.css'

type Webcam = {
  label: string
  file: string
  href: string
  alt: string
}

// Same four cameras the editorial /conditions page carries (Yosemite
// Conservancy / Pixelcaster). Keep the two lists in step.
const WEBCAMS: Webcam[] = [
  {
    label: 'Half Dome',
    file: 'ahwahnee2-t.jpg',
    href: 'https://yosemite.org/webcams/half-dome/',
    alt: 'Live view of Half Dome from Ahwahnee Meadow',
  },
  {
    label: 'Yosemite Falls',
    file: 'yosfalls-t.jpg',
    href: 'https://yosemite.org/webcams/yosemite-falls/',
    alt: 'Live view of Upper Yosemite Falls',
  },
  {
    label: 'El Capitan',
    file: 'turtleback-t.jpg',
    href: 'https://yosemite.org/webcams/el-capitan/',
    alt: 'Live view of El Capitan from Turtleback Dome',
  },
  {
    label: 'Wawona',
    file: 'wawona-t.jpg',
    href: 'https://yosemite.org/webcams/wawona/',
    alt: 'Live view of Wawona',
  },
]

const BASE = 'https://pixelcaster.com/yosemite/webcams/'

// Bucket the cache-buster to five minutes rather than the exact millisecond.
// The cameras themselves refresh on that order, so a per-render Date.now()
// would make each frame a guaranteed cold fetch on every mount and buy no
// freshness at all.
const BUCKET_MS = 5 * 60 * 1000

function prefersReducedData(): boolean {
  // Non-standard but widely shipped on the browsers that matter in the park
  // (Chrome/Android). Absent means no preference expressed.
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  return conn?.saveData === true
}

export default function WebcamStrip() {
  const [online, setOnline] = useState(() => navigator.onLine)
  const [failed, setFailed] = useState<Set<string>>(() => new Set())
  const [saveData] = useState(prefersReducedData)
  // Null until the first effect runs. The clock is read in an effect, not
  // during render, so the component stays pure — and the same effect gives
  // the strip something render-time reading could not: a page left open on a
  // windowsill for an hour turns its frames over instead of showing breakfast
  // at noon.
  const [bucket, setBucket] = useState<number | null>(null)

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  useEffect(() => {
    if (!online) return
    // Re-stamped when the connection returns too, so frames that failed while
    // offline are refetched rather than restored from the browser cache.
    const stamp = () => setBucket(Math.floor(Date.now() / BUCKET_MS))
    stamp()
    const timer = window.setInterval(stamp, BUCKET_MS)
    return () => window.clearInterval(timer)
  }, [online])

  if (!online || bucket === null) return null

  const live = WEBCAMS.filter((cam) => !failed.has(cam.file))
  if (live.length === 0) return null

  return (
    <section className="webcams" aria-label="Live park webcams">
      <span className="eyebrow">Right now, on camera</span>

      {saveData ? (
        // Data Saver: the links still answer "how does it look", without
        // spending the visitor's data to do it.
        <ul className="webcams__links">
          {WEBCAMS.map((cam) => (
            <li key={cam.file}>
              <a href={cam.href} target="_blank" rel="noreferrer">
                {cam.label} →
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="webcams__grid">
          {live.map((cam) => (
            <a
              key={cam.file}
              className="webcams__tile"
              href={cam.href}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="webcams__img"
                src={`${BASE}${cam.file}?t=${bucket}`}
                alt={cam.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                width={480}
                height={320}
                onError={() =>
                  setFailed((prev) => {
                    if (prev.has(cam.file)) return prev
                    const next = new Set(prev)
                    next.add(cam.file)
                    return next
                  })
                }
              />
              <span className="webcams__label">{cam.label}</span>
            </a>
          ))}
        </div>
      )}

      <p className="webcams__credit">
        Live images from{' '}
        <a href="https://yosemite.org/webcams/" target="_blank" rel="noreferrer">
          Yosemite Conservancy / Pixelcaster
        </a>
        . Needs a connection; they will not load once you are out of signal.
      </p>
    </section>
  )
}
