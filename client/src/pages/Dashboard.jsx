// src/pages/Dashboard.jsx
import { Button, Card } from 'flowbite-react'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms'
import { useNavigate } from 'react-router-dom'
import { HiCube, HiUsers, HiShoppingCart, HiCurrencyDollar } from 'react-icons/hi'
import TopNavbar from '../components/TopNavBar' // Import the new component


export default function Dashboard() {
  const [user, setUser] = useAtom(userAtom)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  const stats = [
    { title: 'Total Products', value: '1,234', icon: HiCube, color: 'purple' },
    { title: 'Total Customers', value: '89', icon: HiUsers, color: 'blue' },
    { title: 'Total Purchases', value: '456', icon: HiShoppingCart, color: 'green' },
    { title: 'Total Sales', value: '$45,678', icon: HiCurrencyDollar, color: 'pink' },
  ]

  return (
      <div className="min-h-screen bg-gray-50">
          
          {/* Use the new component */}
          <TopNavbar />
      {/* Top bar with user name and logout - visible on all screens */}


      {/* Main dashboard content */}
      <div className="p-6 lg:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="text-center hover:shadow-xl transition-shadow">
                <div className={`inline-flex p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-600 mt-2">{stat.title}</p>
              </Card>
            )
          })}
        </div>

        {/* Welcome message card */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h3 className="text-2xl font-bold">Inventory Pro is ready!</h3>
          <p className="text-lg mt-2 opacity-90">
            Use the sidebar to manage your inventory, suppliers, customers, purchases, and sales.
          </p>
        </Card>
      </div>
    </div>
  )
}