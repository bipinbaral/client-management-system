"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { MoreHorizontal, MessageSquare, Clock, Plus } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface ProjectRequest {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  deadline?: string
  freelancer?: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

const emptyForm = {
  title: "",
  description: "",
  budget: 0,
  deadline: "",
  freelancerId: "",
}

export default function ClientBookingsPage() {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectRequest | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await authApi.getClientRequests()
      setRequests(res.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load project requests")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEdit = (req: ProjectRequest) => {
    setEditing(req)
    setForm({
      title: req.title,
      description: req.description,
      budget: req.budget,
      deadline: req.deadline ? req.deadline.substring(0, 10) : "",
      freelancerId: req.freelancer?._id || "",
    })
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      const payload: any = {
        title: form.title,
        description: form.description,
        budget: form.budget,
        freelancerId: form.freelancerId,
      }
      if (form.deadline) {
        payload.deadline = form.deadline
      }

      if (editing) {
        await authApi.updateProjectRequest(editing._id, payload)
      } else {
        await authApi.createProjectRequest(payload)
      }

      setIsModalOpen(false)
      await loadRequests()
    } catch (err: any) {
      setError(err.message || "Failed to save project request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (req: ProjectRequest) => {
    if (!window.confirm(`Delete request "${req.title}"?`)) return
    try {
      setIsLoading(true)
      setError(null)
      await authApi.deleteProjectRequest(req._id)
      await loadRequests()
    } catch (err: any) {
      setError(err.message || "Failed to delete project request")
    } finally {
      setIsLoading(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Requests</h1>
          <p className="text-gray-600">Create and manage your project requests to freelancers</p>
        </div>
        <Button className="gradient-primary text-white rounded-xl flex items-center gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">REQ-{req._id.slice(-6).toUpperCase()}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(req.status)}`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{req.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{req.description}</p>
                  <p className="text-sm text-gray-500">
                    To:{" "}
                    <span className="font-medium text-gray-900">
                      {req.freelancer?.name || "Selected freelancer"}
                    </span>
                    {req.freelancer?.email && ` (${req.freelancer.email})`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">Rs. {req.budget}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                    <Clock className="w-4 h-4" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                  {req.deadline && (
                    <div className="text-xs text-gray-500">
                      Deadline: <span className="font-medium">{new Date(req.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none gap-2 rounded-xl"
                    onClick={() => openEdit(req)}
                  >
                    <MessageSquare className="w-4 h-4" /> Edit Request
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => handleDelete(req)}
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 italic">
            You have not created any project requests yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Project Request" : "New Project Request"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Landing page redesign"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your project, goals, and requirements..."
              className="w-full min-h-[120px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Budget (Rs.)</label>
              <Input
                name="budget"
                type="number"
                min={0}
                value={form.budget}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Preferred Deadline</label>
              <Input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Freelancer ID</label>
              <Input
                name="freelancerId"
                value={form.freelancerId}
                onChange={handleChange}
                placeholder="Paste selected freelancer ID"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-white rounded-xl"
              disabled={isLoading}
            >
              {editing ? "Save Changes" : "Create Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { MoreHorizontal, MessageSquare, Clock, Plus } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface ProjectRequest {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  deadline?: string
  freelancer?: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

const emptyForm = {
  title: "",
  description: "",
  budget: 0,
  deadline: "",
  freelancerId: "",
}

export default function ClientBookingsPage() {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectRequest | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await authApi.getClientRequests()
      setRequests(res.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load project requests")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEdit = (req: ProjectRequest) => {
    setEditing(req)
    setForm({
      title: req.title,
      description: req.description,
      budget: req.budget,
      deadline: req.deadline ? req.deadline.substring(0, 10) : "",
      freelancerId: req.freelancer?._id || "",
    })
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      const payload: any = {
        title: form.title,
        description: form.description,
        budget: form.budget,
        freelancerId: form.freelancerId,
      }
      if (form.deadline) {
        payload.deadline = form.deadline
      }

      if (editing) {
        await authApi.updateProjectRequest(editing._id, payload)
      } else {
        await authApi.createProjectRequest(payload)
      }

      setIsModalOpen(false)
      await loadRequests()
    } catch (err: any) {
      setError(err.message || "Failed to save project request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (req: ProjectRequest) => {
    if (!window.confirm(`Delete request "${req.title}"?`)) return
    try {
      setIsLoading(true)
      setError(null)
      await authApi.deleteProjectRequest(req._id)
      await loadRequests()
    } catch (err: any) {
      setError(err.message || "Failed to delete project request")
    } finally {
      setIsLoading(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Requests</h1>
          <p className="text-gray-600">Create and manage your project requests to freelancers</p>
        </div>
        <Button className="gradient-primary text-white rounded-xl flex items-center gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">REQ-{req._id.slice(-6).toUpperCase()}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(req.status)}`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{req.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{req.description}</p>
                  <p className="text-sm text-gray-500">
                    To:{" "}
                    <span className="font-medium text-gray-900">
                      {req.freelancer?.name || "Selected freelancer"}
                    </span>
                    {req.freelancer?.email && ` (${req.freelancer.email})`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">Rs. {req.budget}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                    <Clock className="w-4 h-4" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                  {req.deadline && (
                    <div className="text-xs text-gray-500">
                      Deadline: <span className="font-medium">{new Date(req.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none gap-2 rounded-xl"
                    onClick={() => openEdit(req)}
                  >
                    <MessageSquare className="w-4 h-4" /> Edit Request
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => handleDelete(req)}
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 italic">
            You have not created any project requests yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Project Request" : "New Project Request"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Landing page redesign"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your project, goals, and requirements..."
              className="w-full min-h-[120px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Budget (Rs.)</label>
              <Input
                name="budget"
                type="number"
                min={0}
                value={form.budget}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Preferred Deadline</label>
              <Input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Freelancer ID</label>
              <Input
                name="freelancerId"
                value={form.freelancerId}
                onChange={handleChange}
                placeholder="Paste selected freelancer ID"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-white rounded-xl"
              disabled={isLoading}
            >
              {editing ? "Save Changes" : "Create Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { MoreHorizontal, MessageSquare, Clock, Plus } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface ProjectRequest {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  deadline?: string
  freelancer?: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

const emptyForm = {
  title: \"\",
  description: \"\",
  budget: 0,
  deadline: \"\",
  freelancerId: \"\",
}

export default function ClientBookingsPage() {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectRequest | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await authApi.getClientRequests()
      setRequests(res.data || [])
    } catch (err: any) {
      setError(err.message || \"Failed to load project requests\")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEdit = (req: ProjectRequest) => {
    setEditing(req)
    setForm({
      title: req.title,
      description: req.description,
      budget: req.budget,
      deadline: req.deadline ? req.deadline.substring(0, 10) : \"\",
      freelancerId: req.freelancer?._id || \"\",
    })
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === \"budget\" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      const payload: any = {
        title: form.title,
        description: form.description,
        budget: form.budget,
        freelancerId: form.freelancerId,
      }
      if (form.deadline) {
        payload.deadline = form.deadline
      }

      if (editing) {
        await authApi.updateProjectRequest(editing._id, payload)
      } else {
        await authApi.createProjectRequest(payload)
      }

      setIsModalOpen(false)
      await loadRequests()
    } catch (err: any) {
      setError(err.message || \"Failed to save project request\")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (req: ProjectRequest) => {
    if (!window.confirm(`Delete request \"${req.title}\"?`)) return
    try {
      setIsLoading(true)
      setError(null)
      await authApi.deleteProjectRequest(req._id)
      await loadRequests()
    } catch (err: any) {
      setError(err.message || \"Failed to delete project request\")
    } finally {
      setIsLoading(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case \"accepted\":
      case \"in_progress\":
        return \"bg-blue-100 text-blue-700\"
      case \"completed\":
        return \"bg-green-100 text-green-700\"
      case \"rejected\":
      case \"cancelled\":
        return \"bg-red-100 text-red-700\"
      default:
        return \"bg-yellow-100 text-yellow-700\"
    }
  }

  return (
    <div className=\"space-y-6 animate-fade-in\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold text-gray-900\">Project Requests</h1>
          <p className=\"text-gray-600\">Create and manage your project requests to freelancers</p>
        </div>
        <Button className=\"gradient-primary text-white rounded-xl flex items-center gap-2\" onClick={openCreate}>
          <Plus className=\"w-4 h-4\" /> New Request
        </Button>
      </div>

      {error && (
        <div className=\"rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700\">
          {error}
        </div>
      )}

      <div className=\"grid gap-4\">
        {isLoading ? (
          <div className=\"flex items-center justify-center p-12\">
            <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-primary\"></div>
          </div>
        ) : requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              className=\"bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow\"
            >
              <div className=\"flex flex-col md:flex-row justify-between gap-4\">
                <div className=\"flex-1\">
                  <div className=\"flex items-center gap-3 mb-2\">
                    <span className=\"text-sm font-mono text-gray-500\">REQ-{req._id.slice(-6).toUpperCase()}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(req.status)}`}
                    >
                      {req.status.replace(\"_\", \" \")}
                    </span>
                  </div>
                  <h3 className=\"text-xl font-bold text-gray-900 mb-1\">{req.title}</h3>
                  <p className=\"text-gray-600 mb-2 line-clamp-2\">{req.description}</p>
                  <p className=\"text-sm text-gray-500\">
                    To:{\" "}
                    <span className=\"font-medium text-gray-900\">
                      {req.freelancer?.name || \"Selected freelancer\"}
                    </span>
                    {req.freelancer?.email && ` (${req.freelancer.email})`}
                  </p>
                </div>

                <div className=\"flex flex-col items-end gap-2\">
                  <span className=\"text-2xl font-bold text-gray-900\">Rs. {req.budget}</span>
                  <div className=\"flex items-center gap-1 text-sm text-gray-500 font-mono\">
                    <Clock className=\"w-4 h-4\" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                  {req.deadline && (
                    <div className=\"text-xs text-gray-500\">
                      Deadline: <span className=\"font-medium\">{new Date(req.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className=\"mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50\">
                <div className=\"flex gap-3 w-full md:w-auto\">
                  <Button
                    variant=\"outline\"
                    className=\"flex-1 md:flex-none gap-2 rounded-xl\"
                    onClick={() => openEdit(req)}
                  >
                    <MessageSquare className=\"w-4 h-4\" /> Edit Request
                  </Button>
                  <Button
                    variant=\"ghost\"
                    size=\"icon\"
                    className=\"rounded-xl\"
                    onClick={() => handleDelete(req)}
                    disabled={isLoading}
                  >
                    <MoreHorizontal className=\"w-5 h-5\" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className=\"bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 italic\">
            You have not created any project requests yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? \"Edit Project Request\" : \"New Project Request\"}
        size=\"lg\"
      >
        <form onSubmit={handleSubmit} className=\"p-6 space-y-4\">
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium text-gray-700\">Title</label>
            <Input
              name=\"title\"
              value={form.title}
              onChange={handleChange}
              placeholder=\"e.g. Landing page redesign\"
              required
            />
          </div>
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium text-gray-700\">Description</label>
            <textarea
              name=\"description\"
              value={form.description}
              onChange={handleChange}
              placeholder=\"Describe your project, goals, and requirements...\"
              className=\"w-full min-h-[120px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50\"
              required
            />
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium text-gray-700\">Budget (Rs.)</label>
              <Input
                name=\"budget\"
                type=\"number\"
                min={0}
                value={form.budget}
                onChange={handleChange}
                required
              />
            </div>
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium text-gray-700\">Preferred Deadline</label>
              <Input
                name=\"deadline\"
                type=\"date\"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium text-gray-700\">Freelancer ID</label>
              <Input
                name=\"freelancerId\"
                value={form.freelancerId}
                onChange={handleChange}
                placeholder=\"Paste selected freelancer ID\"
                required
              />
            </div>
          </div>

          <div className=\"flex justify-end gap-3 pt-4\">
            <Button
              type=\"button\"
              variant=\"outline\"
              className=\"rounded-xl\"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type=\"submit\"
              className=\"gradient-primary text-white rounded-xl\"
              disabled={isLoading}
            >
              {editing ? \"Save Changes\" : \"Create Request\"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
