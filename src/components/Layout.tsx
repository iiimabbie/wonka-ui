import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMyAgents } from '../lib/api'

export default function Layout() {
  const user = JSON.parse(localStorage.getItem('wonka_user') || '{}')
  const displayName = user.name || user.email || '使用者'
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState(localStorage.getItem('wonka_selected_agent') || '')

  useEffect(() => {
    getMyAgents().then(d => {
      const list = d.agents || []
      setAgents(list)
      if (list.length > 0 && !selectedAgent) {
        const first = list[0].id
        setSelectedAgent(first)
        localStorage.setItem('wonka_selected_agent', first)
      }
    })
  }, [])

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAgent(e.target.value)
    localStorage.setItem('wonka_selected_agent', e.target.value)
    window.location.reload()
  }

  const selectedAgentName = agents.find(a => a.id === selectedAgent)?.name || ''

  const navItems = [
    { to: '/', label: '🏠 首頁' },
    { to: '/market', label: '🏪 菜市場' },
    { to: '/inventory', label: '🎒 背包' },
    { to: '/leaderboard', label: '🏆 排行榜' },
    { to: '/prices', label: '📈 走勢' },
    { to: '/history', label: '📖 帳本' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('wonka_token')
    localStorage.removeItem('wonka_user')
    localStorage.removeItem('wonka_selected_agent')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
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
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive ? 'font-medium' : 'hover:bg-gray-100'
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
          <div className="flex items-center gap-3">
            {agents.length > 1 && (
              <select
                value={selectedAgent}
                onChange={handleAgentChange}
                className="px-2 py-1 rounded-lg text-sm border outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>🤖 {a.name}</option>
                ))}
              </select>
            )}
            {agents.length === 1 && selectedAgentName && (
              <span className="text-sm px-2 py-1 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: 'var(--color-primary)' }}>
                🤖 {selectedAgentName}
              </span>
            )}
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-gray-100"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
