"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"


export default function ClientServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await authApi.getWorkouts()
        setServices(response.data)
      } catch (error: any) {
        console.error("Failed to fetch services:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  const categories = [
    "All Categories", "Video Editing", "Web Development", "Graphic Design", "Content Writing", "Digital Marketing"
  ]


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Professional Services</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search for video editing, design, or any service..." 
              className="pl-10 h-12 rounded-xl bg-white border-gray-200 shadow-sm focus-visible:ring-1"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 h-12 rounded-xl px-6 bg-white">
            <Filter className="w-4 h-4" /> Advanced Filters
          </Button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              idx === 0 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? services.map((service) => (
            <div key={service._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-300 font-bold uppercase transition-transform group-hover:scale-105">
                  {service.category || 'Service'}
                </div>
                <div className="absolute bottom-3 left-3 z-20">
                   <Badge className="bg-white/90 text-gray-900 hover:bg-white border-0 shadow-sm">
                     {service.difficulty || 'Expert'}
                   </Badge>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                    PRO
                  </div>
                  <span className="text-sm font-medium text-gray-700">Verified Freelancer</span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2 min-h-[3rem]">
                  {service.title}
                </h3>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{service.rating || '5.0'}</span>
                  <span className="text-gray-500 text-sm">({service.totalRatings || '12'})</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Deliverability</span>
                  <span className="text-xl font-bold text-gray-900 capitalize">Rs.{service.price || '499'}+</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500 italic">
              No services found matching your criteria.
            </div>
          )}
        </div>

      )}
    </div>

  )
}
