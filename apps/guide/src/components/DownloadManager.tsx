import { useDownloads, type PackStatus } from '../offline/useDownloads'
import { formatBytes, type Pack } from '../offline/manifest'
import { isIOS, isStandalonePWA } from '../utils/platform'

function statusLabel(status: PackStatus): string {
  switch (status.state) {
    case 'idle':
      return ''
    case 'downloading':
      return `${status.done} / ${status.total}`
    case 'done':
      return 'Downloaded'
    case 'stale':
      return 'Needs re-download'
    case 'error':
      return status.message
  }
}

function Row({
  pack,
  status,
  onDownload,
  onCancel,
  onRemove,
}: {
  pack: Pack
  status: PackStatus
  onDownload: () => void
  onCancel: () => void
  onRemove: () => void
}) {
  const downloading = status.state === 'downloading'
  return (
    <div className="download-row">
      <div>
        <div className="download-row__label">{pack.label}</div>
        <div className="download-row__size">
          {pack.detail} · about {formatBytes(pack.approxBytes)}
        </div>
        {(status.state === 'stale' || status.state === 'error') && (
          <div className="download-row__size" style={{ color: 'var(--moss)' }}>
            {statusLabel(status)}
          </div>
        )}
      </div>
      <div className="download-row__actions">
        {status.state === 'done' && <span className="download-row__status">Downloaded ✓</span>}
        {downloading && (
          <>
            <span className="download-row__status">{statusLabel(status)}</span>
            <button type="button" className="download-row__btn download-row__btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          </>
        )}
        {!downloading && status.state !== 'done' && (
          <button type="button" className="download-row__btn" onClick={onDownload}>
            {status.state === 'stale' || status.state === 'error' ? 'Re-download' : 'Download'}
          </button>
        )}
        {status.state === 'done' && (
          <button type="button" className="download-row__btn download-row__btn--ghost" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      {downloading && (
        <div
          className="download-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={status.total}
          aria-valuenow={status.done}
        >
          <div
            className="download-progress__fill"
            style={{ width: `${Math.round((status.done / Math.max(1, status.total)) * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function DownloadManager() {
  const { packs, statuses, storageEstimate, download, cancel, remove } = useDownloads()

  const totalBytes = packs.reduce((sum, p) => sum + p.approxBytes, 0)
  const pending = packs.filter((p) => statuses[p.id]?.state !== 'done')
  const anyDownloading = packs.some((p) => statuses[p.id]?.state === 'downloading')

  return (
    <section aria-label="Offline downloads">
      <div className="eyebrow" style={{ marginBottom: 6 }}>Offline</div>
      <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.55, margin: '0 0 8px' }}>
        Download the guide before you leave wifi. Everything below together is
        about {formatBytes(totalBytes)}; once it's on the device, the whole app
        works in airplane mode.
      </p>
      {isIOS() && !isStandalonePWA() && (
        <p style={{ color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.55, margin: '0 0 8px' }}>
          On iPhone or iPad, add the app to your home screen first (Share →
          Add to Home Screen). Safari can clear storage for websites it thinks
          are idle; installed apps keep their downloads.
        </p>
      )}

      {pending.length > 0 && !anyDownloading && (
        <p style={{ margin: '14px 0 0' }}>
          <button
            type="button"
            className="download-row__btn"
            onClick={() => {
              // Packs run one at a time; each already fetches 6 URLs at once,
              // and fanning out every pack together swamps slow hotel wifi.
              void (async () => {
                for (const pack of pending) await download(pack)
              })()
            }}
          >
            Download everything
          </button>
        </p>
      )}

      <div style={{ marginTop: 10 }}>
        {packs.map((pack) => (
          <Row
            key={pack.id}
            pack={pack}
            status={statuses[pack.id] ?? { state: 'idle' }}
            onDownload={() => void download(pack)}
            onCancel={() => cancel(pack.id)}
            onRemove={() => void remove(pack)}
          />
        ))}
      </div>

      {storageEstimate && storageEstimate.quota > 0 && (
        <p style={{ color: 'var(--ink-3)', fontSize: 12, margin: '14px 0 0', fontFamily: 'var(--sans)' }}>
          Device storage used by this app: {formatBytes(storageEstimate.usage)} of{' '}
          {formatBytes(storageEstimate.quota)} available.
        </p>
      )}
    </section>
  )
}
