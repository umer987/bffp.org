"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Plus, MoreVertical, Edit2, Trash2, X, Check } from "lucide-react"
import { createTeacher, deleteTeacher, getCourses, getTeachers, updateTeacher } from "@/lib/auth"

type Teacher = {
  id: string
  fullName: string
  email: string
  status: string
  teacherCode?: string
  address?: string
  courses?: Array<{ course: { id: string; title: string } }>
}

type CourseOption = {
  id: string
  title: string
}

export default function TeachersAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null)
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null)

  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [availableCourses, setAvailableCourses] = useState<CourseOption[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [school, setSchool] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const teacherResponse = await getTeachers()
        setTeachers(teacherResponse.data || [])

        const courseResponse = await getCourses()
        const courses = courseResponse.data || []
        setAvailableCourses(courses.map((course: any) => ({ id: course.id, title: course.title })))
      } catch (err) {
        console.error(err)
        setError("Failed to load teacher or course data.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const generateCredentials = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    setUsername(`teacher_${randomNum}`)

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$"
    let pass = ""
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pass)
  }

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter((c) => c !== courseId) : [...prev, courseId],
    )
  }

  const resetForm = () => {
    setIsModalOpen(false)
    setEditingTeacherId(null)
    setFullName("")
    setEmail("")
    setSchool("")
    setSelectedCourses([])
    setUsername("")
    setPassword("")
    setError(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload: any = {
      fullName: fullName.trim(),
      email: email.trim(),
      address: school.trim() || undefined,
      status: "ACTIVE",
      courseIds: selectedCourses.length ? selectedCourses : undefined,
    }

    if (username.trim()) {
      payload.username = username.trim()
    }
    if (password.trim()) {
      payload.password = password.trim()
    }

    try {
      if (editingTeacherId) {
        const response = await updateTeacher(editingTeacherId, payload)
        setTeachers((current) => current.map((teacher) =>
          teacher.id === editingTeacherId ? response.data : teacher,
        ))
      } else {
        const response = await createTeacher(payload)
        setTeachers((current) => [{ ...response.data.teacher, courses: response.data.teacher.courses || [] }, ...current])
      }
      resetForm()
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Unable to save teacher.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id)
    setFullName(teacher.fullName)
    setEmail(teacher.email)
    setSchool(teacher.address || "")
    setSelectedCourses((teacher.courses || []).map((item) => item.course.id))
    setUsername(teacher.username || `teacher_${teacher.id}`)
    setPassword("")
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return

    try {
      setLoading(true)
      await deleteTeacher(id)
      setTeachers((current) => current.filter((teacher) => teacher.id !== id))
    } catch (err) {
      console.error(err)
      setError("Failed to delete teacher.")
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = (id: string) => {
    setTeachers((current) => current.map((teacher) => {
      if (teacher.id === id) {
        return { ...teacher, status: teacher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
      }
      return teacher
    }))
    setDropdownOpenId(null)
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Teachers</h1>
          <p className="text-sm text-slate-500">Add, edit, and manage teacher accounts and assignments.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Teacher
        </Button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Card className="border-none shadow-sm">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search teachers..." className="pl-9" disabled />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white" disabled>Filter</Button>
              <Button variant="outline" className="bg-white" disabled>Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Teacher</th>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">School</th>
                  <th className="px-6 py-4 font-medium">Assigned Courses</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{teacher.fullName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{teacher.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{teacher.id}</td>
                    <td className="px-6 py-4 text-slate-600">{teacher.address || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{teacher.courses?.length ?? 0} Courses</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                        teacher.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        teacher.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEdit(teacher)} className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors rounded-md hover:bg-brand-50">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(teacher.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button onClick={() => setDropdownOpenId(dropdownOpenId === teacher.id ? null : teacher.id)} className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-100">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {dropdownOpenId === teacher.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-20 py-1 text-left">
                              <button 
                                onClick={() => toggleStatus(teacher.id)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                {teacher.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-slate-500">
            <div>Showing 1 to {teachers.length} of {teachers.length} entries</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editingTeacherId ? "Edit Teacher Profile" : "Add New Teacher"}</h2>
                <p className="text-sm text-slate-500">{editingTeacherId ? "Update details for this teacher." : "Create a profile and assign initial PDF courses."}</p>
              </div>
              <button 
                onClick={resetForm}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-teacher-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <Input placeholder="e.g. Sarah Ahmed" required value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <Input type="email" placeholder="sarah@school.edu.pk" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">School / Institution</label>
                  <Input placeholder="Enter school name" required value={school} onChange={e => setSchool(e.target.value)} />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Account Credentials</h3>
                    <Button type="button" variant="outline" size="sm" onClick={generateCredentials} className="h-8 text-xs bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100">
                      Auto-Generate
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Username</label>
                      <Input placeholder="teacher_username" value={username} onChange={e => setUsername(e.target.value)} minLength={3} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Password</label>
                      <Input type="text" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required={!editingTeacherId} />
                      {!editingTeacherId && (
                        <p className="text-xs text-slate-500">Password must be at least 8 characters.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Allot PDF Books / Courses</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {availableCourses.map((course) => {
                      const isSelected = selectedCourses.includes(course.id)
                      return (
                        <div 
                          key={course.id}
                          onClick={() => toggleCourse(course.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-brand-500 bg-brand-50' 
                              : 'border-border hover:border-brand-300'
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? 'text-brand-900' : 'text-slate-700'}`}>
                            {course.title}
                          </span>
                          <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {selectedCourses.length > 0 && (
                    <p className="text-xs font-medium text-brand-600 mt-2">
                      {selectedCourses.length} PDF course(s) selected
                    </p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" form="add-teacher-form" disabled={loading}>
                {editingTeacherId ? "Save Changes" : "Save & Assign"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
