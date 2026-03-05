"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { StatsCard } from "@/components/ui/stats-card"
import { Users, Activity, AlertCircle, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await authApi.getDashboardStats()
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch admin stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const statCards = [
    { title: "Total Users", value: stats?.clients?.total || 0, icon: Users, trend: { value: 12, isPositive: true }, gradient: "primary" as const },
    { title: "Active Workouts", value: stats?.workouts?.total || 0, icon: Activity, trend: { value: 5, isPositive: true }, gradient: "secondary" as const },
    { title: "Global Revenue", value: `Rs.${stats?.revenue?.total || 0}`, icon: Activity, trend: { value: 8, isPositive: true }, gradient: "accent" as const },
    { title: "System Health", value: "Optimal", icon: AlertCircle, trend: { value: 0, isPositive: true }, gradient: "primary" as const },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time system monitoring and oversight</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700 px-4 py-1 font-bold">Admin Level Access</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Global Activity Logs</h2>
          <Badge variant="outline" className="text-xs">Live Feed</Badge>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {stats?.recentActivity?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentActivity.map((log: any) => (
                <div key={log._id} className="p-5 hover:bg-gray-50 transition-all flex items-center gap-5 group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    log.level === 'SUCCESS' ? 'bg-green-50 text-green-600' : 
                    log.level === 'ERROR' ? 'bg-red-50 text-red-600' :
                    log.level === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {log.level === 'SUCCESS' ? <ArrowUpRight className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{log.description}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                       <Users className="w-3.5 h-3.5" /> {log.userName || log.user?.name || "System"} • {log.userEmail || log.user?.email || "Auto-generated"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{new Date(log.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 italic">No system activity recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
