// src/pages/Inventory.jsx
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  TextInput,
  Spinner,
} from 'flowbite-react'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import axios from 'axios'
import TopNavbar from '../components/TopNavbar' // Import the new component


export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', quantity: '' })
  const API_URL = '/api/products'
  const token = localStorage.getItem('token')
  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])
  // Open modal (Add or Edit)
  const openModalHandler = (product = null) => {
    setEditingProduct(product)
    setFormData(product ? { name: product.name, quantity: product.quantity } : { name: '', quantity: '' })
    setOpenModal(true)
  }
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        // UPDATE
        const res = await axios.put(`${API_URL}/${editingProduct.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProducts(products.map(p => p.id === editingProduct.id ? res.data : p))
      } else {
        // CREATE
        const res = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProducts([res.data, ...products])
      }
      setOpenModal(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product')
    }
  }
  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete product')
    }
  }
  // Quantity badge
  const getQuantityBadge = (qty) => {
    if (qty === 0) return <Badge color="failure">Out of Stock</Badge>
    if (qty <= 10) return <Badge color="warning">Low ({qty})</Badge>
    return <Badge color="success">{qty}</Badge>
  }
  return (
       <div className="min-h-screen bg-gray-50">
           
           {/* Use the new component */}
           <TopNavbar />
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product stock</p>
        </div>
        <Button color="purple" size="lg" onClick={() => openModalHandler()}>
          <HiPlus className="mr-2 h-5 w-5" />
          Add Product
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
                <TableHeadCell className="bg-gray-50">Product Name</TableHeadCell>
                <TableHeadCell className="bg-gray-50 text-center">Quantity</TableHeadCell>
                <TableHeadCell className="bg-gray-50 text-right">Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-gray-500">
                    <p className="text-xl">No products yet</p>
                    <Button color="purple" className="mt-4" onClick={() => openModalHandler()}>
                      <HiPlus className="mr-2" /> Add Your First Product
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-sm text-gray-600">
                      #{product.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                    <TableCell className="text-center">{getQuantityBadge(product.quantity)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="xs" color="failure" onClick={() => openModalHandler(product)}>
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button size="xs" color="failure" onClick={() => handleDelete(product.id)}>
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
        <ModalHeader>{editingProduct ? 'Edit Product' : 'Add New Product'}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <TextInput
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Wireless Mouse"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <TextInput
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="0"
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button type="submit" color="purple">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
    </div>
  )
}