"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { 
  ArrowLeft, Save, Printer, Eye, ChevronLeft, ChevronRight,
  FileText, Search, User, Book, Calculator
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ReportCard } from "@/components/students/ReportCard"

const mockStudents = [
  { id: 1, name: "Ali Ahmed", rollNo: "C1-001" },
  { id: 2, name: "Sara Raza", rollNo: "C1-002" },
  { id: 3, name: "Zainab Bibi", rollNo: "C1-003" },
]

const SUBJECTS = [
  "Mathematics", "English", "Urdu", "Science", "Social Studies", "Islamiyat"
]

const EXAM_TYPES = ["First Term", "Mid Term", "Final Exam"]

export default function ResultsManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const searchParams = useSearchParams()
  const initialStudentId = searchParams.get("studentId")

  const [examType, setExamType] = useState(EXAM_TYPES[0])
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    initialStudentId ? parseInt(initialStudentId) : null
  )

  // Initialize marks if empty
  useEffect(() => {
    const initialMarks: Record<string, Record<string, number>> = {}
    mockStudents.forEach(student => {
      initialMarks[student.id] = {}
      SUBJECTS.forEach(subject => {
        initialMarks[student.id][subject] = 0
      })
    })
    setMarks(initialMarks)
  }, [])

  const handleMarkChange = (studentId: number, subject: string, value: string) => {
    const val = parseInt(value) || 0
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: val > 100 ? 100 : val
      }
    }))
  }

  const getStudentTotal = (studentId: number) => {
    const studentMarks = marks[studentId] || {}
    return Object.values(studentMarks).reduce((a, b) => a + b, 0)
  }

  const selectedStudent = mockStudents.find(s => s.id === selectedStudentId)

  if (showPreview && selectedStudent) {
    const studentMarks = marks[selectedStudent.id] || {}
    const subjectsData = SUBJECTS.map(name => ({
      name,
      totalMarks: 100,
      obtainedMarks: studentMarks[name] || 0
    }))

    return (
      <div className="min-h-screen bg-slate-100 pb-12">
        <div className="max-w-[210mm] mx-auto pt-8 flex justify-between items-center mb-6 print:hidden">
          <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-slate-600">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Editor
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} className="bg-brand-600 hover:bg-brand-700 text-white">
              <Printer className="h-4 w-4 mr-2" /> Print Result Card
            </Button>
          </div>
        </div>
        <div id="printable-result">
          <ReportCard 
            studentName={selectedStudent.name}
            rollNo={selectedStudent.rollNo}
            className={`Class ${id}`}
            examType={examType}
            subjects={subjectsData}
          />
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-slate-900">Result Management</h1>
            <p className="text-sm text-slate-500">Input marks and generate result cards for Class {id}.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {EXAM_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Save className="h-4 w-4 mr-2" /> Save Marks
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium sticky left-0 bg-slate-50 z-10">Student Information</th>
                {SUBJECTS.map(sub => (
                  <th key={sub} className="px-4 py-4 font-medium text-center">{sub}</th>
                ))}
                <th className="px-6 py-4 font-medium text-center bg-slate-100/50">Total</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStudents.map((student) => (
                <tr key={student.id} className={`hover:bg-slate-50/50 transition-colors ${selectedStudentId === student.id ? 'bg-brand-50/30' : ''}`}>
                  <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.rollNo}</p>
                      </div>
                    </div>
                  </td>
                  {SUBJECTS.map(sub => (
                    <td key={sub} className="px-2 py-4">
                      <div className="flex justify-center">
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student.id]?.[sub] || 0}
                          onChange={(e) => handleMarkChange(student.id, sub, e.target.value)}
                          className="w-16 h-10 text-center rounded-md border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center font-black text-brand-600 bg-slate-50/30">
                    {getStudentTotal(student.id)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setShowPreview(true);
                      }}
                      className="text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                    >
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Helper Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-blue-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Book className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Auto-Save Enabled</p>
              <p className="text-xs text-blue-700">Marks are temporarily stored in session.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Grading System</p>
              <p className="text-xs text-emerald-700">A+ (&gt;90), A (&gt;80), B (&gt;70), C (&gt;60)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Printing Tip</p>
              <p className="text-xs text-amber-700">Use A4 paper size for the best result layout.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
