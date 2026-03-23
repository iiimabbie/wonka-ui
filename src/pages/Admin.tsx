import { useEffect, useState } from 'react'
import {
  adminGetAgents, adminPatchAgent, adminGetUsers, adminDeleteUser,
  adminAdjust, adminRefreshMarket, adminGetSettings, adminPutSettings,
} from '../lib/api'

const tabs = [
  { key: 'agents', label: '🤖 Agent 管理' },
  { key: 'users', label: '👥 使用者管理' },
  { key: 'settings', label: '⚙️ 設定' },
  { key: 'market', label: '🔄 市場操作' },
]

export default function Admin() {
  const [tab, setTab] = useState('agents')

  return (
    <div className="page-enter">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>管理後台</h2>
      <div className="flex gap-1 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === t.key ? 'font-medium' : 'hover:bg-gray-100'}`}
            style={tab === t.key ? { backgroundColor: '#FEF3C7', color: 'var(--color-primary)' } : { color: 'var(--color-text-secondary)' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'agents' && <AgentsTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'settings' && <SettingsTab />}
      {tab === 'market' && <MarketTab />}
    </div>
  )
}

/* ── Agents Tab ── */
function AgentsTab() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adjustId, setAdjustId] = useState<string | null>(null)
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () => { adminGetAgents().then(d => { setAgents(d.agents || []); setLoading(false) }) }
  useEffect(load, [])

  const toggleAgent = async (id: string, enabled: boolean) => {
    if (!confirm(`確定要${enabled ? '停用' : '啟用'}這個 Agent 嗎？`)) return
    setBusy(true)
    await adminPatchAgent(id, { enabled: !enabled })
    load()
    setBusy(false)
  }

  const doAdjust = async (agentId: string) => {
    const d = parseInt(delta)
    if (!d || !reason.trim()) return
    setBusy(true)
    await adminAdjust(agentId, d, reason.trim())
    setAdjustId(null); setDelta(''); setReason('')
    load()
    setBusy(false)
  }

  if (loading) return <p style={{ color: 'var(--color-text-secondary)' }}>載入中…</p>

  return (
    <div className="space-y-3">
      {agents.map((a: any) => (
        <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border card-hover">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>{a.name}</span>
              <span className="text-sm ml-3" style={{ color: 'var(--color-text-secondary)' }}>{a.owner_email}</span>
              <span className="text-sm ml-3" style={{ color: 'var(--color-primary)' }}>🍬 {a.balance ?? 0}</span>
              <span className={`text-xs ml-3 px-2 py-0.5 rounded-full ${a.enabled !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {a.enabled !== false ? '啟用' : '停用'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAdjustId(adjustId === a.id ? null : a.id)}
                className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ backgroundColor: '#FEF3C7', color: 'var(--color-primary)' }}
              >發糖</button>
              <button
                onClick={() => toggleAgent(a.id, a.enabled !== false)}
                disabled={busy}
                className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={a.enabled !== false ? { backgroundColor: '#FEE2E2', color: '#B91C1C' } : { backgroundColor: '#D1FAE5', color: '#047857' }}
              >{a.enabled !== false ? '停用' : '啟用'}</button>
            </div>
          </div>
          {adjustId === a.id && (
            <div className="mt-3 flex gap-2 items-end">
              <input type="number" placeholder="數量" value={delta} onChange={e => setDelta(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl border outline-none text-sm" style={{ borderColor: 'var(--color-border)' }} />
              <input type="text" placeholder="原因" value={reason} onChange={e => setReason(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border outline-none text-sm" style={{ borderColor: 'var(--color-border)' }} />
              <button onClick={() => doAdjust(a.id)} disabled={busy}
                className="px-4 py-2 rounded-xl text-sm text-white font-medium" style={{ backgroundColor: 'var(--color-primary)' }}>確認</button>
            </div>
          )}
        </div>
      ))}
      {agents.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>沒有任何 Agent</p>}
    </div>
  )
}

/* ── Users Tab ── */
function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => { adminGetUsers().then(d => { setUsers(d.users || []); setLoading(false) }) }
  useEffect(load, [])

  const deleteUser = async (id: string, email: string) => {
    if (!confirm(`確定要刪除使用者 ${email} 嗎？此操作無法復原。`)) return
    await adminDeleteUser(id)
    load()
  }

  if (loading) return <p style={{ color: 'var(--color-text-secondary)' }}>載入中…</p>

  return (
    <div className="space-y-3">
      {users.map((u: any) => (
        <div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm border card-hover flex items-center justify-between">
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>{u.name || u.email}</span>
            <span className="text-sm ml-3" style={{ color: 'var(--color-text-secondary)' }}>{u.email}</span>
            <span className="text-sm ml-3" style={{ color: 'var(--color-text-secondary)' }}>Agent: {u.agent_count ?? 0}</span>
            {u.role === 'admin' && <span className="text-xs ml-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">管理員</span>}
          </div>
          {u.role !== 'admin' && (
            <button onClick={() => deleteUser(u.id, u.email)}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
              刪除
            </button>
          )}
        </div>
      ))}
      {users.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>沒有任何使用者</p>}
    </div>
  )
}

/* ── Settings Tab ── */
function SettingsTab() {
  const [baseUrl, setBaseUrl] = useState('')
  const [model, setModel] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [keySet, setKeySet] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    adminGetSettings().then(d => {
      setBaseUrl(d.ai_base_url || '')
      setModel(d.ai_model || '')
      setKeySet(!!d.ai_key_set)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    const data: any = { ai_base_url: baseUrl, ai_model: model }
    if (apiKey) data.ai_api_key = apiKey
    await adminPutSettings(data)
    setMsg('已儲存')
    setApiKey('')
    setSaving(false)
  }

  if (loading) return <p style={{ color: 'var(--color-text-secondary)' }}>載入中…</p>

  const inputClass = "w-full px-4 py-3 rounded-xl border outline-none text-sm"

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border max-w-lg">
      <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>AI 設定</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Base URL</label>
          <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} className={inputClass} style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div>
          <label className="text-sm mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Model</label>
          <input value={model} onChange={e => setModel(e.target.value)} className={inputClass} style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div>
          <label className="text-sm mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
            API Key {keySet ? <span className="text-green-600">（已設定）</span> : <span className="text-red-500">（未設定）</span>}
          </label>
          <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="留空則不更新" className={inputClass} style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm text-white font-medium" style={{ backgroundColor: 'var(--color-primary)' }}>
            {saving ? '儲存中…' : '儲存'}
          </button>
          {msg && <span className="text-sm text-green-600">{msg}</span>}
        </div>
      </div>
    </div>
  )
}

/* ── Market Tab ── */
function MarketTab() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const refresh = async () => {
    setLoading(true); setResult(null)
    const res = await adminRefreshMarket()
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <button onClick={refresh} disabled={loading}
        className="px-6 py-2.5 rounded-xl text-sm text-white font-medium" style={{ backgroundColor: 'var(--color-primary)' }}>
        {loading ? '刷新中…' : '🔄 手動刷新市場'}
      </button>
      {result && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h4 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>刷新結果</h4>
          {result.event && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>事件：{result.event.name || result.event.description || JSON.stringify(result.event)}</p>}
          {result.listings && (
            <div className="mt-2 space-y-1">
              {result.listings.map((l: any, i: number) => (
                <p key={i} className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {l.item_name || l.name} — 🍬 {l.price}
                </p>
              ))}
            </div>
          )}
          {!result.event && !result.listings && (
            <pre className="text-xs mt-1 overflow-auto" style={{ color: 'var(--color-text-secondary)' }}>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  )
}
