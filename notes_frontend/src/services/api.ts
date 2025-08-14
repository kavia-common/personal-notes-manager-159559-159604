import { config } from '@/config'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  auth?: boolean
  headers?: Record<string, string>
}

interface ApiError extends Error {
  status?: number
  data?: unknown
}

function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

function buildHeaders(opts?: RequestOptions): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers || {}),
  }
  if (opts?.auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(resp: Response) {
  const contentType = resp.headers.get('Content-Type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await resp.json().catch(() => null) : await resp.text().catch(() => null)

  if (!resp.ok) {
    const err: ApiError = new Error((data && (data.message || data.error)) || resp.statusText)
    err.status = resp.status
    err.data = data
    // If unauthorized, clear token and redirect to login
    if (resp.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (typeof window !== 'undefined') {
        const current = window.location.pathname
        const target = `/login?redirect=${encodeURIComponent(current)}`
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = target
        }
      }
    }
    throw err
  }
  return data
}

// PUBLIC_INTERFACE
export async function apiRequest<T = unknown>(
  path: string,
  options?: RequestOptions
): Promise<T> {
  /** Perform an HTTP request to the backend API with sensible defaults.
   * - path: string API path, e.g. '/api/notes'
   * - options: RequestOptions with method, body, headers, and auth flag
   * - returns: parsed JSON response or text
   */
  const url = `${config.apiBaseUrl}${path}`
  const init: RequestInit = {
    method: options?.method || 'GET',
    headers: buildHeaders(options),
  }
  if (options?.body !== undefined) {
    init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
  }
  const resp = await fetch(url, init)
  return handleResponse(resp)
}
