"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { GraduationCap, Users, UserCheck, Calendar } from "lucide-react"

export default function StudentsAdminPage() {
  const features = [
    { title: "Student Admissions", icon: Users, desc: "Manage new enrollments and student profiles." },
    { title: "Attendance", icon: Calendar, desc: "Track daily attendance and generate reports." },
    { title: "Academic Records", icon: FileTextIcon, desc: "Manage grades, report cards, and performance." },
    { title: "Data Management", icon: UserCheck, desc: "Bulk import/export student data securely." },
  ]

  // Custom icon component for FileText since it's not exported above
  function FileTextIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-600 to-emerald-700 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <GraduationCap className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Student Management System (SMS)</h1>
          <p className="text-brand-100 text-lg mb-6">A comprehensive portal for tracking and managing student lifecycle across schools.</p>
          <Button className="bg-white text-brand-700 hover:bg-brand-50 border-none font-semibold">
            Launch SMS Portal
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Core SMS Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
                <Button variant="link" className="px-0 mt-2">Manage {feature.title.split(' ')[0]} &rarr;</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
