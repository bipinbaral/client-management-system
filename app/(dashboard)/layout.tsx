"use client"

import { Navbar } from "@/components/common/navbar"
import { Sidebar } from "@/components/common/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 custom-scrollbar overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
