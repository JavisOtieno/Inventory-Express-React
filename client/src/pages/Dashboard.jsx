// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Card, Spinner } from 'flowbite-react'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms'
import { useNavigate } from 'react-router-dom'
import { HiCube, HiUsers, HiShoppingCart, HiCurrencyDollar } from 'react-icons/hi'
import TopNavbar from '../components/TopNavBar' 
import axios from 'axios'

export default function Dashboard() {
  const [user, setUser] = useAtom(userAtom)
  const navigate = useNavigate()
  
  // State for dashboard data
  const [statsData, setStatsData] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalPurchases: 0,
    totalSales: 0
  })
  const [loading, setLoading] = useState(true)
  const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  console.log('API_BASE_URL:', API_BASE_URL)

  // Fetch Logic
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStatsData(res.data)
      } catch (err) {
        console.error('Failed to load dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Prepare the display array using the fetched data
  const stats = [
    { 
      title: 'Total Products', 
      value: statsData.totalProducts.toLocaleString(), // Adds commas (e.g. 1,234)
      icon: HiCube, 
      color: 'purple' 
    },
    { 
      title: 'Total Customers', 
      value: statsData.totalCustomers.toLocaleString(), 
      icon: HiUsers, 
      color: 'blue' 
    },
    { 
      title: 'Total Purchases', 
      value: statsData.totalPurchases.toLocaleString(), 
      icon: HiShoppingCart, 
      color: 'green' 
    },
    { 
      title: 'Total Sales', 
      value: statsData.totalSales.toLocaleString(), // Or format as currency if backend sends revenue
      icon: HiCurrencyDollar, 
      color: 'pink' 
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar */}
      <TopNavbar />

      {/* Main Content */}
      <div className="p-6 lg:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

        {loading ? (
           <div className="flex justify-center py-20">
             <Spinner size="xl" color="purple" />
           </div>
        ) : (
          /* Stats Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="text-center hover:shadow-xl transition-shadow">
                  <div className={`inline-flex p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mb-4 mx-auto`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-gray-600 mt-2">{stat.title}</p>
                </Card>
              )
            })}
          </div>
        )}

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