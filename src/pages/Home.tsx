import { useEffect, useState } from 'react'
import { getBalance, getSummary } from '../lib/api'

export default function Home() {
  const [balance, setBalance] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    getBalance().then(setBalance)
    getSummary().then(setSummary)
  }, [])

  if (!balance) return <div className="text-center py-12 text-gray-400">載入中...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">歡迎回來，{balance.agent} 🍬</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="目前餘額" value={`${balance.balance} 🍬`} />
        {summary && (
          <>
            <Card
              title="本週收入"
              value={`+${summary.week_earned}`}
              color="var(--color-down)"
            />
            <Card
              title="本週支出"
              value={`${summary.week_spent}`}
              color="var(--color-up)"
            />
          </>
        )}
      </div>
    </div>
  )
}

function Card({ title, value, color }: { title: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ borderColor: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color || 'var(--color-text)' }}>{value}</p>
    </div>
  )
}
