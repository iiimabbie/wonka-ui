import { useEffect, useState } from 'react'
import { getMarketItems, getPriceHistory, getMarketEvents } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface EventInfo {
  description: string
  happened_at: string
  time: string
}

function matchEvent(refreshedAt: string, events: EventInfo[]): string | null {
  if (!refreshedAt || events.length === 0) return null
  const t = new Date(refreshedAt).getTime()
  let best: EventInfo | null = null
  let bestDiff = Infinity
  for (const ev of events) {
    const diff = Math.abs(new Date(ev.happened_at).getTime() - t)
    // Match if event happened within 1 hour of the price refresh
    if (diff < 3600000 && diff < bestDiff) {
      best = ev
      bestDiff = diff
    }
  }
  return best?.description || null
}

function CustomTooltip({ active, payload, events }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  const event = matchEvent(data.refreshed_at, events)
  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      padding: '8px 12px',
      fontSize: 12,
      maxWidth: 260,
    }}>
      <p style={{ color: '#D97706', fontWeight: 600 }}>🍬 {data.price}</p>
      <p style={{ color: '#9CA3AF', marginTop: 2 }}>{data.time}</p>
      {event && (
        <p style={{ color: '#78716C', marginTop: 6, fontSize: 11, lineHeight: 1.4 }}>
          📰 {event}
        </p>
      )}
    </div>
  )
}

export default function PriceChart() {
  const [items, setItems] = useState<any[]>([])
  const [priceMap, setPriceMap] = useState<Record<string, any[]>>({})
  const [events, setEvents] = useState<EventInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getMarketItems(),
      getMarketEvents(30),
    ]).then(async ([itemsRes, eventsRes]) => {
      const list = itemsRes.items || []
      setItems(list)

      const evts = (eventsRes.events || []).map((e: any) => ({
        ...e,
        time: e.happened_at?.slice(5, 16).replace('T', ' '),
      }))
      setEvents(evts)

      const map: Record<string, any[]> = {}
      await Promise.all(list.map(async (item: any) => {
        const res = await getPriceHistory(item.id, 100)
        map[item.id] = (res.prices || []).reverse().map((p: any) => ({
          ...p,
          time: p.refreshed_at?.slice(5, 16).replace('T', ' '),
        }))
      }))
      setPriceMap(map)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📈 價格走勢</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => {
          const prices = priceMap[item.id] || []
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="mb-3">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  底價 {item.base_price} 🍬
                  {prices.length > 0 && ` · 最新 ${prices[prices.length - 1].price} 🍬`}
                </p>
              </div>

              {prices.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={prices}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#9CA3AF" width={30} />
                    <Tooltip content={<CustomTooltip events={events} />} />
                    <ReferenceLine y={item.base_price} stroke="#D97706" strokeDasharray="4 4" strokeOpacity={0.4} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#D97706"
                      strokeWidth={2}
                      dot={{ fill: '#D97706', r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-8 text-gray-300 text-sm">尚無價格紀錄</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
