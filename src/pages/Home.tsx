import { useEffect, useState } from 'react'
import { getMyAgents, createAgent, regenerateAgentKey } from '../lib/api'

export default function Home() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdKey, setCreatedKey] = useState('')
  const [error, setError] = useState('')
  const [regenKey, setRegenKey] = useState('')
  const [regenBusy, setRegenBusy] = useState('')

  const load = () => {
    setLoading(true)
    getMyAgents().then(d => {
      setAgents(d.agents || [])
      setLoading(false)
    })
  }

  useEffect(load, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    setError('')
    try {
      const res = await createAgent(newName.trim())
      if (res.error) {
        setError(res.error)
      } else {
        setCreatedKey(res.api_key || '')
        setNewName('')
        setShowCreate(false)
        load()
      }
    } catch {
      setError('建立失敗')
    }
    setCreating(false)
  }

  const handleRegen = async (agentId: string, agentName: string) => {
    if (!confirm(`確定要重新產生 ${agentName} 的 API Key 嗎？舊的 Key 會立刻失效。`)) return
    setRegenBusy(agentId)
    try {
      const res = await regenerateAgentKey(agentId)
      if (res.api_key) setRegenKey(res.api_key)
    } catch { /* */ }
    setRegenBusy('')
  }

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>

  const user = JSON.parse(localStorage.getItem('wonka_user') || '{}')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">歡迎回來，{user.name || user.email || '使用者'} 🍬</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          建立新 Agent
        </button>
      </div>

      {/* Created key alert */}
      {createdKey && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-green-800">✅ Agent 建立成功！</p>
          <p className="text-sm text-green-700 mt-1">API Key（僅顯示一次，請妥善保存）：</p>
          <code className="block mt-2 p-3 bg-green-100 rounded-xl text-sm font-mono break-all select-all">
            {createdKey}
          </code>
          <button
            onClick={() => setCreatedKey('')}
            className="mt-3 text-sm text-green-600 hover:underline"
          >
            關閉
          </button>
        </div>
      )}

      {/* Regenerated key alert */}
      {regenKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-amber-800">🔑 新的 API Key（僅顯示一次，請妥善保存）：</p>
          <code className="block mt-2 p-3 bg-amber-100 rounded-xl text-sm font-mono break-all select-all">
            {regenKey}
          </code>
          <button onClick={() => setRegenKey('')} className="mt-3 text-sm text-amber-600 hover:underline">關閉</button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm font-medium mb-3">建立新 Agent</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Agent 名稱"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className="flex-1 px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {creating ? '建立中...' : '建立'}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {/* Agent list */}
      {agents.length > 0 ? (
        <div className="space-y-3">
          {agents.map((agent: any) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl p-5 shadow-sm border card-hover flex items-center justify-between"
              style={{ borderColor: 'var(--color-border)', background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFCF5 100%)' }}
            >
              <div>
                <p className="font-semibold text-lg">{agent.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${agent.enabled ? 'bg-green-400' : 'bg-gray-300'}`} />
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {agent.enabled ? '啟用中' : '已停用'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{agent.balance ?? '—'} 🍬</p>
                <button
                  onClick={() => handleRegen(agent.id, agent.name)}
                  disabled={regenBusy === agent.id}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ backgroundColor: '#FEF3C7', color: 'var(--color-primary)' }}
                >
                  {regenBusy === agent.id ? '產生中…' : '🔑 重新產生 Key'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-gray-400">尚未建立 Agent，點上方「建立新 Agent」開始吧！</p>
        </div>
      )}
    </div>
  )
}
