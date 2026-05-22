"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Users, UserCheck, UserX, CreditCard, BookOpen, 
  UserPlus, Percent, Wallet, Search, Filter,
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from "lucide-react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Legend
} from 'recharts'

// Mock Data for Charts
const feeData = [
  { name: 'Grade 1', collected: 4000, pending: 2400 },
  { name: 'Grade 2', collected: 3000, pending: 1398 },
  { name: 'Grade 3', collected: 2000, pending: 9800 },
  { name: 'Grade 4', collected: 2780, pending: 3908 },
  { name: 'Grade 5', collected: 1890, pending: 4800 },
]

const recentActivity = [
  { id: 1, action: "New Admission", student: "Ahmed Ali", grade: "Grade 3", time: "2 hours ago", status: "completed" },
  { id: 2, action: "Fee Paid", student: "Sara Khan", grade: "Grade 5", time: "3 hours ago", status: "completed" },
  { id: 4, action: "New Admission", student: "Ali Raza", grade: "Grade 2", time: "5 hours ago", status: "completed" },
]

export default function StudentsAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
          <p className="text-sm text-slate-500">Overview of all students, attendance, and fees.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-40">
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm appearance-none"
            >
              <option value="all">All Classes</option>
              <option value="g1">Grade 1</option>
              <option value="g2">Grade 2</option>
              <option value="g3">Grade 3</option>
              <option value="g4">Grade 4</option>
              <option value="g5">Grade 5</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Students" value="1,245" icon={Users} trend="+12%" trendUp color="brand" />
        <MetricCard title="Total Classes" value="24" icon={BookOpen} color="blue" />
        <MetricCard title="Pending Fees" value="Rs. 450K" icon={CreditCard} trend="+5%" trendUp={false} color="amber" />
        <MetricCard title="Fee Collection" value="Rs. 2.1M" icon={Wallet} trend="This Month" color="emerald" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Fee Collection by Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full min-h-[288px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={feeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
                  <Bar dataKey="collected" name="Collected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-brand-600">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                    activity.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-brand-100 text-brand-600'
                  }`}>
                    {activity.action.includes('Admission') ? <UserPlus className="h-5 w-5" /> : 
                     activity.action.includes('Fee') ? <Wallet className="h-5 w-5" /> : 
                     <UserX className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{activity.action} - {activity.student}</p>
                    <p className="text-xs text-slate-500">{activity.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 hidden sm:inline-block">{activity.time}</span>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, color = "brand" }: any) {
  const colorStyles: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorStyles[color] || colorStyles.brand}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            {trendUp !== undefined && (
              <span className={`flex items-center mr-2 font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {trendUp ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {trend}
              </span>
            )}
            {trendUp === undefined && (
              <span className="font-medium text-slate-600 mr-2">{trend}</span>
            )}
            <span className="text-slate-500 text-xs">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
