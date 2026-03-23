import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email.trim() || !password) return
    setLoading(true)
    setError('')

    try {
      const res = await login(email.trim(), password)
      if (res.error) {
        setError(res.error)
      } else {
        localStorage.setItem('wonka_token', res.token)
        localStorage.setItem('wonka_user', JSON.stringify(res.user))
        navigate('/')
        window.location.reload()
      }
    } catch {
      setError('登入失敗，請稍後再試')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg" style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF9F5 100%)' }}>
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-sm auth-card" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-2xl font-bold text-center mb-1">🍬 Wonka</h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          糖果帳本系統
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {loading ? '登入中...' : '登入'}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          還沒有帳號？{' '}
          <Link to="/register" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            註冊
          </Link>
        </p>
      </div>
    </div>
  )
}
