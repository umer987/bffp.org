"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import Link from "next/link"
import Image from "next/image"
import { Bell, Search, UserCircle, Menu, X } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="BFFP Logo" width={200} height={65} className="h-14 w-auto" priority />
            <span className="text-lg font-bold tracking-tight text-slate-700 hidden sm:block border-l border-slate-300 pl-3">
              Admin
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students, fees..." 
              className="h-9 w-full rounded-md border border-border bg-slate-50 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  <button className="text-xs text-brand-600 font-medium">Mark all as read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                  <NotificationItem title="New Student Registered" time="2 mins ago" text="Ali Ahmed joined Class 1" />
                  <NotificationItem title="Fee Payment" time="1 hour ago" text="Roll No NUR-001 paid fee for May" />
                  <NotificationItem title="Attendance Alert" time="3 hours ago" text="Attendance for Class 5 not marked yet" />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                <UserCircle className="h-5 w-5" />
              </div>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">Administrator</p>
                  <p className="text-xs text-slate-500">admin@bffp.edu.pk</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/admin/settings" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">My Profile</Link>
                  <Link href="/admin/settings" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Settings</Link>
                  <hr className="my-1 border-slate-100" />
                  <Link href="/" className="block px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium">Sign Out</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`fixed inset-0 z-40 md:hidden bg-slate-900/50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        
        {/* Sidebar Container */}
        <div className={`fixed md:static inset-y-0 left-0 z-50 transform md:transform-none transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 h-full md:h-[calc(100vh-4rem)] md:sticky md:top-16`}>
          <Sidebar role="admin" closeMobileMenu={() => setIsMobileMenuOpen(false)} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function NotificationItem({ title, time, text }: any) {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <span className="text-[10px] font-medium text-slate-400 uppercase">{time}</span>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2">{text}</p>
    </div>
  )
}
