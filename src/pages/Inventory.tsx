import { useEffect, useState } from 'react'
import { getMyAgents, getAgentInventory } from '../lib/api'

interface GroupedItem {
  item_name: string
  item_type: string
  count: number
  avg_price: number
  total_cost: number
}

function groupItems(items: any[]): GroupedItem[] {
  const map = new Map<string, GroupedItem>()
  for (const item of items) {
    const key = item.item_name
    const existing = map.get(key)
    if (existing) {
      existing.total_cost += item.acquired_price
      existing.count += 1
      existing.avg_price = Math.round((existing.total_cost / existing.count) * 100) / 100
    } else {
      map.set(key, {
        item_name: item.item_name,
        item_type: item.item_type,
        count: 1,
        avg_price: item.acquired_price,
        total_cost: item.acquired_price,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total_cost - a.total_cost)
}

export default function Inventory() {
  const [items, setItems] = useState<any[]>([])
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
      getAgentInventory(agent.id).then(inv => {
        setItems(inv.items || [])
        setLoading(false)
      })
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>
  if (noAgent) return <div className="text-center py-12 text-gray-400">請先建立 Agent</div>

  const grouped = groupItems(items)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">🎒 {agentName} 的背包</h2>

      <div className="space-y-3">
        {grouped.map((g) => (
          <div key={g.item_name} className="bg-white rounded-2xl p-4 shadow-sm border card-hover flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <p className="font-medium">
                {g.item_name}
                {g.count > 1 && <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-amber-100" style={{ color: 'var(--color-primary)' }}>×{g.count}</span>}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {g.count > 1 ? `均價 ${g.avg_price}` : `買入 ${g.avg_price}`} 🍬 · {g.item_type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{g.total_cost} 🍬</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>總成本</p>
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-center py-8 text-gray-400">背包空空的 🎒</p>
        )}
      </div>
    </div>
  )
}
