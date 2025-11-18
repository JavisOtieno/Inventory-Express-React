// src/pages/Dashboard.jsx
import { Button } from 'flowbite-react'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useAtom(userAtom)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'User'}!</h1>
            <Button color="failure" onClick={logout}>
              Logout
            </Button>
          </div>
          <p className="text-xl text-gray-700">Your inventory dashboard is ready!</p>
        </div>
      </div>
    </div>
  )
}