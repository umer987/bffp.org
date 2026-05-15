"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Bell, Search, UserCircle, Timer } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [teacher, setTeacher] = useState<any>(null)
  const [sessionMinutes, setSessionMinutes] = useState(0)

  useEffect(() => {
    const currentTeacherRaw = localStorage.getItem('currentTeacher')
    if (currentTeacherRaw) {
      const parsed = JSON.parse(currentTeacherRaw)
      setTeacher(parsed)
      
      // Initialize time spent for this specific teacher
      const trackingKey = `timeSpent_${parsed.id}`
      const savedTime = parseInt(localStorage.getItem(trackingKey) || '0', 10)
      setSessionMinutes(savedTime)

      // Setup a timer to tick every 1 minute (60000 ms)
      const interval = setInterval(() => {
        setSessionMinutes(prev => {
          const newTime = prev + 1
          localStorage.setItem(trackingKey, newTime.toString())
          return newTime
        })
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [])

  // FOR TESTING: A secret function to quickly jump time by 20 minutes
  const handleFastForward = () => {
    if (teacher) {
      const trackingKey = `timeSpent_${teacher.id}`
      setSessionMinutes(prev => {
        const newTime = prev + 20
        localStorage.setItem(trackingKey, newTime.toString())
        return newTime
      })
      // Force a soft reload so child components pick up the new localStorage value
      window.dispatchEvent(new Event('storage')) 
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="BFFP Logo" width={200} height={65} className="h-14 w-auto" priority />
            <span className="text-lg font-bold tracking-tight text-slate-700 hidden sm:block border-l border-slate-300 pl-3">
              Teacher
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Debug Fast Forward Time Button */}
          <button 
            onClick={handleFastForward}
            className="flex items-center space-x-1 text-xs bg-brand-50 text-brand-700 px-2 py-1.5 rounded-md hover:bg-brand-100 transition-colors border border-brand-200"
            title="Fast forward 20 minutes (for testing progress)"
          >
            <Timer className="h-3 w-3" />
            <span>+20m ({sessionMinutes}m total)</span>
          </button>

          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search my courses..." 
              className="h-9 w-full rounded-md border border-border bg-slate-50 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 border-2 border-white"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-900">{teacher ? teacher.name : "Loading..."}</div>
              <div className="text-xs text-slate-500">ID: {teacher ? teacher.id : "..."}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
              <UserCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="teacher" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
