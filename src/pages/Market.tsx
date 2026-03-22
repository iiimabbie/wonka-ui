import { useEffect, useState } from 'react'
import { getMarket } from '../lib/api'

export default function Market() {
  const [data, setData] = useState<any>(null)

  useEffect(() => { getMarket().then(setData) }, [])

  if (!data) return <div className="text-center py-12 text-gray-400">載入中...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">🏪 菜市場</h2>

      {/* Event */}
      {data.event?.description && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-amber-800">📰 今日事件</p>
          <p className="text-amber-900 mt-1">{data.event.description}</p>
        </div>
      )}

      {/* Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.listings?.map((item: any) => {
          const diff = item.price - item.base_price
          const pct = ((diff / item.base_price) * 100).toFixed(0)
          const isUp = diff > 0

          return (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.item_name}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.item_description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {item.item_type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{item.price} 🍬</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    底價 {item.base_price}
                  </p>
                  {diff !== 0 && (
                    <span className="text-xs font-medium" style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}>
                      {isUp ? '↑' : '↓'} {Math.abs(diff)} ({isUp ? '+' : ''}{pct}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {(!data.listings || data.listings.length === 0) && (
        <p className="text-center py-8 text-gray-400">目前沒有上架物品，等待下次刷新 ⏳</p>
      )}
    </div>
  )
}
