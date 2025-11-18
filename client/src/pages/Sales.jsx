// src/pages/Sales.jsx
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Badge } from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'

export default function Sales() {
  const sales = [
    { id: 501, date: '2025-04-10', customer: 'Alice Johnson', total: '$2,399', status: 'Delivered' },
    { id: 502, date: '2025-04-11', customer: 'Bob Smith', total: '$899', status: 'Shipped' },
    { id: 503, date: '2025-04-12', customer: 'Emma Wilson', total: '$4,199', status: 'Processing' },
  ]

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <p className="text-gray-600 mt-1">Manage all sales orders</p>
        </div>
        <Button color="purple" size="lg">
          <HiPlus className="mr-2 h-5 w-5" /> New Sale
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="bg-gray-50">Invoice #</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Date</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Customer</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Total</TableHeadCell>
            <TableHeadCell className="bg-gray-50">Status</TableHeadCell>
            <TableHeadCell className="bg-gray-50"><span className="sr-only">Actions</span></TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {sales.map(s => (
              <TableRow key={s.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">INV-{s.id}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.customer}</TableCell>
                <TableCell className="font-semibold">{s.total}</TableCell>
                <TableCell>
                  <Badge color={s.status === 'Delivered' ? 'success' : s.status === 'Shipped' ? 'info' : 'warning'}>
                    {s.status}
                  </Badge>
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