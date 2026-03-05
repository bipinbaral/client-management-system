"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"
import { Clock, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react"

interface ServiceOrder {
  _id: string
  price: number
  status: string
  createdAt: string
  service?: {
    title: string
    category: string
  }
  client?: {
    name: string
    email: string
  }
}

export default function FreelancerProjectRequestsPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await authApi.getFreelancerServiceOrders()
      setOrders(res.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load project requests")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (order: ServiceOrder, status: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await authApi.updateServiceOrderStatus(order._id, { status })
      await loadOrders()
    } catch (err: any) {
      setError(err.message || "Failed to update request")
    } finally {
      setIsLoading(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "rejected":
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
          <h1 className="text-3xl font-bold text-gray-900">Project Requests</h1>
          <p className="text-gray-600">Review and manage incoming project requests from clients</p>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {order.service?.title || "Booked service"}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {order.service?.category || "Service booking"}
                  </p>
                  <p className="text-sm text-gray-500">
                    From:{" "}
                    <span className="font-medium text-gray-900">
                      {order.client?.name || "Client"}
                    </span>
                    {order.client?.email && ` (${order.client.email})`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">Rs. {order.price}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                    <Clock className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none gap-2 rounded-xl"
                    onClick={() => updateStatus(order, "accepted")}
                    disabled={isLoading || order.status !== "pending"}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none gap-2 rounded-xl"
                    onClick={() => updateStatus(order, "completed")}
                    disabled={isLoading || (order.status !== "accepted" && order.status !== "pending")}
                  >
                    <XCircle className="w-4 h-4" /> Mark Completed
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 italic">
            You do not have any project requests yet.
          </div>
        )}
      </div>
    </div>
  )
}

