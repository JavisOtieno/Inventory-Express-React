// src/components/TopNavbar.jsx
import { Avatar, Dropdown } from 'flowbite-react'
import { HiLogout, HiCog } from 'react-icons/hi'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms'
import { useNavigate } from 'react-router-dom'

export default function TopNavbar() {
  // 1. Get the global user state
  const [user, setUser] = useAtom(userAtom)
  const navigate = useNavigate() // <--- Add this

  // 2. Fallback: If atom is empty (rare), try localStorage or default to Guest
  const currentUser = user || JSON.parse(localStorage.getItem('user')) || { 
    name: 'Guest User', 
    email: 'guest@inventory.com', 
    role: 'Visitor' 
  }

  // 3. Handle Logout
  const handleLogout = () => {
    // Clear Local Storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Clear Jotai State
    setUser(null)
    
    // Redirect
    window.location.href = '/login'
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          I
        </div>
        <span className="text-xl font-semibold text-gray-800">Inventory</span>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Name Display (Hidden on mobile) */}
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-500 capitalize">{currentUser.role || 'User'}</p>
        </div>
        
        {/* User Dropdown */}
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar 
              alt="User settings" 
              img="" // You can add currentUser.avatarUrl here if you have one
              placeholderInitials={currentUser.name.charAt(0).toUpperCase()} 
              rounded={true}
              status="online"
              statusPosition="bottom-right"
            />
          }
        >
          {/* Header (Using div replacement for compatibility) */}
          <div className="px-4 py-3 text-sm text-gray-900">
            <span className="block font-bold">{currentUser.name}</span>
            <span className="block truncate font-medium text-gray-500">{currentUser.email}</span>
          </div>

          {/* Divider */}
          <div className="my-1 h-px bg-gray-100" />

          {/* Settings Item */}
          <button 
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            
              onClick={() => navigate('/settings')
            }
          >
            <HiCog className="h-4 w-4" />
            Settings
          </button>
          

          {/* Divider */}
          <div className="my-1 h-px bg-gray-100" />
          
          {/* Logout Item */}
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