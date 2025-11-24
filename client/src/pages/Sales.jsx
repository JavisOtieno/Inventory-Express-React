// src/pages/Sales.jsx
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
import TopNavbar from '../components/TopNavBar' // Import the new component


export default function Sales() {
  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [formData, setFormData] = useState({ customerId: '', productId: '', quantity: '' })
  const API_URL = '/api/sales'
  const token = localStorage.getItem('token')

  const fetchSales = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      setSales(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load sales')
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/customers', { headers: { Authorization: `Bearer ${token}` } })
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load customers')
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } })
      setProducts(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load products')
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      await Promise.all([fetchSales(), fetchCustomers(), fetchProducts()])
      setLoading(false)
    }
    fetchAll()
  }, [])

  const openModalHandler = (sale = null) => {
    setEditingSale(sale)
    setFormData(sale ? { customerId: sale.customerId.toString(), productId: sale.productId.toString(), quantity: sale.quantity.toString() } : { customerId: '', productId: '', quantity: '' })
    setOpenModal(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      customerId: parseInt(formData.customerId),
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity)
    }
    if (isNaN(data.customerId) || isNaN(data.productId) || isNaN(data.quantity) || data.quantity <= 0) {
      return alert('Please select valid customer, product, and positive quantity')
    }
    try {
      if (editingSale) {
        const res = await axios.put(`${API_URL}/${editingSale.id}`, data, { headers: { Authorization: `Bearer ${token}` } })
        setSales(sales.map(p => p.id === editingSale.id ? res.data : p))
      } else {
        const res = await axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } })
        setSales([res.data, ...sales])
      }
      setOpenModal(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving sale')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale? This will adjust product quantity.')) return
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setSales(sales.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
           <div className="min-h-screen bg-gray-50">
               
               {/* Use the new component */}
               <TopNavbar />
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <p className="text-gray-600 mt-1">Manage sales</p>
        </div>
        <Button color="purple" size="lg" onClick={() => openModalHandler()}>
          <HiPlus className="mr-2 h-5 w-5" />
          Add Sale
        </Button>
      </div>

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
                <TableHeadCell className="bg-gray-50">Customer</TableHeadCell>
                <TableHeadCell className="bg-gray-50">Product</TableHeadCell>
                <TableHeadCell className="bg-gray-50">Quantity</TableHeadCell>
                <TableHeadCell className="bg-gray-50 text-right">Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-gray-500">
                    <p className="text-xl">No sales yet</p>
                    <Button color="purple" className="mt-4" onClick={() => openModalHandler()}>
                      <HiPlus className="mr-2" /> Add Your First Sale
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-sm text-gray-600">
                      #{sale.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{sale.Customer.name}</TableCell>
                    <TableCell>{sale.Product.name}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="xs" color="failure" onClick={() => openModalHandler(sale)}>
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button size="xs" color="failure" onClick={() => handleDelete(sale.id)}>
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
        <ModalHeader>{editingSale ? 'Edit Sale' : 'Add New Sale'}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="customerId">Customer</Label>
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="productId">Product</Label>
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <TextInput
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder="e.g. 10"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button type="submit" color="purple">
                {editingSale ? 'Update Sale' : 'Create Sale'}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
    </div>
  )
}