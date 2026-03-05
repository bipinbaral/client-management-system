"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Download, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"


export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await authApi.getPayments()
        setPayments(response.data)
      } catch (error: any) {
        console.error("Failed to fetch payments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const columns = [
    { key: "invoiceNumber", header: "Invoice" },
    { key: "clientName", header: "Client" },
    { 
      key: "amount", 
      header: "Amount",
      render: (value: number) => `Rs.${value}`
    },
    { 
      key: "date", 
      header: "Date",
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { key: "paymentMethod", header: "Payment Method" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <Badge variant={value.toLowerCase() as any}>{value}</Badge>
      ),
    },
  ]

  const totalRevenue = payments
    .filter(p => p.status === "PAID" || p.status === "Paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const pendingAmount = payments
    .filter(p => p.status === "PENDING" || p.status === "Pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0)


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
          <p className="text-gray-600">Track and manage payments</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium btn-lift shadow-lg">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">Rs.{totalRevenue}</h3>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Payments</p>
              <h3 className="text-3xl font-bold text-gray-900">Rs.{pendingAmount}</h3>
              <p className="text-sm text-yellow-600 mt-1">{payments.filter(p => p.status === "Pending").length} pending</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <h3 className="text-3xl font-bold text-gray-900">{payments.length}</h3>
              <p className="text-sm text-blue-600 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-12 rounded-xl"
        />
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filter</span>
        </button>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table 
          columns={columns} 
          data={payments.filter(p => 
            p.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
          )} 
        />
      )}
    </div>
  )
}
