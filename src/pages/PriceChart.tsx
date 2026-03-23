import { useEffect, useState } from 'react'
import { getMarketItems, getPriceHistory } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart() {
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<string>('')
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMarketItems().then(d => {
      const list = d.items || []
      setItems(list)
      if (list.length > 0) setSelected(list[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    getPriceHistory(selected, 100).then(d => {
      const pts = (d.prices || []).reverse().map((p: any) => ({
        ...p,
        time: p.refreshed_at?.slice(5, 16).replace('T', ' '),
      }))
      setPrices(pts)
      setLoading(false)
    })
  }, [selected])

  const selectedItem = items.find(i => i.id === selected)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📈 價格走勢</h2>

      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className="px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={selected === item.id
              ? { backgroundColor: '#FEF3C7', color: 'var(--color-primary)', fontWeight: 500 }
              : { color: 'var(--color-text-secondary)' }
            }
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: 'var(--color-border)' }}>
        {selectedItem && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {selectedItem.description} · 底價 {selectedItem.base_price} 🍬
            </p>
          </div>
        )}

        {loading ? (
          <p className="text-center py-12 text-gray-400">載入中...</p>
        ) : prices.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prices}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  fontSize: 13,
                }}
                formatter={(value: any) => [`${value} 🍬`, '價格']}
                labelFormatter={(label: any) => `時間: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#D97706"
                strokeWidth={2}
                dot={{ fill: '#D97706', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-12 text-gray-400">還沒有價格紀錄，等待市場刷新 ⏳</p>
        )}
      </div>
    </div>
  )
}
