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
  Image as ImageIcon,
  Dumbbell
} from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Determine role based on path (simulated)
  const isFreelancer = pathname.startsWith("/freelancer")

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
    { href: "/freelancer/services", label: "My Services", icon: Dumbbell },
    { href: "/freelancer/bookings", label: "Bookings", icon: Briefcase },
    { href: "/freelancer/portfolio", label: "Portfolio", icon: ImageIcon },
    { href: "/freelancer/earnings", label: "Earnings", icon: DollarSign },
    { href: "/freelancer/messages", label: "Messages", icon: MessageSquare },
    { href: "/profile", label: "Profile", icon: Settings },
  ]

  const links = isFreelancer ? freelancerLinks : clientLinks

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
        
        {/* User Type Indicator */}
        {!isCollapsed && (
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${
              isFreelancer ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
            }`}>
              {isFreelancer ? "Freelancer Account" : "Client Account"}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
