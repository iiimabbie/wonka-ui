import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Market from './pages/Market'
import Inventory from './pages/Inventory'
import History from './pages/History'
import PriceChart from './pages/PriceChart'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'


function isLoggedIn() {
  return !!localStorage.getItem('wonka_token')
}

function isAdmin() {
  let user: any = {}
  try { user = JSON.parse(localStorage.getItem('wonka_user') || '{}') } catch { user = {} }
  return user.role === 'admin'
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return isAdmin() ? <>{children}</> : <Navigate to="/" />
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
          <Route path="/history" element={<History />} />
          <Route path="/prices" element={<PriceChart />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
