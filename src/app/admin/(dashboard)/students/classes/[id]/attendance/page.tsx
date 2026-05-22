"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Calendar, CheckCircle, XCircle, Clock, 
  FileWarning, ArrowLeft, Download
} from "lucide-react"
import Link from "next/link"
import { getStudents, saveAttendance } from "@/lib/auth"

type AttendanceStudent = {
  id: string
  fullName: string
  rollNumber: string
  feeStatus?: string | null
}

export default function ClassAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [students, setStudents] = useState<AttendanceStudent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true)
      try {
        const response = await getStudents(id)
        const items = response.data || []
        const normalizedStudents = items.map((student: any) => ({
          id: student.id,
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          feeStatus: student.feeStatus,
        }))
        setStudents(normalizedStudents)
      } catch (err) {
        console.error(err)
        setError("Failed to load class students.")
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [id])

  useEffect(() => {
    if (students.length > 0 && Object.keys(attendance).length === 0) {
      const initialAttendance: Record<string, string> = {}
      students.forEach((student) => {
        initialAttendance[student.id] = "PRESENT"
      })
      setAttendance(initialAttendance)
    }
  }, [students, attendance])

  const markAll = (status: string) => {
    const newAtt: Record<string, string> = {}
    students.forEach((student) => {
      newAtt[student.id] = status
    })
    setAttendance(newAtt)
  }

  const updateStatus = (studentId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSaveAttendance = async () => {
    setSuccess(null)
    setError(null)
    setSaveLoading(true)

    try {
      const records = students.map((student) => ({
        studentId: student.id,
        status: (attendance[student.id] || "PRESENT").toUpperCase() as "PRESENT" | "ABSENT" | "LEAVE" | "LATE",
      }))

      await saveAttendance({ classId: id, date: selectedDate, records })
      setSuccess("Attendance saved successfully.")
    } catch (err) {
      console.error(err)
      setError("Failed to save attendance. Please try again.")
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/students/classes/${id}`}>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-brand-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Daily Attendance: Class {id}</h1>
            <p className="text-sm text-slate-500">View Roll No, Name, and Fee Status while marking attendance.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700" disabled>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button
            onClick={handleSaveAttendance}
            disabled={saveLoading || students.length === 0}
            className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveLoading ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>

      {/* Date & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" /> Date
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col justify-end">
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => markAll('Present')} className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                      Mark All Present
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => markAll('Absent')} className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      Mark All Absent
                    </Button>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-brand-50 border-brand-100 flex flex-col justify-center">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-brand-600 mb-1">Attendance Rate</div>
            <div className="text-3xl font-bold text-slate-900">92%</div>
            <div className="text-xs text-brand-500 mt-1">Class Average</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Sheet */}
      {(error || success) && (
        <div className="space-y-2">
          {error && <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">{success}</div>}
        </div>
      )}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium w-32">Roll Number</th>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Fee Status</th>
                <th className="px-6 py-4 font-medium text-center">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No students found for this class.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{student.rollNumber}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{student.fullName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        student.feeStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {student.feeStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <StatusButton 
                          active={attendance[student.id] === 'PRESENT'} 
                          onClick={() => updateStatus(student.id, 'PRESENT')}
                          label="P" color="emerald" icon={CheckCircle} 
                        />
                        <StatusButton 
                          active={attendance[student.id] === 'ABSENT'} 
                          onClick={() => updateStatus(student.id, 'ABSENT')}
                          label="A" color="red" icon={XCircle} 
                        />
                        <StatusButton 
                          active={attendance[student.id] === 'LEAVE'} 
                          onClick={() => updateStatus(student.id, 'LEAVE')}
                          label="L" color="amber" icon={FileWarning} 
                        />
                        <StatusButton 
                          active={attendance[student.id] === 'LATE'} 
                          onClick={() => updateStatus(student.id, 'LATE')}
                          label="T" color="blue" icon={Clock} 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatusButton({ active, onClick, label, color, icon: Icon }: any) {
  const colorClasses = {
    emerald: active ? "bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50",
    red: active ? "bg-red-100 text-red-700 border-red-300 shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50",
    amber: active ? "bg-amber-100 text-amber-700 border-amber-300 shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50",
    blue: active ? "bg-blue-100 text-blue-700 border-blue-300 shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50",
  }
  
  return (
    <button 
      onClick={onClick}
      title={label}
      className={`flex items-center justify-center w-10 h-10 rounded-full border text-xs font-bold transition-all duration-200 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      {label}
    </button>
  )
}
