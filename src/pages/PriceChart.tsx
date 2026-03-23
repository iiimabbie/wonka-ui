import { useEffect, useState } from 'react'
import { getMarketItems, getPriceHistory } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart() {
  const [items, setItems] = useState<any[]>([])
  const [priceMap, setPriceMap] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMarketItems().then(async d => {
      const list = d.items || []
      setItems(list)

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
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #E5E7EB',
                        fontSize: 12,
                      }}
                      formatter={(value: any) => [`${value} 🍬`, '價格']}
                    />
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
