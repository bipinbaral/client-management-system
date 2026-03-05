"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, User, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authApi.getUsers()
        setUsers(response.data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { 
      key: "name", 
      header: "User",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {value?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: "role", 
      header: "Role",
      render: (value: string) => (
        <Badge className={
          value === 'admin' ? "bg-red-50 text-red-600 border-red-100" :
          value === 'freelancer' ? "bg-purple-50 text-purple-600 border-purple-100" :
          "bg-blue-50 text-blue-600 border-blue-100"
        }>
          {value || 'client'}
        </Badge>
      )
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <Badge variant="active">Active</Badge>
      ),
    },
    { 
      key: "createdAt", 
      header: "Joined Date",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            Manage
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Users</h1>
        <p className="text-gray-500">Manage permissions and account status</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          type="text" 
          placeholder="Search by name, email or role..." 
          className="pl-12 h-14 rounded-2xl border-gray-200 focus:ring-primary shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-gray-400 font-medium tracking-wide">Retrieving user database...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredUsers} />
        )}
      </div>
    </div>
  )
}
