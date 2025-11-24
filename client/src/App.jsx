// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'     // create later
import IndividualInventory from './pages/IndividualInventory' // create later
import Suppliers from './pages/Suppliers'     // create later
import Customers from './pages/Customers'     // create later
import Purchases from './pages/Purchases'     // create later
import Sales from './pages/Sales'             // create later
import Settings from './pages/Settings' 

import DashboardLayout from './layouts/DashboardLayout'
import { useAtom } from 'jotai'
import { userAtom } from './atoms'
import { useEffect } from 'react' // Import useEffect

// Protected Route Component
// function ProtectedRoute({ children }) {
//   const [user] = useAtom(userAtom)
//   return user ? children : <Navigate to="/login" replace />
// }
// --- MODIFIED PROTECTED ROUTE ---
function ProtectedRoute({ children }) {
  const [user, setUser] = useAtom(userAtom)

  // 1. Recover state on reload
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    // If atom is empty but storage has data, restore the atom
    if (!user && storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [user, setUser])

  // 2. Authentication Check
  // We check if the Atom exists OR if the token exists in storage.
  // This prevents the redirect while the atom is being restored.
  const isAuthenticated = user || localStorage.getItem('token')

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Main App
export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes – All use DashboardLayout (Sidebar + Topbar) */}
      <Route
        element={
        <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />           {/* ← List of products */}
        <Route path="/inventory/:id" element={<IndividualInventory />} />  {/* ← Later */}
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/sales" element={<Sales />} /> 
        <Route path="/settings" element={<Settings />} />
        

        {/* Optional: 404 inside dashboard */}
        <Route path="*" element={<div className="p-10 text-center text-2xl">Page Not Found</div>} />
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}