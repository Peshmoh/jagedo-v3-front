import { useState } from "react"
import { Search, Eye, Calendar, Clock, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Invoice {
  id: number | string
  jobId: string
  jobType: string
  skill: string
  description: string
  location: string
  startDate: string
  endDate?: string | null
  status: string
  stage: string
  managedBy: string
  attachments: string[]
  bids: unknown[]
  assignedServiceProviders: unknown[]
  assignedServiceProvider: unknown | null
  amount?: number
}

interface InvoicesTableProps {
  invoices: Invoice[]
  onInvoiceClick: (invoice: Invoice) => void
}

function normalizeStatus(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
    case "active":
      return "pending"
    case "completed":
      return "paid"
    case "cancelled":
      return "overdue"
    default:
      return status.toLowerCase()
  }
}

export function InvoicesTable({ invoices, onInvoiceClick }: InvoicesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch =
      invoice?.jobId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice?.skill?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || normalizeStatus(invoice.status) === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (normalizeStatus(status)) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (normalizeStatus(status)) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalCount = filteredInvoices?.length || 0
  const paidCount = filteredInvoices?.filter((i) => normalizeStatus(i.status) === "paid").length || 0
  const pendingCount = filteredInvoices?.filter((i) => normalizeStatus(i.status) === "pending").length || 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00007a]">{totalCount}</div>
            <p className="text-sm text-gray-500 mt-1">invoices</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
            <p className="text-sm text-gray-500 mt-1">paid</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-sm text-gray-500 mt-1">pending</p>
          </CardContent>
        </Card>
      </div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search invoices..."
            className="pl-10 bg-white border-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white border-none shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      {/* Invoices Table */}
      <Card className="bg-white border-none shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices?.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onInvoiceClick(invoice)}>
                  <TableCell className="font-medium">{invoice.jobId}</TableCell>
                  <TableCell>{invoice.skill.charAt(0).toUpperCase() + invoice.skill.slice(1)}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{invoice.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(invoice.status)}
                        {normalizeStatus(invoice.status).charAt(0).toUpperCase() + normalizeStatus(invoice.status).slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{new Date(invoice.startDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInvoiceClick(invoice)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredInvoices?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">No invoices found</div>
            <p>Try adjusting your search criteria or create a new request</p>
          </div>
        )}
      </Card>
    </div>
  )
}
