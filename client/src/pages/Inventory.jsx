// src/pages/Inventory.jsx
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Button,
} from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'

export default function Inventory() {
  const products = [
    { id: 1, name: 'Wireless Mouse', quantity: 45 },
    { id: 2, name: 'USB-C Hub', quantity: 12 },
    { id: 3, name: 'Mechanical Keyboard', quantity: 8 },
    { id: 4, name: 'Laptop Stand', quantity: 23 },
    { id: 5, name: 'Webcam HD', quantity: 0 },
    { id: 6, name: 'Monitor 27"', quantity: 31 },
    { id: 7, name: 'External SSD 1TB', quantity: 5 },
  ]

  const getQuantityBadge = (qty) => {
    if (qty === 0) return <Badge color="failure">Out of Stock</Badge>
    if (qty <= 10) return <Badge color="warning">Low Stock</Badge>
    return <Badge color="success">{qty}</Badge>
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your product stock</p>
        </div>
        <Button color="purple" size="lg">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="bg-gray-50">Product ID</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Product Name</TableHeadCell>
            <TableHeadCell className="bg-gray-50 text-center">Quantity</TableHeadCell>
            <TableHeadCell className="bg-gray-50">
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>

          <TableBody className="divide-y">
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  #{product.id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-center">
                  {getQuantityBadge(product.quantity)}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="xs" color="light">Edit</Button>
                  <Button size="xs" color="failure">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}