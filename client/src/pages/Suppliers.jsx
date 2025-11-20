// src/pages/Suppliers.jsx
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
  Spinner,
} from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import axios from 'axios'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const API_URL = '/api/suppliers'
  const token = localStorage.getItem('token')

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuppliers(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Open modal (Add or Edit)
  const openModalHandler = (supplier = null) => {
    setEditingSupplier(supplier)
    setFormData(supplier ? { name: supplier.name, phone: supplier.phone } : { name: '', phone: '' })
    setOpenModal(true)
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSupplier) {
        // UPDATE
        const res = await axios.put(`${API_URL}/${editingSupplier.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuppliers(suppliers.map(p => p.id === editingSupplier.id ? res.data : p))
      } else {
        // CREATE
        const res = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuppliers([res.data, ...suppliers])
      }
      setOpenModal(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving supplier')
    }
  }

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier? This cannot be undone.')) return
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuppliers(suppliers.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete supplier')
    }
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-600 mt-1">Manage your suppliers</p>
        </div>
        <Button color="purple" size="lg" onClick={() => openModalHandler()}>
          <HiPlus className="mr-2 h-5 w-5" />
          Add Supplier
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="xl" />
          </div>
        ) : (
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell className="bg-gray-50">ID</TableHeadCell>
                <TableHeadCell className="bg-gray-50">Name</TableHeadCell>
                <TableHeadCell className="bg-gray-50">Phone</TableHeadCell>
                <TableHeadCell className="bg-gray-50 text-right">Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-gray-500">
                    <p className="text-xl">No suppliers yet</p>
                    <Button color="purple" className="mt-4" onClick={() => openModalHandler()}>
                      <HiPlus className="mr-2" /> Add Your First Supplier
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-sm text-gray-600">
                      #{supplier.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{supplier.name}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="xs" color="failure" onClick={() => openModalHandler(supplier)}>
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button size="xs" color="failure" onClick={() => handleDelete(supplier.id)}>
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

      {/* MODAL */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <ModalHeader>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Supplier Name</Label>
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
                {editingSupplier ? 'Update Supplier' : 'Create Supplier'}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  )
}