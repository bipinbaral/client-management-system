"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email === "john@example.com" && password === "user123") {
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Please try again.")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
      <Card className="border-0 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Demo Credentials Hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800 mb-4">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <div className="grid grid-cols-[60px_1fr] gap-1">
                <span className="text-blue-600">Email:</span>
                <span className="font-mono">john@example.com</span>
                <span className="text-blue-600">Pass:</span>
                <span className="font-mono">user123</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-12 rounded-xl border-gray-300"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••••"
                    className="pl-10 h-12 rounded-xl border-gray-300"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-white rounded-xl font-medium btn-lift disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                <Link href="/admin-login" className="text-secondary font-medium hover:underline">
                  Admin Login →
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
