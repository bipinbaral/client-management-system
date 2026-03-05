"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"


export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await authApi.getPayments()
        setInvoices(response.data)
      } catch (error: any) {
        console.error("Failed to fetch invoices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])


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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : invoices.length > 0 ? invoices.map((invoice) => (
            <div key={invoice._id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-1 font-mono text-sm text-gray-600">{invoice.invoiceNumber}</div>
              <div className="col-span-2">
                <p className="font-medium text-gray-900 truncate">Service Payment</p>
                <p className="text-xs text-gray-500">{invoice.paymentMethod}</p>
              </div>
              <div className="col-span-1 text-sm text-gray-600 font-mono">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
              <div className="col-span-1 font-bold text-gray-900">Rs.{invoice.amount}</div>
              <div className="col-span-1 flex items-center justify-end gap-3">
                <Badge 
                  variant={invoice.status.toLowerCase() as any}
                  className={invoice.status === "Paid" || invoice.status === "PAID" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}
                >
                  {invoice.status}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500 italic">No invoices found</div>
          )}
        </div>

      </div>
    </div>
  )
}
