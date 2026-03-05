"use client"

import { useState, useEffect } from "react"
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
        const [statsRes, workoutsRes] = await Promise.all([
          authApi.getDashboardStats(),
          authApi.getWorkouts({ limit: 2 })
        ])
        
        const data = statsRes.data


        // Map API data to stats cards format
        const mappedStats = [
          { title: currentUser?.role === 'freelancer' ? "Active Projects" : "Active Services", value: data.clients.active.toString(), icon: Briefcase, trend: { value: `${Math.abs(data.clients.growthRate)}%`, isPositive: data.clients.growthRate >= 0 }, gradient: "primary" as const },
          { title: "Total Earnings", value: `Rs.${data.revenue.total}`, icon: CreditCard, trend: { value: `${Math.abs(data.revenue.growthRate)}%`, isPositive: data.revenue.growthRate >= 0 }, gradient: "secondary" as const },
          { title: "Pending Invoices", value: data.payments.pending.toString(), icon: Clock, trend: { value: "0%", isPositive: true }, gradient: "accent" as const },
          { title: currentUser?.role === 'freelancer' ? "Total Clients" : "Active Users", value: data.clients.total.toString(), icon: CheckCircle, trend: { value: "0%", isPositive: true }, gradient: "primary" as const },
        ]

        setStats(mappedStats)
        setRecentActivity(data.recentActivity || [])
        setRecommendations(workoutsRes.data || [])
      } catch (error: any) {

        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }

    }

    fetchDashboardData()
  }, [router])


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {user?.role === 'freelancer' ? `Worker Dashboard: ${user?.name}` : `Welcome back, ${user?.name?.split(' ')[0] || 'User'}! 👋`}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'freelancer' 
              ? "Manage your assigned clients and track your earnings." 
              : "Here's what's happening with your projects."}
          </p>
        </div>

        {user?.role === 'freelancer' ? (
          <Link href="/freelancer/dashboard">
            <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift">
              Go to Worker Panel
            </Button>
          </Link>
        ) : (
          <Link href="/client/services">
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

        {/* Recommended For You */}
        <div className={`${user?.role === 'admin' ? '' : 'lg:col-span-3'} bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl`}>
          <h2 className="text-xl font-bold mb-4">Top Services for You</h2>
          <p className="text-blue-100 mb-6">Explore professional services like video editing, design, and more</p>
          
          <div className={`grid ${user?.role === 'admin' ? 'grid-cols-1' : 'md:grid-cols-3'} gap-4`}>
            {recommendations.length > 0 ? recommendations.map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer border border-white/10 hover:border-white/20">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">{item.category || 'Freelance'}</span>
                </div>
                <p className="text-xs text-blue-100 line-clamp-2 mb-2">{item.description || "Professional service tailored to your needs."}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                   <span className="text-xs font-bold text-white">Rating: {item.rating || '4.9'}</span>
                   <Button size="sm" className="h-7 text-[10px] bg-white text-blue-600 hover:bg-blue-50 py-0">View Details</Button>
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
