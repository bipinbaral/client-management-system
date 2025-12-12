"use client"

import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, ExternalLink } from "lucide-react"

export default function AdminFreelancersPage() {
  const pendingFreelancers = [
    { id: 1, name: "Jessica Bloom", email: "jessica@example.com", category: "Graphic Design", date: "2024-03-15", portfolio: "behance.net/jessica" },
    { id: 2, name: "Mark Zuckerberg", email: "mark@example.com", category: "Web Development", date: "2024-03-14", portfolio: "github.com/mark" },
    { id: 3, name: "Emily Blunt", email: "emily@example.com", category: "Content Writing", date: "2024-03-13", portfolio: "medium.com/@emily" },
  ]

  const columns = [
    { key: "name", header: "Name" },
    { key: "category", header: "Category" },
    { key: "date", header: "Applied Date" },
    {
      key: "portfolio",
      header: "Portfolio",
      render: (value: string) => (
        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
          View <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-8 px-3 gap-1">
            <Check className="w-3 h-3" /> Approve
          </Button>
          <Button size="sm" variant="destructive" className="rounded-lg h-8 px-3 gap-1">
            <X className="w-3 h-3" /> Reject
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Approvals</h1>
        <p className="text-gray-600">Review and approve new freelancer applications</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Applications</h2>
        <Table columns={columns} data={pendingFreelancers} />
      </div>
    </div>
  )
}
