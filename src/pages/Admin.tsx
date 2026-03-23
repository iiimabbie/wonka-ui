import { useEffect, useState } from 'react'
import {
  adminGetAgents, adminPatchAgent, adminGetUsers, adminDeleteUser,
  adminAdjust, adminRefreshMarket, adminGetSettings, adminPutSettings,
  adminRegenerateAgentKey,
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
  const [regenKey, setRegenKey] = useState('')

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

  const handleRegen = async (id: string, name: string) => {
    if (!confirm(`確定要重新產生 ${name} 的 API Key 嗎？`)) return
    setBusy(true)
    const res = await adminRegenerateAgentKey(id)
    if (res.api_key) setRegenKey(res.api_key)
    setBusy(false)
  }

  if (loading) return <p style={{ color: 'var(--color-text-secondary)' }}>載入中…</p>

  return (
    <div className="space-y-3">
      {regenKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
          <p className="text-sm font-medium text-amber-800">🔑 新 API Key：</p>
          <code className="block mt-2 p-3 bg-amber-100 rounded-xl text-sm font-mono break-all select-all">{regenKey}</code>
          <button onClick={() => setRegenKey('')} className="mt-3 text-sm text-amber-600 hover:underline">關閉</button>
        </div>
      )}
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
                onClick={() => handleRegen(a.id, a.name)}
                disabled={busy}
                className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}
              >🔑 Key</button>
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
  const [result, setResult] = useState<any>(() => {
    try { return JSON.parse(sessionStorage.getItem('admin_refresh_result') || 'null') } catch { return null }
  })

  const refresh = async () => {
    setLoading(true); setResult(null)
    const res = await adminRefreshMarket()
    setResult(res)
    sessionStorage.setItem('admin_refresh_result', JSON.stringify(res))
    setLoading(false)
  }

  const eventText = result?.event
    ? (typeof result.event === 'string' ? result.event : result.event.description || JSON.stringify(result.event))
    : null

  return (
    <div className="space-y-4">
      <button onClick={refresh} disabled={loading}
        className="px-6 py-2.5 rounded-xl text-sm text-white font-medium" style={{ backgroundColor: 'var(--color-primary)' }}>
        {loading ? '刷新中…' : '🔄 手動刷新市場'}
      </button>
      {result?.ai_fallback && (
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
          <p className="text-sm text-amber-700">⚠️ AI 定價失敗，使用隨機定價</p>
          {result.ai_error && <p className="text-xs text-amber-500 mt-1">{result.ai_error}</p>}
        </div>
      )}
      {result && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h4 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>刷新結果</h4>
          {eventText && (
            <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: '#FEF3C7' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-primary)' }}>📰 今日事件</p>
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>{eventText}</p>
            </div>
          )}
          {!eventText && !result.ai_fallback && (
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>（無事件）</p>
          )}
          {result.listings && (
            <div className="space-y-2">
              {result.listings.map((l: any, i: number) => {
                const pct = l.delta ? (l.delta * 100).toFixed(0) : null
                const isUp = l.delta > 0
                return (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ backgroundColor: '#FAFAF8' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{l.item_name || l.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>🍬 {l.price}</span>
                      {pct && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isUp ? '↑' : '↓'} {Math.abs(Number(pct))}%
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
