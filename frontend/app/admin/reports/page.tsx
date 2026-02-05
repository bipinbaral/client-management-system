"use client"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">View system reports and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Static Chart Placeholder 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">[Chart: User Growth Over Time]</p>
          </div>
        </div>

        {/* Static Chart Placeholder 2 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">[Chart: Monthly Revenue]</p>
          </div>
        </div>

        {/* Static Chart Placeholder 3 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Active Sessions</h3>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">[Chart: Daily Active Users]</p>
          </div>
        </div>

        {/* Static Chart Placeholder 4 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">System Performance</h3>
          <div className="h-64 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">[Chart: System Uptime]</p>
          </div>
        </div>
      </div>
    </div>
  )
}
