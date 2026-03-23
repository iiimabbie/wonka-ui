import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyAgents } from '../lib/api'

export default function Home() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyAgents().then(d => {
      setAgents(d.agents || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>

  const user = JSON.parse(localStorage.getItem('wonka_user') || '{}')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">歡迎回來，{user.name || user.email || '使用者'} 🍬</h2>

      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent: any) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents`)}
              className="bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{agent.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${agent.enabled ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {agent.enabled ? '啟用中' : '已停用'}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold">{agent.balance ?? '—'} 🍬</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-gray-400 mb-4">尚未建立 Agent</p>
          <button
            onClick={() => navigate('/agents')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            建立第一個 Agent
          </button>
        </div>
      )}
    </div>
  )
}
