"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Briefcase, CreditCard, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"

interface ServiceOrder {
  _id: string
  price: number
  status: string
  createdAt: string
  client?: {
    name?: string
  }
  service?: {
    title?: string
  }
}

export default function FreelancerDashboardPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.getFreelancerServiceOrders()
        setOrders(res.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load your orders")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const activeProjects = orders.filter(
    (o) => o.status === "pending" || o.status === "accepted"
  ).length
  const completedProjects = orders.filter((o) => o.status === "completed").length
  const totalEarnings = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.price || 0), 0)
  const pendingInvoices = orders.filter((o) => o.status === "pending").length

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      icon: Briefcase,
      trend: { value: "", isPositive: true },
      gradient: "primary" as const,
    },
    {
      title: "Total Earnings",
      value: `Rs.${totalEarnings.toLocaleString()}`,
      icon: CreditCard,
      trend: { value: "", isPositive: true },
      gradient: "secondary" as const,
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      icon: Clock,
      trend: { value: "", isPositive: true },
      gradient: "accent" as const,
    },
    {
      title: "Completed Projects",
      value: completedProjects.toString(),
      icon: CheckCircle,
      trend: { value: "", isPositive: true },
      gradient: "primary" as const,
    },
  ]

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "accepted"
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Freelancer Dashboard</h1>
          <p className="text-gray-600">
            Track your active projects, earnings, and recent work based on real orders.
          </p>
        </div>
        <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift">
          Go to Earnings
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Simple recent earnings summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent completed projects</h2>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter((o) => o.status === "completed")
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.service?.title || "Completed service"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Client: {order.client?.name || "Client"} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">
                      Rs. {order.price || 0}
                    </span>
                  </div>
                ))}
              {orders.filter((o) => o.status === "completed").length === 0 && (
                <p className="text-sm text-gray-500">
                  You don't have any completed projects yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Active Orders List */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Orders</h2>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : activeOrders.length > 0 ? (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {order.client?.name || "Client"}
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Rs. {order.price || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {order.service?.title || "Service order"}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        order.status === "accepted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-gray-500">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              You don't have any active orders right now.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
