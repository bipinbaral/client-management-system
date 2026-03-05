"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { User, Mail, Phone, Lock, Camera } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile()
        setUser(response.data)
      } catch (error: any) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Update your photo</h3>
            <p className="text-sm text-gray-600 mb-3">JPG, PNG or GIF. Max size 2MB</p>
            <Button className="gradient-primary text-white rounded-xl px-4 py-2">
              Upload Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                defaultValue={user?.name}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <div className="relative mt-1">
              <Badge className="px-3 py-2 rounded-xl">{user?.role}</Badge>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gradient-primary text-white rounded-xl px-8 py-3">
              Save Changes
            </Button>
          </div>
        </form>
      </div>


      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gradient-primary text-white rounded-xl px-8 py-3">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
