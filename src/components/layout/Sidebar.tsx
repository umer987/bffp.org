"use client"

import { useState } from "react"
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
  GraduationCap,
  ChevronDown,
  ChevronRight
} from "lucide-react"

interface SidebarProps {
  role: "admin" | "teacher"
  closeMobileMenu?: () => void
}

interface NavLink {
  name: string
  href: string
  icon: any
  subLinks?: { name: string; href: string }[]
}

export function Sidebar({ role, closeMobileMenu }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Students (SMS)": pathname.includes("/admin/students")
  })

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const adminLinks: NavLink[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Teachers", href: "/admin/teachers", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Exams", href: "/admin/exams", icon: FileText },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { 
      name: "Students (SMS)", 
      href: "/admin/students", 
      icon: GraduationCap,
      subLinks: [
        { name: "Dashboard", href: "/admin/students" },
        { name: "Fees", href: "/admin/students/fees" },
        { name: "Classes", href: "/admin/students/classes" },
      ]
    },
  ]

  const teacherLinks: NavLink[] = [
    { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
    { name: "Exams", href: "/teacher/exams", icon: FileText },
    { name: "Certificates", href: "/teacher/certificates", icon: Award },
  ]

  const links = role === "admin" ? adminLinks : teacherLinks

  return (
    <aside className="w-64 border-r border-border bg-white h-full flex flex-col">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.subLinks && pathname.startsWith(link.href) && link.href !== '/admin')

          if (link.subLinks) {
            const isOpen = openMenus[link.name]
            return (
              <div key={link.name} className="space-y-1">
                <button
                  onClick={() => toggleMenu(link.name)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={cn("h-5 w-5", isActive ? "text-brand-600" : "text-slate-400")} />
                    <span>{link.name}</span>
                  </div>
                  {isOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                </button>
                
                {isOpen && (
                  <div className="pl-10 space-y-1 mt-1">
                    {link.subLinks.map(subLink => {
                      const isSubActive = pathname === subLink.href
                      return (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            isSubActive ? "text-brand-600 font-semibold bg-brand-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          {subLink.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
          
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
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
