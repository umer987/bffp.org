import { Sidebar } from "@/components/layout/Sidebar"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Bell, Search, UserCircle } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
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
              placeholder="Search teachers, courses..." 
              className="h-9 w-full rounded-md border border-border bg-slate-50 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
            <UserCircle className="h-5 w-5" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="admin" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
