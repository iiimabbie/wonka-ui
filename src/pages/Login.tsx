import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBalance } from '../lib/api'

export default function Login() {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!apiKey.trim()) return
    setLoading(true)
    setError('')

    localStorage.setItem('wonka_api_key', apiKey.trim())
    const res = await getBalance()

    if (res.error) {
      setError('無效的 API Key')
      localStorage.removeItem('wonka_api_key')
    } else {
      navigate('/')
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-sm" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-2xl font-bold text-center mb-1">🍬 Wonka</h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          糖果帳本系統
        </p>

        <input
          type="password"
          placeholder="輸入你的 API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
          style={{ borderColor: 'var(--color-border)' }}
        />

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {loading ? '驗證中...' : '登入'}
        </button>
      </div>
    </div>
  )
}
