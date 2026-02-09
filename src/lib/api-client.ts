/**
 * Client-side helpers for making authenticated API requests.
 * These attach the Privy auth token as a Bearer token.
 *
 * Usage in components:
 *   const { getAccessToken } = usePrivy()
 *   const data = await apiRequest('/api/smashes/join', { body: { smashId }, getAccessToken })
 */

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  getAccessToken: () => Promise<string | null>
}

/**
 * Make an authenticated JSON API request.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions
): Promise<T> {
  const token = await options.getAccessToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(endpoint, {
    method: options.method ?? 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error ?? `API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

/**
 * Upload a file through an authenticated API endpoint using FormData.
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  getAccessToken: () => Promise<string | null>
): Promise<T> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      // Do NOT set Content-Type — browser sets it with multipart boundary for FormData
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error ?? `API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}
