"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Users, BookOpen, Award, TrendingUp, GraduationCap, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function AdminDashboard() {
  const stats = [
    { name: "Total Teachers", value: "1,245", icon: Users, change: "+12% this month" },
    { name: "Active Courses", value: "48", icon: BookOpen, change: "+3 new" },
    { name: "Certificates Issued", value: "8,230", icon: Award, change: "+150 this week" },
    { name: "Avg. Pass Rate", value: "92%", icon: TrendingUp, change: "+2% this month" },
  ]

  const recentTeachers = [
    { id: "T-1042", name: "Ahmed Khan", school: "Govt High School Lahore", status: "Active" },
    { id: "T-1043", name: "Fatima Ali", school: "Beaconhouse Islamabad", status: "In Progress" },
    { id: "T-1044", name: "Usman Tariq", school: "City School Karachi", status: "Pending" },
    { id: "T-1045", name: "Ayesha Malik", school: "LGS Peshawar", status: "Active" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Welcome back, Super Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Plus className="h-4 w-4 mr-2" /> Add Teacher
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium text-brand-600 bg-brand-50 inline-flex px-2 py-1 rounded-md">
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Teachers Table */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Teachers</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{teacher.id}</td>
                      <td className="px-4 py-3">{teacher.name}</td>
                      <td className="px-4 py-3 text-slate-500">{teacher.school}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                          teacher.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {teacher.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Student Management System Banner */}
        <Card className="col-span-1 border-none shadow-sm bg-gradient-to-br from-brand-600 to-brand-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <GraduationCap className="h-32 w-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Student Management System</CardTitle>
            <p className="text-brand-100 text-sm mt-2">Manage student admissions, attendance, and academic records all in one place.</p>
          </CardHeader>
          <CardContent className="mt-8">
            <Button className="w-full bg-white text-brand-700 hover:bg-brand-50 soft-shadow">
              Open SMS Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
