"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { Loader2, TrendingUp, Users, Activity, ShieldAlert } from "lucide-react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'

export default function AdminReportsPage() {
  const [systemStats, setSystemStats] = useState<any>(null)
  const [revenueTrends, setRevenueTrends] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          authApi.getSystemStats(),
          authApi.getRevenueTrends({ days: 30 })
        ])
        setSystemStats(statsRes.data)
        setRevenueTrends(trendsRes.data)
      } catch (error) {
        console.error("Failed to fetch report data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Transform action stats for bar chart
  const actionData = systemStats?.statistics?.actionStats?.map((s: any) => ({
    name: s._id.replace('_', ' '),
    count: s.count
  })) || []

  // Transform level stats for pie chart
  const levelData = systemStats?.statistics?.levelStats?.map((s: any) => ({
    name: s._id,
    value: s.count
  })) || []

  // Transform revenue trends
  const revenueData = revenueTrends?.breakdown?.map((t: any) => ({
    date: t.date,
    amount: t.amount
  })) || []

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Analytics & Reports</h1>
        <p className="text-gray-600">Comprehensive overview of system performance and business metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trends */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Revenue Growth (30 Days)
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Distribution */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              System Activity Spread
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security / Error Logs Level */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Event Severity Distribution
            </h3>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {levelData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention/Growth Stats Summary */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Algorithm Analysis</h3>
            <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-sm text-blue-800 font-bold mb-1">Growth Forecast</p>
                    <p className="text-xs text-blue-600">Based on the last 30 days, the system is projected to grow by {revenueTrends?.growthRate || 8}% next month.</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                    <p className="text-sm text-purple-800 font-bold mb-1">Activity Density</p>
                    <p className="text-xs text-purple-600">The most frequent system action is <span className="font-bold">{(actionData[0]?.name || "N/A")}</span>, accounting for {Math.round((actionData[0]?.count / systemStats?.statistics?.actionStats?.reduce((a:any, b:any) => a + b.count, 0)) * 100) || 0}% of all traffic.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
