"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, MessageSquare, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"


export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await authApi.getDashboardStats()
        // Use recent activity as "bookings" for now as there's no direct booking model
        setBookings(response.data.recentActivity || [])
      } catch (error: any) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])


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
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length > 0 ? bookings.map((booking, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-500">ACT-{idx + 100}</span>
                  <Badge variant={booking.level === "SUCCESS" ? "active" : "pending"} className="capitalize">
                    {booking.level}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.action}</h3>
                <p className="text-gray-600">Details: <span className="font-semibold text-primary">{booking.description}</span></p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">--</span>
                <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                  <Clock className="w-4 h-4" />
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Action Status</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500 w-full"
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none gap-2 rounded-xl">
                  <MessageSquare className="w-4 h-4" /> Log Details
                </Button>
                <Button className="flex-1 md:flex-none gradient-primary text-white rounded-xl">
                  View Activity
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 italic">
            No active bookings or activity found.
          </div>
        )}
      </div>

    </div>
  )
}
