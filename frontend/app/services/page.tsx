"use client"

import { PublicNavbar } from "@/components/common/public-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Filter } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Professional Website Design & Development",
      freelancer: "Alex Walker",
      rating: 4.9,
      reviews: 128,
      price: 450,
      image: "/placeholder-service-1.jpg",
      category: "Web Development",
      tags: ["React", "Next.js", "Tailwind"],
    },
    {
      id: 2,
      title: "Modern Logo Design & Branding Identity",
      freelancer: "Sarah Chen",
      rating: 5.0,
      reviews: 84,
      price: 200,
      image: "/placeholder-service-2.jpg",
      category: "Graphic Design",
      tags: ["Logo", "Branding", "Minimalist"],
    },
    {
      id: 3,
      title: "SEO Optimized Content Writing",
      freelancer: "Mike Johnson",
      rating: 4.8,
      reviews: 342,
      price: 80,
      image: "/placeholder-service-3.jpg",
      category: "Content Writing",
      tags: ["Blog", "SEO", "Copywriting"],
    },
    {
      id: 4,
      title: "Mobile App Development (iOS & Android)",
      freelancer: "David Smith",
      rating: 4.9,
      reviews: 56,
      price: 1200,
      image: "/placeholder-service-4.jpg",
      category: "Mobile Apps",
      tags: ["Flutter", "React Native"],
    },
    {
      id: 5,
      title: "Social Media Marketing Strategy",
      freelancer: "Emily Rose",
      rating: 4.7,
      reviews: 210,
      price: 300,
      image: "/placeholder-service-5.jpg",
      category: "Digital Marketing",
      tags: ["Instagram", "Facebook", "Growth"],
    },
    {
      id: 6,
      title: "Video Editing for YouTube & Ads",
      freelancer: "Chris Lee",
      rating: 4.9,
      reviews: 95,
      price: 150,
      image: "/placeholder-service-6.jpg",
      category: "Video Animation",
      tags: ["Premiere Pro", "After Effects"],
    },
  ]

  const categories = [
    "All Categories", "Web Development", "Graphic Design", "Content Writing", "Digital Marketing", "Video Animation"
  ]

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
                className="pl-10 h-12 rounded-xl bg-white border-gray-200 shadow-sm"
              />
            </div>
            
            <Button variant="outline" className="flex items-center gap-2 h-12 rounded-xl px-6 bg-white">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
                  <span className="text-sm font-medium text-gray-700">{service.freelancer}</span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{service.rating}</span>
                  <span className="text-gray-500 text-sm">({service.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Starting at</span>
                  <span className="text-xl font-bold text-gray-900">${service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
