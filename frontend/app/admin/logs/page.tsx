"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { Loader2, Search, Filter, Calendar, User, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("ALL")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await authApi.getActivityLogs({ limit: 100 })
        setLogs(response.data)
      } catch (error) {
        console.error("Failed to fetch logs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = filterLevel === "ALL" || log.level === filterLevel
    
    return matchesSearch && matchesLevel
  })

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'ERROR': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />
      default: return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'bg-green-50 text-green-700 border-green-100'
      case 'ERROR': return 'bg-red-50 text-red-700 border-red-100'
      case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-100'
      default: return 'bg-blue-50 text-blue-700 border-blue-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Activity Logs</h1>
          <p className="text-gray-600">Real-time audit trail of all administrative and user actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">
            {logs.length} Total Entries
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search logs by action, user, or description..." 
            className="pl-10 h-11 rounded-xl border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action / Description</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getLevelStyles(log.level)}`}>
                        {getLevelIcon(log.level)}
                        {log.level}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{log.userName || "System"}</span>
                          <span className="text-xs text-gray-500">{log.userEmail || "Auto"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 min-w-[300px]">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800 break-words">{log.description}</span>
                        <span className="text-xs text-gray-400 font-mono mt-1">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {log.ipAddress || "Internal"}
                      </code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500 italic">
                    No activity logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
