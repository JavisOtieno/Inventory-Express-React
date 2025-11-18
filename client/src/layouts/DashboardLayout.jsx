// src/layouts/DashboardLayout.jsx
import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <Outlet />
      </main>
    </div>
  )
}