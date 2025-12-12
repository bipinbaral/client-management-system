"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MessageSquare, Clock } from "lucide-react"

export default function ClientBookingsPage() {
  const bookings = [
    {
      id: "BK-2024-001",
      service: "E-commerce Website Development",
      freelancer: "Alex Walker",
      amount: "$1,200",
      status: "In Progress",
      deadline: "Oct 25, 2024",
      progress: 65,
    },
    {
      id: "BK-2024-002",
      service: "Logo Design Refresh",
      freelancer: "Sarah Chen",
      amount: "$200",
      status: "Completed",
      deadline: "Oct 10, 2024",
      progress: 100,
    },
    {
      id: "BK-2024-003",
      service: "Blog Content Writing (5 Posts)",
      freelancer: "Mike Johnson",
      amount: "$150",
      status: "Pending Approval",
      deadline: "Oct 15, 2024",
      progress: 100,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your active and past orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">History</Button>
          <Button className="gradient-primary text-white rounded-xl">Active Orders</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-500">{booking.id}</span>
                  <Badge variant={booking.status === "Completed" ? "active" : booking.status === "In Progress" ? "pending" : "expired"} className="capitalize">
                    {booking.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.service}</h3>
                <p className="text-gray-600">Freelancer: <span className="font-semibold text-primary">{booking.freelancer}</span></p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{booking.amount}</span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Due: {booking.deadline}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{booking.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${booking.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none gap-2 rounded-xl">
                  <MessageSquare className="w-4 h-4" /> Message
                </Button>
                <Button className="flex-1 md:flex-none gradient-primary text-white rounded-xl">
                  View Details
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
