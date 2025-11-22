// src/components/TopNavbar.jsx
import { Avatar, Dropdown } from 'flowbite-react'
import { HiLogout, HiCog } from 'react-icons/hi'

export default function TopNavbar() {
  // Logic: Get user and handle logout internally
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Sales Agent', email: 'agent@company.com' }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">I</div>
        <span className="text-xl font-semibold text-gray-800">Inventory</span>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">Sales Rep</p>
        </div>
        
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar 
              alt="User settings" 
              img="" 
              placeholderInitials={user.name ? user.name.charAt(0) : 'U'} 
              rounded={true}
              status="online"
              statusPosition="bottom-right"
            />
          }
        >
          {/* Custom Header */}
          <div className="px-4 py-3 text-sm text-gray-900">
            <span className="block font-bold">{user.name}</span>
            <span className="block truncate font-medium">{user.email}</span>
          </div>

          {/* Custom Divider */}
          <div className="my-1 h-px bg-gray-100" />

          {/* Custom Item: Settings */}
          <button 
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => alert("Settings clicked")}
          >
            <HiCog className="h-4 w-4" />
            Settings
          </button>

          {/* Custom Divider */}
          <div className="my-1 h-px bg-gray-100" />
          
          {/* Custom Item: Logout */}
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
          >
            <HiLogout className="h-4 w-4" />
            Sign out
          </button>
        </Dropdown>
      </div>
    </div>
  )
}