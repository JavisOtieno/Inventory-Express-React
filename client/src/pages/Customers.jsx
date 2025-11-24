// src/pages/Customers.jsx
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  TextInput,
  Spinner
} from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import axios from 'axios'
import TopNavbar from '../components/TopNavBar' // Import the new component

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  
  const API_URL = '/api/customers'
  const token = localStorage.getItem('token')

  // Note: user and handleLogout logic removed from here because it's in TopNavbar now

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Open modal (Add or Edit)
  const openModalHandler = (customer = null) => {
    setEditingCustomer(customer)
    setFormData(customer ? { name: customer.name, phone: customer.phone } : { name: '', phone: '' })
    setOpenModal(true)
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        // UPDATE
        const res = await axios.put(`${API_URL}/${editingCustomer.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCustomers(customers.map(p => p.id === editingCustomer.id ? res.data : p))
      } else {
        // CREATE
        const res = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCustomers([res.data, ...customers])
      }
      setOpenModal(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving customer')
    }
  }

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer? This cannot be undone.')) return
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCustomers(customers.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete customer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Use the new component */}
      <TopNavbar />

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customers</p>
          </div>
          <Button color="purple" size="lg" onClick={() => openModalHandler()}>
            <HiPlus className="mr-2 h-5 w-5" />
            Add Customer
          </Button>
        </div>

        {/* ... Rest of your Table and Modal code ... */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="xl" color="purple" />
            </div>
          ) : (
            <Table hoverable={true}>
              <TableHead>
                <TableRow>
                  <TableHeadCell className="bg-gray-50">ID</TableHeadCell>
                  <TableHeadCell className="bg-gray-50">Name</TableHeadCell>
                  <TableHeadCell className="bg-gray-50">Phone</TableHeadCell>
                  <TableHeadCell className="bg-gray-50 text-right">Actions</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16 text-gray-500">
                      <p className="text-xl">No customers yet</p>
                      <Button color="purple" className="mt-4 mx-auto" onClick={() => openModalHandler()}>
                        <HiPlus className="mr-2" /> Add Your First Customer
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-mono text-sm text-gray-600">
                        #{customer.id.toString().padStart(4, '0')}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="xs" color="light" className="inline-flex" onClick={() => openModalHandler(customer)}>
                          <HiPencil className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button size="xs" color="failure" className="inline-flex" onClick={() => handleDelete(customer.id)}>
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
          <ModalHeader>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Customer Name</Label>
                <TextInput
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. TechCorp Ltd"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <TextInput
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+1 234 567 890"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="purple">
                  {editingCustomer ? 'Update Customer' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}