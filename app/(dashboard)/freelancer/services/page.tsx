"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Plus } from "lucide-react"

export default function FreelancerServicesPage() {
  const services = [
    {
      id: 1,
      title: "Professional Website Design & Development",
      category: "Web Development",
      price: "Starting at $450",
      active: true,
      sales: 24,
      rating: 4.9
    },
    {
      id: 2,
      title: "React.js Consultation & Bug Fixing",
      category: "Web Development",
      price: "Starting at $80/hr",
      active: true,
      sales: 12,
      rating: 5.0
    },
    {
      id: 3,
      title: "Custom WordPress Theme Development",
      category: "Web Development",
      price: "Starting at $600",
      active: false,
      sales: 5,
      rating: 4.5
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600">Manage your service listings and pricing</p>
        </div>
        <Button className="gradient-primary text-white rounded-xl shadow-lg btn-lift gap-2">
          <Plus className="w-4 h-4" /> Add New Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex-1 flex gap-4 items-center">
              <div className="w-24 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-bold text-gray-900 line-clamp-1">{service.title}</h3>
                   {service.active ? (
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   ) : (
                     <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                   )}
                 </div>
                 <p className="text-sm text-gray-500 mb-2">{service.category}</p>
                 <div className="flex gap-3 text-xs font-medium text-gray-600">
                   <span>{service.sales} Sales</span>
                   <span>★ {service.rating}</span>
                   <span>{service.price}</span>
                 </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 rounded-xl gap-2">
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
