"use client"

import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"
import { useEffect, useState } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  }

  const colors = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  }

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 ${isVisible ? "animate-slide-in" : "animate-fade-out"}`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px] ${colors[type]}`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="p-1 hover:bg-black/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Toast Container for managing multiple toasts
export function ToastContainer() {
  return <div id="toast-container" className="fixed top-0 right-0 p-4 z-50 space-y-2" />
}
