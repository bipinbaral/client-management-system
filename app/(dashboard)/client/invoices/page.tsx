"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Filter } from "lucide-react"

export default function ClientInvoicesPage() {
  const invoices = [
    {
      id: "INV-2024-001",
      date: "Oct 25, 2024",
      service: "E-commerce Website Development",
      freelancer: "Alex Walker",
      amount: "$1,200.00",
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      date: "Oct 10, 2024",
      service: "Logo Design Refresh",
      freelancer: "Sarah Chen",
      amount: "$200.00",
      status: "Paid",
    },
    {
      id: "INV-2024-003",
      date: "Oct 30, 2024",
      service: "Blog Content Writing (Milestone 1)",
      freelancer: "Mike Johnson",
      amount: "$75.00",
      status: "Pending",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">View and download your payment history</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-medium text-sm text-gray-500">
          <div className="col-span-1">Invoice ID</div>
          <div className="col-span-2">Service</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div className="divide-y divide-gray-100">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-1 font-mono text-sm text-gray-600">{invoice.id}</div>
              <div className="col-span-2">
                <p className="font-medium text-gray-900 truncate">{invoice.service}</p>
                <p className="text-xs text-gray-500">{invoice.freelancer}</p>
              </div>
              <div className="col-span-1 text-sm text-gray-600">{invoice.date}</div>
              <div className="col-span-1 font-bold text-gray-900">{invoice.amount}</div>
              <div className="col-span-1 flex items-center justify-end gap-3">
                <Badge variant={invoice.status === "Paid" ? "active" : "pending"} className={invoice.status === "Paid" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}>
                  {invoice.status}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
