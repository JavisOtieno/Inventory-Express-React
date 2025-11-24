// src/pages/Settings.jsx
import { useState, useEffect } from 'react'
import { Button, Card, Label, TextInput, Avatar } from 'flowbite-react'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms'

export default function Settings() {
  // 1. Get User State
  const [atomUser] = useAtom(userAtom)
  
  // 2. Local state for the form (allows editing without changing global state immediately)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '' // Assuming you might have this field
  })

  // 3. Load data on mount
  useEffect(() => {
    // Priority: Atom -> LocalStorage -> Default
    const currentUser = atomUser || JSON.parse(localStorage.getItem('user')) || {}
    
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      role: currentUser.role || 'User',
      phone: currentUser.phone || ''
    })
  }, [atomUser])

  // 4. Handle Save (Placeholder logic)
  const handleSave = (e) => {
    e.preventDefault()
    alert('Save functionality would connect to API here.')
    // Logic: axios.put('/api/user/profile', formData)...
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center pb-4">
              <Avatar 
                size="xl" 
                rounded 
                placeholderInitials={formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                className="mb-4"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900">{formData.name}</h5>
              <span className="text-sm text-gray-500 capitalize">{formData.role}</span>
              <div className="mt-4 flex space-x-3 lg:mt-6">
                 <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                   Active Status
                 </span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Edit Form */}
        <div className="md:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-xl font-bold leading-none text-gray-900">General Information</h5>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Name Field */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Full Name" />
                </div>
                <TextInput 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              {/* Email Field */}
            {/* Email Field - FIXED */}
            <div>
            <div className="mb-2 block">
                <Label htmlFor="email" value="Email Address" />
            </div>
            <TextInput 
                id="email" 
                type="email" 
                value={formData.email}
                disabled 
            />
            {/* Standard HTML helper text to avoid React warnings */}
            <p className="mt-1 text-sm text-gray-500">
                Contact admin to change email
            </p>
            </div>

              {/* Role Field */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="role" value="Role" />
                </div>
                <TextInput 
                  id="role" 
                  value={formData.role}
                  disabled // Role is managed by admin
                  className="capitalize"
                />
              </div>

              {/* <div className="pt-4">
                <Button type="submit" color="purple">
                  Save Changes
                </Button>
              </div> */}
            </form>
          </Card>
        </div>

      </div>
    </div>
  )
}