"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function WorkoutsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const workouts = [
    {
      id: 1,
      name: "Full Body Strength",
      description: "Complete full body workout focusing on compound movements",
      exercises: 8,
      duration: "60 min",
      difficulty: "Intermediate",
    },
    {
      id: 2,
      name: "HIIT Cardio Blast",
      description: "High-intensity interval training for maximum calorie burn",
      exercises: 12,
      duration: "30 min",
      difficulty: "Advanced",
    },
    {
      id: 3,
      name: "Beginner Core Routine",
      description: "Core strengthening exercises for beginners",
      exercises: 6,
      duration: "20 min",
      difficulty: "Beginner",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
          <p className="text-gray-600">Manage your workout programs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium btn-lift shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Workout
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search workouts..."
          className="pl-10 h-12 rounded-xl"
        />
      </div>

      {/* Workout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout, index) => (
          <div
            key={workout.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 card-hover animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{workout.name}</h3>
                <p className="text-sm text-gray-600">{workout.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">{workout.exercises}</span>
                  <span className="text-gray-500">exercises</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span className="text-gray-700">{workout.duration}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  workout.difficulty === "Beginner" 
                    ? "bg-green-100 text-green-700"
                    : workout.difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {workout.difficulty}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Workout Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Workout Program"
        size="lg"
      >
        <form className="p-6 space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              className="mt-1 h-12 rounded-xl"
              placeholder="e.g., Full Body Strength"
            />
          </div>
          
          <div>
            <Label htmlFor="workout-description">Description</Label>
            <textarea
              id="workout-description"
              className="mt-1 w-full h-24 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Brief description of the workout..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                className="mt-1 h-12 rounded-xl"
                placeholder="60"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                className="mt-1 w-full h-12 px-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="exercises">Number of Exercises</Label>
            <Input
              id="exercises"
              type="number"
              className="mt-1 h-12 rounded-xl"
              placeholder="8"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 h-12 gradient-primary text-white rounded-xl">
              Create Workout
            </Button>
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
