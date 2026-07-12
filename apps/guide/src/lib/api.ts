import { getStoredJwt } from '../auth/storage'

export const API_BASE: string =
  import.meta.env.VITE_API_BASE ?? 'http://localhost:8787'

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(status: number, body: unknown, message: string) {
    super(message)
    this.status = status
    this.body = body
  }
}

// Park Wi-Fi (lodge captive portals especially) can accept a connection and
// then never answer; without a deadline every spinner upstream hangs forever.
const DEFAULT_TIMEOUT_MS = 15_000

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
  opts: { timeoutMs?: number } = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  const jwt = getStoredJwt()
  if (jwt) headers.set('Authorization', `Bearer ${jwt}`)

  // Only impose a deadline when the caller didn't bring its own signal, so an
  // explicit AbortController upstream keeps full control.
  const signal = init.signal ?? AbortSignal.timeout(opts.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers, signal })
  } catch (err) {
    // A timeout means the server never answered: surface it as a plain Error
    // (not ApiError) so callers classify it like any other network failure.
    if (err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
      throw new Error('Request timed out', { cause: err })
    }
    throw err
  }
  const contentType = res.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await res.json()
    : await res.text()

  if (!res.ok) {
    const msg =
      typeof body === 'object' && body && 'error' in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${res.status}`
    throw new ApiError(res.status, body, msg)
  }
  return body as T
}
