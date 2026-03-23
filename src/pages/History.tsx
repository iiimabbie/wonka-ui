import { useEffect, useState } from 'react'
import { getMyAgents, getAgentHistory } from '../lib/api'

export default function History() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [noAgent, setNoAgent] = useState(false)

  useEffect(() => {
    getMyAgents().then(d => {
      const agents = d.agents || []
      if (agents.length === 0) {
        setNoAgent(true)
        setLoading(false)
        return
      }
      const agentId = localStorage.getItem('wonka_selected_agent') || agents[0].id
      getAgentHistory(agentId).then(h => {
        setEntries(h.entries || [])
        setLoading(false)
      })
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>
  if (noAgent) return <div className="text-center py-12 text-gray-400">請先建立 Agent</div>

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
