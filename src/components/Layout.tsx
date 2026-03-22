import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBalance } from '../lib/api'

export default function Layout() {
  const [balance, setBalance] = useState<number | null>(null)
  const [agent, setAgent] = useState('')

  useEffect(() => {
    const key = localStorage.getItem('wonka_api_key')
    if (key) {
      getBalance().then(d => {
        if (d.balance !== undefined) {
          setBalance(d.balance)
          setAgent(d.agent)
        }
      })
    }
  }, [])

  const navItems = [
    { to: '/', label: '🏠 首頁' },
    { to: '/market', label: '🏪 菜市場' },
    { to: '/inventory', label: '🎒 背包' },
    { to: '/leaderboard', label: '🏆 排行榜' },
    { to: '/prices', label: '📈 走勢' },
    { to: '/history', label: '📖 帳本' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>
              🍬 Wonka
            </h1>
            <nav className="flex gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'font-medium'
                        : 'hover:bg-gray-100'
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { backgroundColor: '#FEF3C7', color: 'var(--color-primary)' }
                      : { color: 'var(--color-text-secondary)' }
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {balance !== null && (
              <div className="px-3 py-1.5 rounded-full text-sm font-medium"
                   style={{ backgroundColor: '#FEF3C7', color: 'var(--color-primary)' }}>
                🍬 {balance} · {agent}
              </div>
            )}
            <button
              onClick={() => { localStorage.removeItem('wonka_api_key'); window.location.href = '/login' }}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-gray-100"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              登出
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
