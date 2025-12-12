"use client"

import { useState } from "react"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, Plus, Filter, User, Mail, Phone, Calendar } from "lucide-react"

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const clients = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      plan: "Premium",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      plan: "Basic",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 456-7890",
      plan: "Premium",
      startDate: "2023-06-01",
      endDate: "2024-01-01",
      status: "Expired",
    },
  ]

  const columns = [
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "plan", header: "Plan Type" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <Badge variant={value.toLowerCase() as any}>{value}</Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
          <p className="text-gray-600">Manage your client base</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium btn-lift shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filter</span>
        </button>
      </div>

      {/* Clients Table */}
      <Table
        columns={columns}
        data={clients}
        onRowClick={(client) => setSelectedClient(client)}
      />

      {/* Add Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
        size="lg"
      >
        <form className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client-name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input id="client-name" className="pl-10 h-12 rounded-xl" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <Label htmlFor="client-email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input id="client-email" type="email" className="pl-10 h-12 rounded-xl" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="client-phone">Phone</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input id="client-phone" type="tel" className="pl-10 h-12 rounded-xl" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div>
              <Label htmlFor="client-plan">Plan Type</Label>
              <select id="client-plan" className="w-full h-12 px-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Basic</option>
                <option>Premium</option>
                <option>Elite</option>
              </select>
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input id="start-date" type="date" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input id="end-date" type="date" className="pl-10 h-12 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 h-12 gradient-primary text-white rounded-xl">
              Add Client
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

      {/* Client Profile Sidebar */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title="Client Profile"
          size="lg"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                {selectedClient.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h3>
                <p className="text-gray-600">{selectedClient.email}</p>
                <Badge variant={selectedClient.status.toLowerCase() as any} className="mt-2">
                  {selectedClient.status}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Type</p>
                <p className="font-semibold text-gray-900">{selectedClient.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-900">{selectedClient.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold text-gray-900">{selectedClient.endDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                  View Workouts
                </button>
                <button className="px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-medium">
                  Payment History
                </button>
                <button className="px-4 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors font-medium">
                  Add Note
                </button>
                <button className="px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
