import { useEffect, useState } from 'react'
import { getHistory } from '../lib/api'

export default function History() {
  const [entries, setEntries] = useState<any[]>([])

  useEffect(() => {
    getHistory().then(d => setEntries(d.entries || []))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📖 帳本</h2>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        {entries.map((entry: any) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-5 py-3 border-b last:border-b-0"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div>
              <p className="text-sm font-medium">{entry.reason}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {entry.created_at?.slice(0, 16).replace('T', ' ')}
              </p>
            </div>
            <span
              className="font-semibold"
              style={{ color: entry.delta > 0 ? 'var(--color-down)' : 'var(--color-up)' }}
            >
              {entry.delta > 0 ? '+' : ''}{entry.delta} 🍬
            </span>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center py-8 text-gray-400">沒有交易紀錄</p>
        )}
      </div>
    </div>
  )
}
