"use client"

import { PublicNavbar } from "@/components/common/public-navbar"
import { Button } from "@/components/ui/button"
import { Search, Shield, Zap, CheckCircle, ArrowRight, Star, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GrowthChart } from "@/components/charts/GrowthChart"

export default function LandingPage() {
  const categories = [
    { name: "Web Development", count: "1.2k+ pros", icon: "💻" },
    { name: "Graphic Design", count: "800+ pros", icon: "🎨" },
    { name: "Digital Marketing", count: "600+ pros", icon: "📈" },
    { name: "Content Writing", count: "900+ pros", icon: "✍️" },
    { name: "Video Animation", count: "400+ pros", icon: "🎥" },
    { name: "Mobile Apps", count: "500+ pros", icon: "📱" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PublicNavbar />

      {/* Hero Section with Mesh Gradient */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
            <Badge variant="secondary" className="px-4 py-2 rounded-full text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
              🎉 The World&apos;s #1 Marketplace for Top Talent
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Turn your ideas into <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reality</span> with Expert Freelancers
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with verified experts who can help you grow your business. 
              From quick tasks to major projects, we&apos;ve got you covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto bg-white p-2 rounded-full shadow-xl border border-gray-100/50">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="What service are you looking for?" 
                  className="w-full h-12 pl-12 pr-4 rounded-full border-0 focus-visible:ring-0 text-base bg-transparent"
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto h-12 rounded-full gradient-primary text-white px-8 font-semibold shadow-md btn-lift">
                Search
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Verified Pros
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Secure Payment
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> 24/7 Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Promising Stats / Charts Section */}
      <section className="py-20 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Content */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Drive growth with data-driven talent
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform provides you with insights and tools to manage your workforce efficiently. Track progress, monitor spending, and see your projects take flight.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Top Rated Talent", desc: "Access the top 1% of freelancers globally.", icon: Star },
                  { title: "Cost Efficiency", desc: "Save up to 40% compared to traditional hiring.", icon: DollarSign },
                  { title: "Rapid Scaling", desc: "Scale your team up or down in minutes.", icon: TrendingUp },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Dashboard / Charts Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
              
              {/* Main Card */}
              <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Project Performance</h3>
                    <p className="text-xs text-gray-500">Last 30 Days</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">+24.5%</Badge>
                </div>

                {/* React Chart.js Implementation */}
                <div className="h-48 w-full">
                  <GrowthChart />
                </div>

                {/* Floating Stats Card 1 */}
                <div className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce-slow hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Money Saved</p>
                      <p className="text-lg font-bold text-gray-900">$12,450</p>
                    </div>
                  </div>
                </div>

                 {/* Floating Stats Card 2 */}
                 <div className="absolute -left-8 bottom-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce-slow delay-700 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Active Freelancers</p>
                      <p className="text-lg font-bold text-gray-900">1,240+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600">Browse talent across our most popular categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <Link 
                href="/services" 
                key={idx}
                className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 invert-0">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready to completely transform <br/> how you work?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join a community of forward-thinking businesses and talented professionals. 
            Start today and see the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="rounded-full bg-white text-blue-900 hover:bg-gray-100 h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-transform">
                Get Started Now
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-gray-400">
            No credit card required for browsing. Free to join.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold">M</div>
                <span className="font-bold text-xl">MarketPlace</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Connect with the best talent from around the world. Secure, fast, and reliable.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">For Clients</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-primary">How to Hire</Link></li>
                <li><Link href="#" className="hover:text-primary">Tallent Marketplace</Link></li>
                <li><Link href="#" className="hover:text-primary">Payment Services</Link></li>
                <li><Link href="#" className="hover:text-primary">Enterprise</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">For Freelancers</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-primary">How to Find Work</Link></li>
                <li><Link href="#" className="hover:text-primary">Direct Contracts</Link></li>
                <li><Link href="#" className="hover:text-primary">Opportunity Updates</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>&copy; 2024 MarketPlace Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}