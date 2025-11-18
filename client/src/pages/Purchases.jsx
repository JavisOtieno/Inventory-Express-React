// src/pages/Purchases.jsx
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Badge } from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'

export default function Purchases() {
  const purchases = [
    { id: 101, date: '2025-04-01', supplier: 'TechCorp Ltd', total: '$8,450', status: 'Completed' },
    { id: 102, date: '2025-04-03', supplier: 'Global Supplies', total: '$5,200', status: 'Pending' },
    { id: 103, date: '2025-04-05', supplier: 'ElectroWorld', total: '$12,300', status: 'Completed' },
  ]

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
          <p className="text-gray-600 mt-1">Track all purchase orders</p>
        </div>
        <Button color="purple" size="lg">
          <HiPlus className="mr-2 h-5 w-5" /> New Purchase
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="bg-gray-50">PO #</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Date</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Supplier</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Total</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Status</TableHeadCell>
            <TableHeadCell className="bg-gray-50"><span className="sr-only">Actions</span></TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {purchases.map(p => (
              <TableRow key={p.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">PO-{p.id}</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.supplier}</TableCell>
                <TableCell className="font-semibold">{p.total}</TableCell>
                <TableCell>
                  <Badge color={p.status === 'Completed' ? 'success' : 'warning'}>{p.status}</Badge>
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