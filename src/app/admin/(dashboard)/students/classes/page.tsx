"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Users, UserPlus, BookOpen, Calendar, X, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClass, getClasses } from "@/lib/auth"

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [newClassName, setNewClassName] = useState("")
  const [newSection, setNewSection] = useState("")

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await getClasses()
        setClasses(response.data || [])
      } catch (err) {
        console.error(err)
        setError("Failed to load classes.")
      }
    }

    loadClasses()
  }, [])

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClassName) return

    try {
      setLoading(true)
      const response = await createClass({
        name: newClassName,
        sections: newSection ? [newSection] : [],
      })
      setClasses([response.data, ...classes])
      setIsModalOpen(false)
      setNewClassName("")
      setNewSection("")
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Unable to create class.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class Management</h1>
          <p className="text-sm text-slate-500">Manage classes, sections, and assign teachers.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="bg-brand-600 hover:bg-brand-700 text-white shadow-md">
            <UserPlus className="h-4 w-4 mr-2" /> Add Class
          </Button>
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-brand-500">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">{cls.name}</CardTitle>
                  <p className="text-sm font-medium text-brand-600 bg-brand-50 inline-block px-2 py-0.5 rounded-full mt-1">
                    Sections {cls.sections?.length || 0}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-brand-600">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center"><Users className="h-4 w-4 mr-2" /> Total Students</span>
                  <span className="font-medium text-slate-900">{cls._count?.students ?? 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center"><BookOpen className="h-4 w-4 mr-2" /> First Section</span>
                  <span className="font-medium text-slate-900">{cls.sections?.[0]?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center"><TrendingUp className="h-4 w-4 mr-2" /> Student Load</span>
                  <span className="font-medium text-emerald-600">{cls._count?.students ?? 0} students</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                <Link href={`/admin/students/classes/${cls.id}`} className="w-full">
                  <Button variant="outline" className="w-full text-xs bg-slate-50 border-slate-200 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <Users className="h-3 w-3 mr-1.5" /> View Students
                  </Button>
                </Link>
                <Link href={`/admin/students/classes/${cls.id}/attendance`} className="w-full">
                  <Button variant="outline" className="w-full text-xs bg-slate-50 border-slate-200 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <Calendar className="h-3 w-3 mr-1.5" /> Attendance
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl overflow-hidden border-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50 py-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                  <UserPlus className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold">Register New Class</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full">
                <X className="h-5 w-5 text-slate-500" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddClass} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Class Name</label>
                  <Input 
                    required
                    placeholder="e.g. Class 10" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Section / Group</label>
                  <Input 
                    required
                    placeholder="e.g. Science or Section A" 
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-brand-500"
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 text-lg font-bold shadow-lg transition-transform active:scale-95">
                    <CheckCircle className="h-5 w-5 mr-2" /> Create Class
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

