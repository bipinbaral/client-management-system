"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


export default function ServicesManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Marketplace</h1>
          <p className="text-gray-600">Manage and oversee all professional service listings</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium btn-lift shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Service
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by service name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 rounded-xl"
        />
      </div>


      {/* Service Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => 
            s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((service, index) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{service.title}</h3>
                    <Badge variant="outline" className="text-[10px]">{service.category || 'Freelance'}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{service.description || "Professional freelance service providing high-quality results."}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">{service.exercises?.length || 1}</span>
                    <span className="text-gray-500">deliverables</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <span className="text-gray-700">{service.duration || 48} hr turnaround</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.difficulty === "Beginner" 
                      ? "bg-green-100 text-green-700"
                      : service.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {service.difficulty || 'Expert'}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="List a New Professional Service"
        size="lg"
      >
        <form className="p-6 space-y-4">
          <div>
            <Label htmlFor="service-name">Service Title</Label>
            <Input
              id="service-name"
              className="mt-1 h-12 rounded-xl"
              placeholder="e.g., 4K Video Editing Package"
            />
          </div>
          
          <div>
            <Label htmlFor="service-description">Service Description</Label>
            <textarea
              id="service-description"
              className="mt-1 w-full h-24 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Detail what's included in this service..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="turnaround">Turnaround (hours)</Label>
              <Input
                id="turnaround"
                type="number"
                className="mt-1 h-12 rounded-xl"
                placeholder="48"
              />
            </div>
            <div>
              <Label htmlFor="level">Expertise Level</Label>
              <select
                id="level"
                className="mt-1 w-full h-12 px-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Standard</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="deliverables">Number of Deliverables</Label>
            <Input
              id="deliverables"
              type="number"
              className="mt-1 h-12 rounded-xl"
              placeholder="3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 h-12 gradient-primary text-white rounded-xl">
              Publish Service
            </Button>
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
