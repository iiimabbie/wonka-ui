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
        {data.map((entry: any, i: number) => {
          const isTop3 = i < 3
          return (
            <div
              key={entry.name}
              className="stagger-item flex items-center justify-between px-5 py-3.5 border-b last:border-b-0"
              style={{
                borderColor: 'var(--color-border)',
                animationDelay: `${i * 0.05}s`,
                ...(isTop3 ? { background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.06) 0%, transparent 100%)' } : {}),
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold w-8 ${isTop3 ? 'text-xl' : ''}`} style={{ color: isTop3 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <span className={`font-medium ${isTop3 ? 'text-base' : 'text-sm'}`}>{entry.name}</span>
              </div>
              <span className={`font-semibold ${isTop3 ? 'text-lg' : ''}`}>{entry.balance} 🍬</span>
            </div>
          )
        })}
        {data.length === 0 && (
          <p className="text-center py-8 text-gray-400">沒有資料</p>
        )}
      </div>
    </div>
  )
}
