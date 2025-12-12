"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { DollarSign, Eye, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FreelancerDashboardPage() {
  const stats = [
    { title: "Total Earnings", value: "$8,450", icon: DollarSign, trend: { value: 15, isPositive: true }, gradient: "primary" as const },
    { title: "Profile Views", value: "1,240", icon: Eye, trend: { value: 8, isPositive: true }, gradient: "secondary" as const },
    { title: "Active Orders", value: "5", icon: Briefcase, trend: { value: 2, isPositive: true }, gradient: "accent" as const },
    { title: "Avg Rating", value: "4.9", icon: Star, trend: { value: 0, isPositive: true }, gradient: "primary" as const },
  ]

  const recentOrders = [
    { id: 1, client: "Acme Corp", service: "Website Redesign", due: "2 days", amount: "$1,200", status: "In Progress" },
    { id: 2, client: "StartUp Inc", service: "Logo Design", due: "1 week", amount: "$300", status: "Not Started" },
    { id: 3, client: "John Doe", service: "Consultation", due: "Today", amount: "$100", status: "Review" },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Freelancer Dashboard 🚀</h1>
          <p className="text-gray-600">Track your performance and manage your work.</p>
        </div>
        <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift">
          Withdraw Funds
        </Button>
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
        {/* Earnings Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <p className="text-gray-400 font-medium">Chart Visualization Placeholder</p>
              <p className="text-sm text-gray-400">Monthly Earnings Graph would go here</p>
            </div>
          </div>
        </div>

        {/* Active Orders List */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{order.client}</h3>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{order.amount}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{order.service}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-red-500 font-medium">Due: {order.due}</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 rounded-xl">View All Orders</Button>
        </div>
      </div>
    </div>
  )
}
