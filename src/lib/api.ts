export type ApiErrorPayload = {
  message?: string
  error?: string
  success?: boolean
  data?: any
}

const AUTH_TOKEN_KEY = "bffp_token"

function getStoredAuthToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredAuthToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearStoredAuthToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

function buildHeaders(headers?: HeadersInit, body?: any) {
  const defaultHeaders =
    body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }

  return {
    ...(defaultHeaders),
    ...(headers || {}),
  }
}

async function parseJson(response: Response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      ...(buildHeaders(options.headers, options.body) as Record<string, string>),
      ...(getStoredAuthToken() ? { Authorization: `Bearer ${getStoredAuthToken()}` } : {}),
    },
  })

  const data = await parseJson(response)
  if (!response.ok) {
    const message = typeof data === "object" && data !== null
      ? data.error || data.message || JSON.stringify(data)
      : response.statusText
    const issues = typeof data === "object" && data !== null && data.issues ? ` ${JSON.stringify(data.issues)}` : ""
    throw new Error(`${message}${issues}`)
  }

  return data as T
}

export function getJson<T = any>(path: string) {
  return apiFetch<T>(path, { method: "GET" })
}

export function postJson<T = any>(path: string, body: any) {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) })
}
