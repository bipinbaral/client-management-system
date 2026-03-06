"use client"

import { useEffect, useMemo, useState } from "react"
import { authApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectHTMLAttributes } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts"

interface ServiceOrder {
  _id: string
  price: number
  status: string
  createdAt: string
}

type StatusFilter = "All" | "Paid" | "Pending" | "Overdue"
type RangeFilter = "last_30_days" | "last_90_days" | "this_year" | "custom"

export default function FreelancerEarningsPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("last_30_days")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await authApi.getFreelancerServiceOrders()
      setOrders(res.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load earnings data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredOrders = useMemo(() => {
    let list = orders

    if (statusFilter !== "All") {
      list = list.filter((o) => {
        const orderStatus = o.status.toLowerCase()
        if (statusFilter === "Paid") {
          return orderStatus === "completed"
        }
        if (statusFilter === "Pending") {
          return orderStatus === "pending" || orderStatus === "accepted"
        }
        return orderStatus === statusFilter.toLowerCase()
      })
    }

    const now = new Date()
    let start: Date | null = null

    if (rangeFilter === "last_30_days") {
      start = new Date()
      start.setDate(start.getDate() - 30)
    } else if (rangeFilter === "last_90_days") {
      start = new Date()
      start.setDate(start.getDate() - 90)
    } else if (rangeFilter === "this_year") {
      start = new Date(now.getFullYear(), 0, 1)
    } else if (rangeFilter === "custom" && customStart && customEnd) {
      start = new Date(customStart)
    }

    if (start) {
      const end = rangeFilter === "custom" && customEnd ? new Date(customEnd) : now
      list = list.filter((o) => {
        const d = new Date(o.createdAt)
        return d >= start! && d <= end
      })
    }

    return list
  }, [orders, statusFilter, rangeFilter, customStart, customEnd])

  const summary = useMemo(() => {
    const totalRevenue = filteredOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.price || 0), 0)

    const pendingAmount = filteredOrders
      .filter((o) => o.status === "pending" || o.status === "accepted")
      .reduce((sum, o) => sum + (o.price || 0), 0)

    const overdueAmount = 0

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
    }
  }, [filteredOrders])

  const chartData = useMemo(() => {
    const buckets: Record<string, number> = {}

    // We process ALL orders for the chart to show the trend, 
    // but we color or filter based on status if needed. 
    // Usually, "Earnings" graph shows completed (paid) earnings.
    filteredOrders.forEach((o) => {
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (!buckets[key]) buckets[key] = 0
      if (o.status === "completed") {
        buckets[key] += o.price || 0
      }
    })

    return Object.keys(buckets)
      .sort()
      .map((key) => ({
        name: key,
        earnings: buckets[key],
      }))
  }, [filteredOrders])

  const barData = useMemo(() => {
    const byCategory: Record<string, number> = {}

    filteredOrders.forEach((o) => {
      const key = "Services" // In a real app, this might come from o.service.category
      if (!byCategory[key]) byCategory[key] = 0
      if (o.status === "completed") {
        byCategory[key] += o.price || 0
      }
    })

    return Object.keys(byCategory).map((key) => ({
      name: key,
      value: byCategory[key],
    }))
  }, [filteredOrders])

  const onRangeChange: SelectHTMLAttributes<HTMLSelectElement>["onChange"] = (e) => {
    const value = e.target.value as RangeFilter
    setRangeFilter(value)
  }

  const onStatusChange: SelectHTMLAttributes<HTMLSelectElement>["onChange"] = (e) => {
    const value = e.target.value as StatusFilter
    setStatusFilter(value)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">
            Track your revenue trends, payment breakdowns, and outstanding amounts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={statusFilter}
            onChange={onStatusChange}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700"
          >
            <option value="All">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={rangeFilter}
            onChange={onRangeChange}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700"
          >
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_year">This year</option>
            <option value="custom">Custom range</option>
          </select>

          {rangeFilter === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-10 rounded-xl border-gray-200"
              />
              <span className="text-sm text-gray-400">to</span>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-10 rounded-xl border-gray-200"
              />
            </div>
          )}

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={loadPayments}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Total paid earnings</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">Rs. {summary.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400">All paid invoices in the selected range</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mb-1">Rs. {summary.pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Awaiting payment</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600 mb-1">Rs. {summary.overdueAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Past due date</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Earnings over time</h2>
          </div>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={(value) => `Rs.${value}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Earnings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Not enough data to display chart.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Revenue by subscription</h2>
          </div>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <RechartsTooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                     cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#22c55e' : '#3b82f6'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Not enough data to display chart.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

