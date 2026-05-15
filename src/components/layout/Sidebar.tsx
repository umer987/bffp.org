"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  Settings,
  LogOut,
  GraduationCap
} from "lucide-react"

interface SidebarProps {
  role: "admin" | "teacher"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Teachers", href: "/admin/teachers", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Exams", href: "/admin/exams", icon: FileText },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Students (SMS)", href: "/admin/students", icon: GraduationCap },
  ]

  const teacherLinks = [
    { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
    { name: "Exams", href: "/teacher/exams", icon: FileText },
    { name: "Certificates", href: "/teacher/certificates", icon: Award },
  ]

  const links = role === "admin" ? adminLinks : teacherLinks

  return (
    <aside className="w-64 border-r border-border bg-white h-[calc(100vh-4rem)] flex flex-col sticky top-16 hidden md:flex">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-brand-50 text-brand-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-brand-600" : "text-slate-400")} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </div>
      
      <div className="p-4 border-t border-border space-y-1">
        <Link
          href={`/${role}/settings`}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Settings className="h-5 w-5 text-slate-400" />
          <span>Settings</span>
        </Link>
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  )
}
