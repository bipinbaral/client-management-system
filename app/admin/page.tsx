"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { Users, Activity, FileText, AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Users", value: "342", icon: Users, trend: { value: 15, isPositive: true }, gradient: "primary" as const },
    { title: "Total Clients", value: "248", icon: Users, trend: { value: 12, isPositive: true }, gradient: "secondary" as const },
    { title: "Active Sessions", value: "89", icon: Activity, trend: { value: 8, isPositive: true }, gradient: "accent" as const },
    { title: "System Issues", value: "3", icon: AlertCircle, trend: { value: -2, isPositive: true }, gradient: "primary" as const },
  ]

  const systemLogs = [
    { id: 1, event: "User Login", user: "john@example.com", timestamp: "2024-01-15 14:32", status: "Success" },
    { id: 2, event: "Payment Processed", user: "jane@example.com", timestamp: "2024-01-15 14:25", status: "Success" },
    { id: 3, event: "Failed Login Attempt", user: "unknown@example.com", timestamp: "2024-01-15 14:18", status: "Failed" },
    { id: 4, event: "Client Added", user: "admin@example.com", timestamp: "2024-01-15 14:10", status: "Success" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* System Logs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent System Logs</h2>
        <div className="space-y-3">
          {systemLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{log.event}</p>
                <p className="text-sm text-gray-600">
                  {log.user} • {log.timestamp}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  log.status === "Success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
