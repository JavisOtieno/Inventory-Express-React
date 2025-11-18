// src/pages/Suppliers.jsx
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Badge } from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'

export default function Suppliers() {
  const suppliers = [
    { id: 1, name: 'TechCorp Ltd', contact: 'John Doe', email: 'john@techcorp.com', phone: '+1 234 567 890', status: 'Active' },
    { id: 2, name: 'Global Supplies', contact: 'Sarah Lee', email: 'sarah@global.com', phone: '+1 987 654 321', status: 'Active' },
    { id: 3, name: 'ElectroWorld', contact: 'Mike Chen', email: 'mike@eworld.com', phone: '+1 555 123 456', status: 'Inactive' },
  ]

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-600 mt-1">Manage your suppliers</p>
        </div>
        <Button color="purple" size="lg">
          <HiPlus className="mr-2 h-5 w-5" /> Add Supplier
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="bg-gray-50">ID</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Company</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Contact</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Email</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Phone</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Status</TableHeadCell>
            <TableHeadCell className="bg-gray-50"><span className="sr-only">Actions</span></TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {suppliers.map(s => (
              <TableRow key={s.id} className="hover:bg-gray-50">
                <TableCell>#{s.id.toString().padStart(3,'0')}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.contact}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>
                  <Badge color={s.status === 'Active' ? 'success' : 'failure'}>{s.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="xs" color="light">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}