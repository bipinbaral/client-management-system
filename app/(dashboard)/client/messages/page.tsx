"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react"

export default function MessagesPage() {
  const conversations = [
    { id: 1, name: "Alex Walker", lastMessage: "I'll send the preliminary designs by EOD.", time: "10:30 AM", unread: 2, active: true },
    { id: 2, name: "Sarah Chen", lastMessage: "Thanks for the feedback!", time: "Yesterday", unread: 0, active: false },
    { id: 3, name: "Mike Johnson", lastMessage: "Let me know if you need any changes.", time: "Oct 24", unread: 0, active: false },
  ]

  const currentChat = [
    { id: 1, text: "Hi Alex, how is the homepage redesign coming along?", sender: "me", time: "10:00 AM" },
    { id: 2, text: "Hey! It's going great. I've finished the wireframes.", sender: "them", time: "10:15 AM" },
    { id: 3, text: "That's awesome. Can I see them?", sender: "me", time: "10:16 AM" },
    { id: 4, text: "Sure thing. I'll send the preliminary designs by EOD.", sender: "them", time: "10:30 AM" },
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-fade-in">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
           <h2 className="text-xl font-bold mb-4">Messages</h2>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <Input placeholder="Search..." className="pl-9 bg-gray-50 border-gray-200 rounded-xl" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <div key={chat.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${chat.active ? 'bg-blue-50/50' : ''}`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold text-gray-900 ${chat.active ? 'text-primary' : ''}`}>{chat.name}</h3>
                <span className="text-xs text-gray-400">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">AW</div>
            <div>
              <h3 className="font-bold text-gray-900">Alex Walker</h3>
              <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500"><Phone className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-gray-500"><Video className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-gray-500"><MoreVertical className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {currentChat.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-4 ${
                msg.sender === 'me' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
             <Input placeholder="Type a message..." className="flex-1 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors" />
             <Button className="gradient-primary text-white rounded-xl aspect-square p-0 w-10 flex items-center justify-center">
               <Send className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
