// src/pages/Register.jsx
import { Button, Label, TextInput, Spinner } from 'flowbite-react'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { userAtom, loadingAtom, toastAtom } from '../atoms'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setUser] = useAtom(userAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setToast] = useAtom(toastAtom)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      })

      // Save token & user
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      setToast({ type: 'success', message: 'Account created successfully!' })

      navigate('/')
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Registration failed',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Inventory Pro</h1>
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              color="purple"
              isProcessing={loading}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-purple-600 font-semibold">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
