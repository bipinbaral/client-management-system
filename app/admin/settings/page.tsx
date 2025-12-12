"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure system settings</p>
      </div>

      {/* Application Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Application Settings</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="app-name">Application Name</Label>
            <Input
              id="app-name"
              defaultValue="Client Management System"
              className="mt-1 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="app-description">Description</Label>
            <textarea
              id="app-description"
              defaultValue="Manage your clients, workouts, and payments efficiently"
              className="mt-1 w-full h-24 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-clients">Max Clients Per Trainer</Label>
              <Input
                id="max-clients"
                type="number"
                defaultValue="50"
                className="mt-1 h-12 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="30"
                className="mt-1 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="gradient-primary text-white rounded-xl px-8 py-3">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Theme Settings (Static) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Theme Customization</h2>
        <div className="space-y-4">
          <div>
            <Label>Primary Color</Label>
            <div className="mt-2 flex items-center gap-4">
              <input
                type="color"
                defaultValue="#2563EB"
                className="w-16 h-12 rounded-xl border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600">#2563EB</span>
            </div>
          </div>

          <div>
            <Label>Secondary Color</Label>
            <div className="mt-2 flex items-center gap-4">
              <input
                type="color"
                defaultValue="#3B82F6"
                className="w-16 h-12 rounded-xl border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600">#3B82F6</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic">
            * Theme changes are for demonstration only
          </p>
        </div>
      </div>
    </div>
  )
}
