"use client"

import { PublicNavbar } from "@/components/common/public-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FreelancersPage() {
  const freelancers = [
    {
      id: 1,
      name: "Alex Walker",
      title: "Senior Full Stack Dev",
      rating: 4.9,
      reviews: 128,
      rate: 85,
      location: "United States",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      bio: "Expert full-stack developer with 8+ years of experience building scalable web applications for startups and enterprises.",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Chen",
      title: "Brand Identity Designer",
      rating: 5.0,
      reviews: 84,
      rate: 65,
      location: "Canada",
      skills: ["Logo Design", "Branding", "Illustrator", "Figma"],
      bio: "Award-winning designer passionate about creating memorable brand identities that help businesses stand out.",
      verified: true
    },
    {
      id: 3,
      name: "Mike Johnson",
      title: "SEO Copywriter",
      rating: 4.8,
      reviews: 342,
      rate: 55,
      location: "United Kingdom",
      skills: ["Copywriting", "SEO", "Content Strategy", "Blogging"],
      bio: "I craft compelling content that ranks on Google and converts readers into loyal customers.",
      verified: false
    },
    {
      id: 4,
      name: "David Smith",
      title: "Mobile App Developer",
      rating: 4.9,
      reviews: 56,
      rate: 90,
      location: "Australia",
      skills: ["Flutter", "React Native", "iOS", "Android"],
      bio: "Specializing in cross-platform mobile app development with a focus on polished UI and smooth performance.",
      verified: true
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Top Freelancers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our curated list of expert freelancers ready to work on your project.
          </p>
          
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search by name, skill, or title..." 
              className="pl-12 h-14 rounded-full shadow-lg border-gray-100 text-lg"
            />
          </div>
        </div>

        <div className="space-y-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto md:mx-0"></div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                      {freelancer.name}
                      {freelancer.verified && <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-50" />}
                    </h3>
                    <p className="text-gray-600 font-medium">{freelancer.title}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-xl font-bold text-gray-900">${freelancer.rate}/hr</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-900">{freelancer.rating}</span>
                      <span>({freelancer.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {freelancer.location}
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2 md:line-clamp-none">
                  {freelancer.bio}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {freelancer.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3 justify-center md:justify-start">
                  <Link href={`/freelancers/${freelancer.id}`}>
                    <Button className="gradient-primary text-white rounded-xl px-6">
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-xl px-6">
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
