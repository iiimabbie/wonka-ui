import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Market from './pages/Market'
import Inventory from './pages/Inventory'
import Leaderboard from './pages/Leaderboard'
import History from './pages/History'
import Login from './pages/Login'

function isLoggedIn() {
  return !!localStorage.getItem('wonka_api_key')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
