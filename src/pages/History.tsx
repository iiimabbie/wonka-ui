import { useEffect, useState } from 'react'
import { getMyAgents, getAgentHistory } from '../lib/api'

interface MergedEntry {
  reason: string
  delta: number
  count: number
  created_at: string
  last_created_at: string
}

/** 合併相鄰的同 reason + 同 delta 紀錄 */
function mergeAdjacentEntries(entries: any[]): MergedEntry[] {
  const result: MergedEntry[] = []
  for (const entry of entries) {
    const last = result[result.length - 1]
    if (last && last.reason === entry.reason && last.delta === entry.delta) {
      last.count += 1
      last.last_created_at = entry.created_at
    } else {
      result.push({
        reason: entry.reason,
        delta: entry.delta,
        count: 1,
        created_at: entry.created_at,
        last_created_at: entry.created_at,
      })
    }
  }
  return result
}

export default function History() {
  const [entries, setEntries] = useState<any[]>([])
  const [agentName, setAgentName] = useState('')
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
      const agent = agents.find((a: any) => a.id === agentId) || agents[0]
      setAgentName(agent.name)
      getAgentHistory(agent.id).then(h => {
        setEntries(h.entries || [])
        setLoading(false)
      })
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>
  if (noAgent) return <div className="text-center py-12 text-gray-400">請先建立 Agent</div>

  const merged = mergeAdjacentEntries(entries)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📖 {agentName} 的帳本</h2>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        {merged.map((entry, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-5 py-3 border-b last:border-b-0 card-hover ${entry.delta > 0 ? 'delta-positive' : entry.delta < 0 ? 'delta-negative' : ''}`}
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div>
              <p className="text-sm font-medium">
                {entry.reason}
                {entry.count > 1 && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100" style={{ color: 'var(--color-text-secondary)' }}>
                    ×{entry.count}
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {entry.created_at?.slice(0, 16).replace('T', ' ')}
                {entry.count > 1 && ` ~ ${entry.last_created_at?.slice(11, 16)}`}
              </p>
            </div>
            <div className="text-right">
              <span
                className="font-semibold"
                style={{ color: entry.delta > 0 ? 'var(--color-down)' : 'var(--color-up)' }}
              >
                {entry.delta > 0 ? '+' : ''}{entry.delta} 🍬
              </span>
              {entry.count > 1 && (
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  共 {entry.delta > 0 ? '+' : ''}{entry.delta * entry.count} 🍬
                </p>
              )}
            </div>
          </div>
        ))}
        {merged.length === 0 && (
          <p className="text-center py-8 text-gray-400">沒有交易紀錄</p>
        )}
      </div>
    </div>
  )
}
