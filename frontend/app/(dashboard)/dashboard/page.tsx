"use client"

import { useState, useEffect, useMemo } from "react"
import { authApi } from "@/lib/api"
import { StatsCard } from "@/components/ui/stats-card"
import { Briefcase, CreditCard, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [clientOrders, setClientOrders] = useState<any[]>([])

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    let currentUser = null
    if (userStr) {
      currentUser = JSON.parse(userStr)
      setUser(currentUser)
      
      // Admin redirection
      if (currentUser.role === 'admin') {
        router.push('/admin')
        return
      }
    }

    const fetchDashboardData = async () => {
      try {
        if (currentUser?.role === 'client') {
          const [ordersRes, servicesRes] = await Promise.all([
            authApi.getClientServiceOrders(),
            authApi.getPublicServices({}),
          ])

          const orders = ordersRes.data || []
          setClientOrders(orders)
          const totalBookings = orders.length
          const activeBookings = orders.filter(
            (o: any) => o.status === 'pending' || o.status === 'accepted'
          ).length
          const completedBookings = orders.filter((o: any) => o.status === 'completed').length
          const totalSpent = orders
            .filter((o: any) => o.status === 'completed')
            .reduce((sum: number, o: any) => sum + (o.price || 0), 0)

          const mappedStats = [
            {
              title: "Total Bookings",
              value: totalBookings.toString(),
              icon: Briefcase,
              trend: { value: "", isPositive: true },
              gradient: "primary" as const,
            },
            {
              title: "Active Jobs",
              value: activeBookings.toString(),
              icon: Clock,
              trend: { value: "", isPositive: true },
              gradient: "accent" as const,
            },
            {
              title: "Completed Jobs",
              value: completedBookings.toString(),
              icon: CheckCircle,
              trend: { value: "", isPositive: true },
              gradient: "secondary" as const,
            },
            {
              title: "Total Spent",
              value: `Rs.${totalSpent.toLocaleString()}`,
              icon: CreditCard,
              trend: { value: "", isPositive: true },
              gradient: "primary" as const,
            },
          ]

          setStats(mappedStats)
          setRecommendations((servicesRes.data || []).slice(0, 3))
        } else {
          const [statsRes, servicesRes] = await Promise.all([
            authApi.getDashboardStats(),
            authApi.getPublicServices({}),
          ])

          const data = statsRes.data

          const mappedStats = [
            {
              title: currentUser?.role === 'freelancer' ? "Active Projects" : "Active Services",
              value: data.clients.active.toString(),
              icon: Briefcase,
              trend: {
                value: `${Math.abs(data.clients.growthRate)}%`,
                isPositive: data.clients.growthRate >= 0,
              },
              gradient: "primary" as const,
            },
            {
              title: "Total Earnings",
              value: `Rs.${data.revenue.total}`,
              icon: CreditCard,
              trend: {
                value: `${Math.abs(data.revenue.growthRate)}%`,
                isPositive: data.revenue.growthRate >= 0,
              },
              gradient: "secondary" as const,
            },
            {
              title: "Pending Invoices",
              value: data.payments.pending.toString(),
              icon: Clock,
              trend: { value: "0%", isPositive: true },
              gradient: "accent" as const,
            },
            {
              title: currentUser?.role === 'freelancer' ? "Total Clients" : "Active Users",
              value: data.clients.total.toString(),
              icon: CheckCircle,
              trend: { value: "0%", isPositive: true },
              gradient: "primary" as const,
            },
          ]

          setStats(mappedStats)
          setRecentActivity(data.recentActivity || [])
          setRecommendations((servicesRes.data || []).slice(0, 3))
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])


  const clientThisMonthCount = useMemo(() => {
    const start = new Date()
    start.setDate(1)
    return clientOrders.filter((o: any) => new Date(o.createdAt) >= start).length
  }, [clientOrders])

  const clientActiveCount = useMemo(
    () => clientOrders.filter((o: any) => o.status === "pending" || o.status === "accepted").length,
    [clientOrders],
  )

  const clientCompletedThisMonth = useMemo(() => {
    const now = new Date()
    return clientOrders.filter((o: any) => {
      const d = new Date(o.createdAt)
      return o.status === "completed" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [clientOrders])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {user?.role === 'freelancer'
              ? `Worker Dashboard: ${user?.name}`
              : `Welcome back, ${user?.name?.split(' ')[0] || 'User'}! 👋`}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'freelancer'
              ? "Manage your assigned clients and track your earnings."
              : "Track your bookings, spending, and recommended services in one place."}
          </p>
        </div>

        {user?.role === 'freelancer' ? (
          <Link href="/freelancer/dashboard">
            <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift">
              Go to Worker Panel
            </Button>
          </Link>
        ) : (
          <Link href="/services">
            <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift">
              Browse New Services
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className={`grid ${user?.role === 'admin' ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
        {/* Recent Activity - Admin Only */}
        {user?.role === 'admin' && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (

                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {item.userName ? item.userName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.action}</h3>
                        <p className="text-sm text-gray-600">{item.description} • {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.level === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                        item.level === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="ghost" className="text-primary hover:text-blue-700">
                  View All Activity
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Client analytics (simple bookings breakdown) */}
        {user?.role === 'client' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your bookings overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  This month
                </p>
                <p className="text-2xl font-bold text-gray-900">{clientThisMonthCount}</p>
                <p className="text-xs text-gray-400">Bookings started since the 1st</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Active jobs
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {clientActiveCount}
                </p>
                <p className="text-xs text-gray-400">Waiting for freelancer action</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Completed this month
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {clientCompletedThisMonth}
                </p>
                <p className="text-xs text-gray-400">Completed bookings this month</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommended For You */}
        <div className={`${user?.role === 'admin' ? '' : 'lg:col-span-3'} bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl`}>
          <h2 className="text-xl font-bold mb-4">Top Services for You</h2>
          <p className="text-blue-100 mb-6">Explore curated services from our freelancers based on popularity and ratings.</p>
          
          <div className={`grid ${user?.role === 'admin' ? 'grid-cols-1' : 'md:grid-cols-3'} gap-4`}>
            {recommendations.length > 0 ? recommendations.map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer border border-white/10 hover:border-white/20">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
                    {item.category || 'Service'}
                  </span>
                </div>
                <p className="text-xs text-blue-100 line-clamp-2 mb-2">
                  {item.owner?.name ? `By ${item.owner.name}` : "Freelance service"}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <span className="text-xs font-bold text-white">
                    {item.averageRating && item.averageRating > 0
                      ? `Rating: ${item.averageRating.toFixed(1)}`
                      : "New"}
                  </span>
                  <span className="text-xs text-blue-100">
                    {typeof item.price === "number" ? `Rs. ${item.price}` : ""}
                  </span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-10 text-center">
                 <p className="text-sm text-blue-100 italic opacity-60">No recommendations available at the moment</p>
              </div>
            )}
          </div>

          
          <Button className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl">
            View More
          </Button>
        </div>
      </div>
    </div>
  )
}
