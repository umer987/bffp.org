"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  User, Phone, MapPin, CreditCard, 
  CheckCircle, ArrowLeft, Edit,
  GraduationCap, ShieldAlert, History
} from "lucide-react"
import Link from "next/link"
import { getStudent } from "@/lib/auth"

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStudent = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getStudent(id)
        setStudent(response.data)
      } catch (err: any) {
        console.error(err)
        setError(err?.message || "Failed to load student details.")
      } finally {
        setLoading(false)
      }
    }

    loadStudent()
  }, [id])

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-600">Loading student details...</div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">{error}</div>
    )
  }

  if (!student) {
    return (
      <div className="py-10 text-center text-slate-600">Student not found.</div>
    )
  }
  
  const studentClassName = student.class?.name || "-"
  const studentSectionName = student.section?.name || "-"
  const attendanceRate = `${student.attendancePercentage ?? 0}%`
  const admissionDateValue = student.admissionDate ? new Date(student.admissionDate).toISOString().split("T")[0] : "-"
  const studentStatus = student.status || 'Active'

  const feeHistory = [
    { month: "May 2026", amount: 5000, status: student.feeStatus, date: student.feeStatus === 'Paid' ? "2026-05-02" : "-" },
    { month: "April 2026", amount: 5000, status: "Paid", date: "2026-04-05" },
    { month: "March 2026", amount: 5000, status: "Paid", date: "2026-03-08" },
  ]

  const activity = [
    { date: "2026-05-02", action: `Monthly fee status: ${student.feeStatus}`, type: "fee" },
    { date: "2026-04-15", action: "Awarded 'Student of the Month'", type: "academic" },
    { date: "2026-04-10", action: "Attendance marked: Present", type: "attendance" },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Back & Actions */}
      <div className="flex justify-between items-center">
        <Link href="/admin/students/classes">
          <Button variant="ghost" className="text-slate-600 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Classes
          </Button>
        </Link>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white">
          <Edit className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden text-center">
            <div className="h-24 bg-gradient-to-r from-brand-600 to-emerald-600" />
            <CardContent className="pt-0 -mt-12">
              <div className="h-24 w-24 rounded-full bg-white p-1 mx-auto shadow-md">
                <div className="h-full w-full rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold">
                  {student.fullName?.charAt(0) || "S"}
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{student.fullName}</h2>
              <p className="text-sm text-slate-500">{student.rollNumber} • {studentClassName} ({studentSectionName})</p>
              <div className="mt-4 flex justify-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  studentStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {studentStatus}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                  student.feeStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                   Fee: {student.feeStatus}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={Phone} label="Contact" value={student.contact || "-"} />
              <InfoRow icon={User} label="Father" value={student.fatherName || "-"} />
              <InfoRow icon={ShieldAlert} label="Emergency" value={student.emergencyContact || "-"} />
              <InfoRow icon={MapPin} label="Address" value={student.address || "-"} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm bg-brand-50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">Attendance Rate</p>
                  <h3 className="text-2xl font-bold text-brand-900">{attendanceRate}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-emerald-50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Academic Rank</p>
                  <h3 className="text-2xl font-bold text-emerald-900">4th / 30</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg text-slate-900">Detailed Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <DetailItem label="CNIC / B-Form" value={student.cnic || "-"} />
                <DetailItem label="Date of Birth" value={student.dob || "-"} />
                <DetailItem label="Gender" value={student.gender || "-"} />
                <DetailItem label="Admission Date" value={admissionDateValue} />
                <DetailItem label="Previous School" value={student.previousSchool || "-"} />
                <DetailItem label="Parent Contact" value={student.parentContact || "-"} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-900">
                    <CreditCard className="h-5 w-5 mr-2 text-slate-400" /> Fee History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {feeHistory.map((fee, i) => (
                      <div key={i} className="px-6 py-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{fee.month}</p>
                          <p className="text-xs text-slate-500">
                            {fee.status === 'Paid' ? `Paid on ${fee.date}` : 'Payment Pending'}
                          </p>
                        </div>
                        <span className={`text-sm font-bold ${fee.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          Rs.{fee.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-900">
                    <History className="h-5 w-5 mr-2 text-slate-400" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6 py-2 space-y-4">
                    {activity.map((act, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-brand-500" />
                        <div>
                          <p className="text-sm text-slate-800">{act.action}</p>
                          <p className="text-xs text-slate-500">{act.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-slate-400 mt-1" />
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm text-slate-900">{value}</p>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: any) {
  return (
    <div className="px-6 py-4 border-b border-slate-50">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-sm text-slate-900 font-medium">{value}</p>
    </div>
  )
}
