const BASE = '/api/v1'

class ApiError extends Error {
  constructor(status, body, message) {
    super(message)
    this.status = status
    this.body = body
    this.name = 'ApiError'
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...options.headers },
    ...options,
  })
  let data = null
  const text = await res.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    if (data && typeof data === 'object') {
      if (data.messages !== undefined) msg = JSON.stringify(data.messages)
      else if (typeof data.message === 'string') msg = data.message
    }
    throw new ApiError(res.status, data, msg)
  }
  return data
}

export const orderApi = {
  create(payload) {
    return request('/pedidos', { method: 'POST', body: JSON.stringify(payload) })
  },
  get(id) {
    return request(`/pedidos/${encodeURIComponent(id)}`)
  },
  status(id) {
    return request(`/pedidos/${encodeURIComponent(id)}/status`)
  },
}

export const geocodeApi = {
  byCep(cep, { city = '', uf = '', street = '' } = {}) {
    const q = new URLSearchParams({ city, uf, street })
    return request(`/geocode/cep/${encodeURIComponent(cep)}?${q}`)
  },
}

export const storefrontApi = {
  location({ cep, distanceKm = 2.1, city = '', uf = '', street = '' } = {}) {
    const q = new URLSearchParams({ cep, distance_km: distanceKm, city, uf, street })
    return request(`/storefront/location?${q}`)
  },
}
