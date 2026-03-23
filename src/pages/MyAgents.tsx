import { useEffect, useState } from 'react'
import { getMyAgents, createAgent } from '../lib/api'

export default function MyAgents() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdKey, setCreatedKey] = useState('')
  const [error, setError] = useState('')

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
        setCreatedKey(res.api_key || res.key || '')
        setNewName('')
        setShowCreate(false)
        load()
      }
    } catch {
      setError('建立失敗')
    }
    setCreating(false)
  }

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">🤖 我的 Agent</h2>
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
      <div className="space-y-3">
        {agents.map((agent: any) => (
          <div
            key={agent.id}
            className="bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between"
            style={{ borderColor: 'var(--color-border)' }}
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
            <div className="text-right">
              <p className="text-xl font-bold">{agent.balance ?? '—'} 🍬</p>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">尚未建立 Agent</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              建立第一個 Agent
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
