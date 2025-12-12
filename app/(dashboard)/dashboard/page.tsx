"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { Briefcase, CreditCard, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const stats = [
    { title: "Active Projects", value: "3", icon: Briefcase, trend: { value: 1, isPositive: true }, gradient: "primary" as const },
    { title: "Total Spent", value: "$4,250", icon: CreditCard, trend: { value: 12, isPositive: true }, gradient: "secondary" as const },
    { title: "Pending Orders", value: "1", icon: Clock, trend: { value: 0, isPositive: true }, gradient: "accent" as const },
    { title: "Completed Jobs", value: "12", icon: CheckCircle, trend: { value: 2, isPositive: true }, gradient: "primary" as const },
  ]

  const recentProposals = [
    { id: 1, service: "Website Redesign", freelancer: "Alex Walker", date: "2 hours ago", status: "Pending Review", amount: "$450" },
    { id: 2, service: "SEO Content Pack", freelancer: "Mike Johnson", date: "1 day ago", status: "Accepted", amount: "$80" },
    { id: 3, service: "Logo Design", freelancer: "Sarah Chen", date: "3 days ago", status: "Completed", amount: "$200" },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your projects.</p>
        </div>
        <Link href="/client/services">
          <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift">
            Browse New Services
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentProposals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {item.freelancer.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.service}</h3>
                      <p className="text-sm text-gray-600">by {item.freelancer} • {item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-900">{item.amount}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status}
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

        {/* Recommended For You */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
          <p className="text-blue-100 mb-6">Based on your recent search for "Mobile Apps"</p>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-1">Flutter App Development</h3>
              <p className="text-sm text-blue-100">by David Smith</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
              <h3 className="font-semibold mb-1">UI/UX Design for iOS</h3>
              <p className="text-sm text-blue-100">by Sarah Chen</p>
            </div>
          </div>
          
          <Button className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl">
            View More
          </Button>
        </div>
      </div>
    </div>
  )
}
