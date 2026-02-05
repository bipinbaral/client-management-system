"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { User, Mail, Lock, Phone, Briefcase, Globe, FileText } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [userType, setUserType] = useState<"client" | "freelancer">("client")

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
      <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 bg-gray-50/50 pb-6 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join our marketplace to {userType === "client" ? "hire talent" : "find work"}
          </CardDescription>
          
          <div className="flex p-1 bg-gray-200 rounded-xl mt-4">
            <button
              onClick={() => setUserType("client")}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                userType === "client" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              I want to Hire
            </button>
            <button
              onClick={() => setUserType("freelancer")}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                userType === "freelancer" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              I want to Work
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="SafalXXXXX"
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+977-981XXXXXXX"
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* Freelancer Specific Fields */}
              {userType === "freelancer" && (
                <div className="animate-slide-up space-y-4 pt-2">
                  <div>
                    <Label htmlFor="portfolio">Portfolio Link</Label>
                    <div className="relative mt-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="portfolio"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="skills">Primary Skills</Label>
                    <div className="relative mt-1">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="skills"
                        placeholder="e.g. React, Design, Writing"
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Short Bio</Label>
                    <div className="relative mt-1">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        id="bio"
                        className="w-full min-h-[80px] pl-10 pr-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell clients about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••"
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 gradient-primary text-white rounded-xl font-medium btn-lift mt-2">
              Create {userType === "client" ? "Client" : "Freelancer"} Account
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
