"use client"

export default function AdminLogsPage() {
  const logs = [
    { id: 1, timestamp: "2024-01-15 14:32:15", level: "INFO", user: "john@example.com", action: "User logged in", ip: "192.168.1.100" },
    { id: 2, timestamp: "2024-01-15 14:25:42", level: "INFO", user: "jane@example.com", action: "Payment processed", ip: "192.168.1.101" },
    { id: 3, timestamp: "2024-01-15 14:18:33", level: "WARNING", user: "unknown@example.com", action: "Failed login attempt", ip: "192.168.1.102" },
    { id: 4, timestamp: "2024-01-15 14:10:21", level: "INFO", user: "admin@example.com", action: "Client added: John Doe", ip: "192.168.1.1" },
    { id: 5, timestamp: "2024-01-15 13:55:10", level: "ERROR", user: "system", action: "Database connection timeout", ip: "localhost" },
    { id: 6, timestamp: "2024-01-15 13:42:05", level: "INFO", user: "sarah@example.com", action: "Profile updated", ip: "192.168.1.103" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
        <p className="text-gray-600">Monitor all system activities</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">System Activity Log</h3>
        </div>
        <div className="divide-y divide-gray-200 custom-scrollbar max-h-[600px] overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.level === "INFO"
                          ? "bg-blue-100 text-blue-700"
                          : log.level === "WARNING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-sm text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{log.action}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>User: {log.user}</span>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
