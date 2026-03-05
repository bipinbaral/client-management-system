"use client"

import { useEffect, useState } from "react"
import { PublicNavbar } from "@/components/common/public-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { authApi } from "@/lib/api"
import { Search, Star, Filter } from "lucide-react"

interface Service {
  _id: string
  title: string
  category: string
  price: number
  averageRating?: number
  reviewCount?: number
  owner?: {
    name: string
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>(["All Categories"])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [bookedServiceIds, setBookedServiceIds] = useState<string[]>([])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)
      const params: Record<string, string> = {}
      if (selectedCategory !== "All Categories") {
        params.category = selectedCategory
      }
      if (search.trim()) {
        params.query = search.trim()
      }
      const res = await authApi.getPublicServices(params)
      const data: Service[] = res.data || []
      setServices(data)

      const cats = Array.from(new Set(data.map((s) => s.category))).sort()
      setCategories(["All Categories", ...cats])
    } catch (err: any) {
      setError(err.message || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchServices()

      try {
        const ordersRes = await authApi.getClientServiceOrders()
        const ids =
          (ordersRes.data || [])
            .map((o: any) => o.service?._id)
            .filter(Boolean) || []
        setBookedServiceIds(ids)
      } catch (e) {
        // ignore, user might not be logged in
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBook = async (service: Service) => {
    if (bookedServiceIds.includes(service._id)) return

    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)
      await authApi.createServiceOrder({ serviceId: service._id })
      setSuccessMessage("Service booked successfully. The freelancer will review your request.")
      setBookedServiceIds((prev) =>
        prev.includes(service._id) ? prev : [...prev, service._id],
      )
    } catch (err: any) {
      setError(err.message || "Failed to book service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Services</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search for any service..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-white border-gray-200 shadow-sm"
              />
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 rounded-xl px-6 bg-white"
              onClick={fetchServices}
              disabled={loading}
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">
            {successMessage}
          </div>
        )}

        {/* Categories Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === selectedCategory
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => {
                setSelectedCategory(cat)
                fetchServices()
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const isBooked = bookedServiceIds.includes(service._id)
            return (
            <div
              key={service._id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                {/* Placeholder Image */}
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-300">
                  IMAGE PLACEHOLDER
                </div>
                <div className="absolute bottom-3 left-3 z-20">
                   <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                     {service.category}
                   </Badge>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {service.owner?.name || "Freelancer"}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {service.averageRating && service.averageRating > 0
                      ? service.averageRating.toFixed(1)
                      : "New"}
                  </span>
                  {typeof service.reviewCount === "number" && service.reviewCount > 0 && (
                    <span className="text-gray-500 text-sm">({service.reviewCount})</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                      Starting at
                    </span>
                    <span className="text-xl font-bold text-gray-900">Rs. {service.price}</span>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl text-sm"
                    onClick={() => handleBook(service)}
                    disabled={loading || isBooked}
                    variant={isBooked ? "outline" : "default"}
                  >
                    {isBooked ? "Booked" : "Book Service"}
                  </Button>
                </div>
              </div>
            </div>
          )})}
          {!loading && services.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">
              No services found yet. Freelancers can add services from their dashboard.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
