import { useEffect, useState } from 'react'
import { getMyAgents, getAgentInventory } from '../lib/api'

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">🎒 {agentName} 的背包</h2>

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
    </div>
  )
}
