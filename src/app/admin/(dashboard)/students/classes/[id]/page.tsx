"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  UserPlus, ArrowLeft, Search,
  Edit, Eye, X, Calendar, FileText, CheckCircle
} from "lucide-react"
import Link from "next/link"
import { createStudent, getStudents, updateStudent } from "@/lib/auth"

type Student = {
  id: string
  fullName: string
  rollNumber: string
  fatherName: string
  contact: string
  feeStatus: string
  address?: string | null
  admissionDate: string
  classId: string
  section?: { id: string; name: string } | null
}

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [students, setStudents] = useState<Student[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [rollNo, setRollNo] = useState("")
  const [fullName, setFullName] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [contact, setContact] = useState("")
  const [monthlyFee, setMonthlyFee] = useState("4000")
  const [address, setAddress] = useState("")
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getStudents(id)
        setStudents(response.data || [])
      } catch (err) {
        console.error(err)
        setError("Failed to load students for this class.")
      }
    }

    loadStudents()
  }, [id])

  const openModal = (student: Student | null = null) => {
    if (student) {
      setEditingStudent(student)
      setRollNo(student.rollNumber)
      setFullName(student.fullName)
      setFatherName(student.fatherName || "")
      setContact(student.contact)
      setMonthlyFee(student.feeStatus === "PAID" ? "0" : "4000")
      setAddress(student.address || "")
      setAdmissionDate(student.admissionDate?.slice(0, 10) || new Date().toISOString().slice(0, 10))
    } else {
      setEditingStudent(null)
      setRollNo("")
      setFullName("")
      setFatherName("")
      setContact("")
      setMonthlyFee("4000")
      setAddress("")
      setAdmissionDate(new Date().toISOString().slice(0, 10))
    }
    setIsModalOpen(true)
  }

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rollNo || !fullName || !fatherName || !contact) return

    const payload = {
      rollNumber: rollNo.trim(),
      fullName: fullName.trim(),
      fatherName: fatherName.trim(),
      contact: contact.trim(),
      admissionDate: admissionDate || new Date().toISOString(),
      address: address.trim() || undefined,
      classId: id,
      feeStatus: monthlyFee === "0" ? "PAID" : "PENDING",
    }

    try {
      setLoading(true)
      if (editingStudent) {
        const response = await updateStudent(editingStudent.id, payload)
        setStudents((current) => current.map((student) =>
          student.id === editingStudent.id ? response.data : student,
        ))
      } else {
        const response = await createStudent(payload)
        setStudents((current) => [response.data, ...current])
      }
      setError(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      setError("Unable to save student.")
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/students/classes">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-brand-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Class {id} Detail</h1>
            <p className="text-sm text-slate-500">Managing students for this specific class and section.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/students/classes/${id}/attendance`}>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-brand-50">
              <Calendar className="h-4 w-4 mr-2" /> Take Attendance
            </Button>
          </Link>
          <Link href={`/admin/students/classes/${id}/results`}>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-brand-50">
              <FileText className="h-4 w-4 mr-2" /> Generate Results
            </Button>
          </Link>
          <Button onClick={() => openModal()} className="bg-brand-600 hover:bg-brand-700 text-white shadow-md">
            <UserPlus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search students in this class..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus:ring-brand-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Student Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Roll No</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Fee Status</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{student.rollNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{student.fullName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      student.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                      student.feeStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{student.contact}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-brand-50 hover:text-brand-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/students/classes/${id}/results?studentId=${student.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-brand-50 hover:text-brand-600">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button onClick={() => openModal(student)} variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-brand-50 hover:text-brand-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl shadow-2xl overflow-hidden border-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50 py-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                  {editingStudent ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </div>
                <CardTitle className="text-xl font-bold">
                  {editingStudent ? 'Edit Student Details' : 'Register Student'}
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveStudent}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Roll Number *</label>
                  <Input 
                    required
                    placeholder="e.g. C1-045" 
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name *</label>
                  <Input 
                    required
                    placeholder="Student's name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Father's Name *</label>
                  <Input 
                    required
                    placeholder="Father's name" 
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Parent Contact *</label>
                  <Input 
                    required
                    placeholder="03xx-xxxxxxx" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Admission Date</label>
                  <Input 
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Monthly Fee</label>
                  <Input 
                    type="number" 
                    placeholder="4000" 
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <Input 
                    placeholder="Residential address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                   <Button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 text-lg font-bold shadow-lg transition-transform active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400">
                     <CheckCircle className="h-5 w-5 mr-2" /> {editingStudent ? 'Update Details' : 'Register Student'}
                   </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


