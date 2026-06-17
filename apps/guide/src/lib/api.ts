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

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  const jwt = getStoredJwt()
  if (jwt) headers.set('Authorization', `Bearer ${jwt}`)

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
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
