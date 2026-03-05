"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { authApi } from "@/lib/api"
import { Clock } from "lucide-react"

interface ServiceOrder {
  _id: string
  price: number
  status: string
  createdAt: string
  service?: {
    title: string
    category: string
  }
  freelancer?: {
    name: string
    email: string
  }
}

export default function ClientBookingsPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await authApi.getClientServiceOrders()
        setOrders(res.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load bookings")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">
            See all the services you have booked and their current status.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">
                      ORDER-{order._id.slice(-6).toUpperCase()}
                    </span>
                    <Badge className={`capitalize ${statusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {order.service?.title || "Booked service"}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    Category:{" "}
                    <span className="font-medium">
                      {order.service?.category || "Service"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Freelancer:{" "}
                    <span className="font-medium text-gray-900">
                      {order.freelancer?.name || "Freelancer"}
                    </span>
                    {order.freelancer?.email && ` (${order.freelancer.email})`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    Rs. {order.price}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                    <Clock className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 italic">
            You have not booked any services yet.
          </div>
        )}
      </div>
    </div>
  )
}

