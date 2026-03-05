"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { MoreHorizontal, Edit, Plus } from "lucide-react"

interface Service {
  _id: string
  title: string
  description: string
  category: string
  price: number
  isActive: boolean
  averageRating?: number
  reviewCount?: number
}

const defaultForm: Omit<Service, "_id"> = {
  title: "",
  description: "",
  category: "",
  price: 0,
  isActive: true,
}

export default function FreelancerServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form, setForm] = useState(defaultForm)

  const loadServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.getMyServices()
      setServices(res.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const openCreateModal = () => {
    setEditingService(null)
    setForm(defaultForm)
    setIsModalOpen(true)
  }

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      isActive: service.isActive,
    })
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      if (editingService) {
        await authApi.updateService(editingService._id, form)
      } else {
        await authApi.createService(form)
      }

      setIsModalOpen(false)
      await loadServices()
    } catch (err: any) {
      setError(err.message || "Failed to save service")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Delete service "${service.title}"?`)) return
    try {
      setLoading(true)
      setError(null)
      await authApi.deleteService(service._id)
      await loadServices()
    } catch (err: any) {
      setError(err.message || "Failed to delete service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600">Manage your service listings and pricing</p>
        </div>
        <Button
          className="gradient-primary text-white rounded-xl shadow-lg btn-lift gap-2"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4" /> Add New Service
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex-1 flex gap-4 items-center">
              <div className="w-24 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-bold text-gray-900 line-clamp-1">{service.title}</h3>
                   {service.isActive ? (
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   ) : (
                     <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                   )}
                 </div>
                 <p className="text-sm text-gray-500 mb-2">{service.category}</p>
                 <div className="flex gap-3 text-xs font-medium text-gray-600">
                   {typeof service.reviewCount === "number" && (
                     <span>{service.reviewCount} Sales</span>
                   )}
                   {typeof service.averageRating === "number" && service.averageRating > 0 && (
                     <span>★ {service.averageRating.toFixed(1)}</span>
                   )}
                   <span>Starting at Rs. {service.price}</span>
                 </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex-1 rounded-xl gap-2"
                onClick={() => openEditModal(service)}
              >
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => handleDelete(service)}
                disabled={loading}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}

        {!loading && services.length === 0 && (
          <p className="text-sm text-gray-500">You have not created any services yet.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Service title"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Web Development"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you offer in this service..."
              className="w-full min-h-[120px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Starting Price (Rs.)</label>
            <Input
              name="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-white rounded-xl"
              disabled={loading}
            >
              {editingService ? "Save Changes" : "Create Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
