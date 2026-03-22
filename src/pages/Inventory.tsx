import { useEffect, useState } from 'react'
import { getInventory, getInventoryHistory } from '../lib/api'

export default function Inventory() {
  const [items, setItems] = useState<any[]>([])
  const [sold, setSold] = useState<any[]>([])
  const [tab, setTab] = useState<'held' | 'sold'>('held')

  useEffect(() => {
    getInventory().then(d => setItems(d.items || []))
    getInventoryHistory().then(d => setSold(d.items || []))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">🎒 背包</h2>

      <div className="flex gap-2">
        {(['held', 'sold'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-sm transition-colors"
            style={tab === t
              ? { backgroundColor: '#FEF3C7', color: 'var(--color-primary)', fontWeight: 500 }
              : { color: 'var(--color-text-secondary)' }
            }
          >
            {t === 'held' ? `持有中 (${items.length})` : `已賣出 (${sold.length})`}
          </button>
        ))}
      </div>

      {tab === 'held' && (
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <p className="font-medium">{item.item_name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  買入 {item.acquired_price} 🍬 · {item.item_type}
                </p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center py-8 text-gray-400">背包空空的 🎒</p>
          )}
        </div>
      )}

      {tab === 'sold' && (
        <div className="space-y-3">
          {sold.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.item_name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    買入 {item.acquired_price} 🍬 → 賣出 {Math.floor(item.acquired_price / 2)} 🍬
                  </p>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.sold_at?.slice(0, 10)}
                </span>
              </div>
            </div>
          ))}
          {sold.length === 0 && (
            <p className="text-center py-8 text-gray-400">還沒有賣出過東西</p>
          )}
        </div>
      )}
    </div>
  )
}
