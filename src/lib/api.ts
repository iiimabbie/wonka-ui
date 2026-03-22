const API_URL = import.meta.env.VITE_API_URL || 'https://wonka.linyuu.dev'

async function apiFetch(path: string, options?: RequestInit) {
  const apiKey = localStorage.getItem('wonka_api_key') || ''
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...options?.headers,
    },
  })
  return res.json()
}

export async function getBalance() {
  return apiFetch('/v1/candies/balance')
}

export async function getMarket() {
  return apiFetch('/v1/market')
}

export async function buyItem(listingId: string, idempotencyKey: string) {
  return apiFetch('/v1/market/buy', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId, idempotencyKey }),
  })
}

export async function sellItem(inventoryId: string, idempotencyKey: string) {
  return apiFetch('/v1/market/sell', {
    method: 'POST',
    body: JSON.stringify({ inventory_id: inventoryId, idempotencyKey }),
  })
}

export async function getInventory() {
  return apiFetch('/v1/inventory')
}

export async function getInventoryHistory(limit = 50, offset = 0) {
  return apiFetch(`/v1/inventory/history?limit=${limit}&offset=${offset}`)
}

export async function getLeaderboard() {
  return apiFetch('/v1/candies/leaderboard')
}

export async function getHistory(limit = 50, offset = 0) {
  return apiFetch(`/v1/candies/history?limit=${limit}&offset=${offset}`)
}

export async function getSummary() {
  return apiFetch('/v1/candies/summary')
}

export async function transfer(toAgent: string, amount: number, reason: string, idempotencyKey: string) {
  return apiFetch('/v1/candies/transfer', {
    method: 'POST',
    body: JSON.stringify({ to_agent: toAgent, amount, reason, idempotencyKey }),
  })
}

export async function getTransferHistory(limit = 50, offset = 0) {
  return apiFetch(`/v1/transfers/history?limit=${limit}&offset=${offset}`)
}
