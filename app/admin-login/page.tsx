"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        router.push("/admin")
      } else {
        setError("Invalid admin credentials")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="border-0 shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Enter admin credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Demo Credentials Hint */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-sm text-purple-800 mb-4">
                <p className="font-semibold mb-1">Demo Admin Credentials:</p>
                <div className="grid grid-cols-[80px_1fr] gap-1">
                  <span className="text-purple-600">Username:</span>
                  <span className="font-mono">admin</span>
                  <span className="text-purple-600">Password:</span>
                  <span className="font-mono">admin123</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    className="pl-10 h-12 rounded-xl border-gray-300"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-password" className="text-gray-700">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl border-gray-300"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-white rounded-xl font-medium btn-lift disabled:opacity-70"
              >
                {isLoading ? "Verifying..." : "Sign In as Admin"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                  ← Back to User Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
