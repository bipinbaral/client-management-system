"use client"

import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Client", status: "Active", joinedDate: "2024-01-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Trainer", status: "Active", joinedDate: "2023-12-15" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Client", status: "Banned", joinedDate: "2023-11-20" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Client", status: "Active", joinedDate: "2024-01-05" },
  ]

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <Badge variant={value === "Active" ? "active" : "expired"}>{value}</Badge>
      ),
    },
    { key: "joinedDate", header: "Joined Date" },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            View
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              row.status === "Banned"
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            {row.status === "Banned" ? "Unban" : "Ban"}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage system users and permissions</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input type="text" placeholder="Search users..." className="pl-10 h-12 rounded-xl" />
      </div>

      <Table columns={columns} data={users} />
    </div>
  )
}
