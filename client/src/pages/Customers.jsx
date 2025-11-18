// src/pages/Customers.jsx
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Badge } from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'

export default function Customers() {
  const customers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 111 222 333', totalOrders: 24 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 444 555 666', totalOrders: 18 },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 777 888 999', totalOrders: 31 },
  ]

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">View and manage customers</p>
        </div>
        <Button color="purple" size="lg">
          <HiPlus className="mr-2 h-5 w-5" /> Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="bg-gray-50">ID</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Name</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Email</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Phone</TableHeadCell>
            <TableHeadCell className="bg-gray-50 text-center">Total Orders</TableHeadCell>
            <TableHeadCell className="bg-gray-50"><span className="sr-only">Actions</span></TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {customers.map(c => (
              <TableRow key={c.id} className="hover:bg-gray-50">
                <TableCell>#{c.id.toString().padStart(3,'0')}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell className="text-center">
                  <Badge color="indigo">{c.totalOrders}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="xs" color="light">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}