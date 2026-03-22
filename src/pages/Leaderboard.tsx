import { useEffect, useState } from 'react'
import { getLeaderboard } from '../lib/api'

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    getLeaderboard().then(d => setData(d.leaderboard || []))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">🏆 排行榜</h2>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        {data.map((entry: any, i: number) => (
          <div
            key={entry.name}
            className="flex items-center justify-between px-5 py-3.5 border-b last:border-b-0"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold w-8" style={{ color: i < 3 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <span className="font-medium">{entry.name}</span>
            </div>
            <span className="font-semibold">{entry.balance} 🍬</span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center py-8 text-gray-400">沒有資料</p>
        )}
      </div>
    </div>
  )
}
