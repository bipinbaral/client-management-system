"use client"

import { useState } from "react"
import { Plus, Calendar, Tag, User } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function NotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const notes = [
    {
      id: 1,
      client: "John Doe",
      date: "2024-01-15",
      title: "Progress Check",
      content: "Client has made excellent progress. Increased weight on squats by 20lbs. Recommend continuing current program for 2 more weeks.",
      tags: ["progress", "strength"],
    },
    {
      id: 2,
      client: "Jane Smith",
      date: "2024-01-14",
      title: "Form Correction",
      content: "Worked on deadlift form. Client was rounding back. Provided cues for proper hip hinge. Will monitor in next session.",
      tags: ["technique", "safety"],
    },
    {
      id: 3,
      client: "Mike Johnson",
      date: "2024-01-10",
      title: "Nutrition Discussion",
      content: "Discussed meal prep strategies. Client wants to increase protein intake. Suggested adding protein shakes post-workout.",
      tags: ["nutrition", "goals"],
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes</h1>
          <p className="text-gray-600">Track client progress and observations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium btn-lift shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 card-hover animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900">{note.title}</h3>
                <span className="text-sm text-gray-500">{note.date}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{note.client}</span>
              </div>

              <p className="text-gray-700 leading-relaxed">{note.content}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Note"
        size="lg"
      >
        <form className="p-6 space-y-4">
          <div>
            <Label htmlFor="note-client">Client</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="note-client"
                className="w-full h-12 pl-10 pr-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Select a client...</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Mike Johnson</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              className="mt-1 h-12 rounded-xl"
              placeholder="e.g., Progress Check"
            />
          </div>

          <div>
            <Label htmlFor="note-content">Note Content</Label>
            <textarea
              id="note-content"
              className="mt-1 w-full h-32 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none custom-scrollbar"
              placeholder="Write your observations, progress notes, or any important information..."
            />
          </div>

          <div>
            <Label htmlFor="note-tags">Tags (comma separated)</Label>
            <div className="relative mt-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="note-tags"
                className="pl-10 h-12 rounded-xl"
                placeholder="e.g., progress, strength, technique"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note-date">Date</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="note-date"
                type="date"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 h-12 gradient-primary text-white rounded-xl">
              Save Note
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
