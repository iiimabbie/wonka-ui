const API_URL = import.meta.env.VITE_API_URL || 'https://wonka.linyuu.dev'

async function publicFetch(path: string) {
  const res = await fetch(`${API_URL}${path}`)
  return res.json()
}

async function userFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('wonka_token') || ''
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  })
  if (res.status === 401) {
    localStorage.removeItem('wonka_token')
    localStorage.removeItem('wonka_user')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return res.json()
}

// Auth
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function register(email: string, password: string, name?: string) {
  const res = await fetch(`${API_URL}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  return res.json()
}

// User (auth required)
export async function getProfile() {
  return userFetch('/v1/user/profile')
}

export async function getMyAgents() {
  return userFetch('/v1/agents')
}

export async function createAgent(name: string) {
  return userFetch('/v1/agents/create', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export async function getAgentBalance(agentId: string) {
  return userFetch(`/v1/agents/${agentId}/balance`)
}

export async function getAgentInventory(agentId: string) {
  return userFetch(`/v1/agents/${agentId}/inventory`)
}

export async function getAgentHistory(agentId: string, limit = 50, offset = 0) {
  return userFetch(`/v1/agents/${agentId}/history?limit=${limit}&offset=${offset}`)
}

// Public (no auth)
export async function getMarket() {
  return publicFetch('/v1/market')
}

export async function getMarketItems() {
  return publicFetch('/v1/market/items')
}

export async function getPriceHistory(itemId: string, limit = 100) {
  return publicFetch(`/v1/market/prices?item_id=${itemId}&limit=${limit}`)
}

export async function getMarketEvents(limit = 14) {
  return publicFetch(`/v1/market/events?limit=${limit}`)
}

export async function getLeaderboard() {
  return publicFetch('/v1/candies/leaderboard')
}

// Admin
export async function adminGetAgents() { return userFetch('/v1/admin/agents') }
export async function adminPatchAgent(agentId: string, data: any) { return userFetch(`/v1/admin/agents/${agentId}`, { method: 'PATCH', body: JSON.stringify(data) }) }
export async function adminGetUsers() { return userFetch('/v1/admin/users') }
export async function adminDeleteUser(userId: string) { return userFetch(`/v1/admin/users/${userId}`, { method: 'DELETE' }) }
export async function adminAdjust(agentId: string, delta: number, reason: string) { return userFetch('/v1/admin/adjust', { method: 'POST', body: JSON.stringify({ agent_id: agentId, delta, reason }) }) }
export async function adminRefreshMarket() { return userFetch('/v1/admin/market/refresh', { method: 'POST' }) }
export async function adminGetSettings() { return userFetch('/v1/admin/settings') }
export async function adminPutSettings(data: any) { return userFetch('/v1/admin/settings', { method: 'PUT', body: JSON.stringify(data) }) }
