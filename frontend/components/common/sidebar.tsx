"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Search,
  MessageSquare,
  FileText,
  Briefcase,
  DollarSign,
  ImageIcon,
  LogOut,
  Layers,
  Terminal
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [role, setRole] = useState<"client" | "freelancer" | "admin" | null>(null)

  
  // Links will be determined by role from localStorage

  const clientLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client/services", label: "Browse Services", icon: Search },
    { href: "/client/bookings", label: "My Bookings", icon: Briefcase },
    { href: "/client/messages", label: "Messages", icon: MessageSquare },
    { href: "/client/invoices", label: "Invoices", icon: FileText },
    { href: "/profile", label: "Profile", icon: Settings },
  ]

  const freelancerLinks = [
    { href: "/freelancer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/freelancer/services", label: "My Services", icon: Layers },
    { href: "/freelancer/bookings", label: "Project Requests", icon: Briefcase },
    { href: "/freelancer/portfolio", label: "Portfolio", icon: ImageIcon },
    { href: "/freelancer/earnings", label: "Earnings", icon: DollarSign },
    { href: "/freelancer/messages", label: "Messages", icon: MessageSquare },
    { href: "/profile", label: "Profile", icon: Settings },
  ]

  const adminLinks = [
    { href: "/admin", label: "Admin Panel", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Briefcase },
    { href: "/admin/services", label: "Global Services", icon: Layers },
    { href: "/admin/payments", label: "System Revenue", icon: DollarSign },
    { href: "/profile", label: "Admin Settings", icon: Settings },
  ]

  // Determine user role from localStorage on client only
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (!stored) {
        setRole(null)
        return
      }
      const parsed = JSON.parse(stored)
      if (parsed.role === "client" || parsed.role === "freelancer" || parsed.role === "admin") {
        setRole(parsed.role)
      } else {
        setRole(null)
      }
    } catch {
      setRole(null)
    }
  }, [])

  // Avoid rendering on server / before hydration so HTML matches
  if (!role) return null

  const links = role === "admin" ? adminLinks : role === "freelancer" ? freelancerLinks : clientLinks
  const isFreelancer = role === "freelancer"
  const isAdmin = role === "admin"

  return (
    <aside 
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-white border-r border-gray-200 transition-all duration-300 relative hidden md:block`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Links */}
        <nav className="space-y-2 mt-4 flex-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-blue-50 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={isCollapsed ? link.label : ""}
              >
                <div className={`${isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {!isCollapsed && (
                  <span className="animate-fade-in whitespace-nowrap">
                    {link.label}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto space-y-2 pt-4">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              router.push("/auth/login")
            }}
            className={`flex w-full items-center gap-3 px-3 py-3 rounded-xl transition-all group relative text-red-600 hover:bg-red-50 hover:text-red-700`}
            title={isCollapsed ? "Log Out" : ""}
          >
            <div className="text-red-500 group-hover:text-red-700">
              <LogOut className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <span className="animate-fade-in whitespace-nowrap font-medium">
                Log Out
              </span>
            )}
          </button>

          {/* User Type Indicator */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-gray-100">
              <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${
                isAdmin ? "bg-red-100 text-red-700" : (isFreelancer ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")
              }`}>
                {isAdmin ? "Administrator" : (isFreelancer ? "Freelancer Account" : "Client Account")}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

