import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register, login } from '../lib/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!email.trim() || !password) return
    setLoading(true)
    setError('')

    try {
      const res = await register(email.trim(), password, displayName.trim() || undefined)
      if (res.error) {
        setError(res.error)
        setLoading(false)
        return
      }

      // Auto-login after register
      const loginRes = await login(email.trim(), password)
      if (loginRes.error) {
        setError('註冊成功，但自動登入失敗，請手動登入')
        setLoading(false)
        return
      }

      localStorage.setItem('wonka_token', loginRes.token)
      localStorage.setItem('wonka_user', JSON.stringify(loginRes.user))
      navigate('/')
      window.location.reload()
    } catch {
      setError('註冊失敗，請稍後再試')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg" style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FAF9F5 100%)' }}>
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-sm auth-card" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-2xl font-bold text-center mb-1">🍬 Wonka</h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          建立新帳號
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <input
            type="text"
            placeholder="顯示名稱（選填）"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-200"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {loading ? '註冊中...' : '註冊'}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          已有帳號？{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            登入
          </Link>
        </p>
      </div>
    </div>
  )
}
