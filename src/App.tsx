import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Market from './pages/Market'
import Inventory from './pages/Inventory'
import Leaderboard from './pages/Leaderboard'
import History from './pages/History'
import PriceChart from './pages/PriceChart'
import Login from './pages/Login'
import Register from './pages/Register'
import MyAgents from './pages/MyAgents'

function isLoggedIn() {
  return !!localStorage.getItem('wonka_token')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/prices" element={<PriceChart />} />
          <Route path="/agents" element={<MyAgents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
