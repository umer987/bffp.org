"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { FileText, Plus, Edit2, Trash2, X, Settings, CheckCircle2, Circle } from "lucide-react"

type MCQ = {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

type Exam = {
  id: number;
  course: string;
  mcqs: MCQ[];
  duration: string;
  status: string;
}

export default function ExamsAdminPage() {
  const [exams, setExams] = useState<Exam[]>([])

  useEffect(() => {
    const savedExams = localStorage.getItem('adminExams')
    if (savedExams) {
      setExams(JSON.parse(savedExams))
    }
  }, [])

  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem('adminExams', JSON.stringify(exams))
    }
  }, [exams])
  const [availableCourses, setAvailableCourses] = useState<string[]>([])
  
  useEffect(() => {
    const savedCourses = localStorage.getItem('adminCourses')
    if (savedCourses) {
      try {
        const parsed = JSON.parse(savedCourses)
        const titles = parsed.map((c: any) => c.title)
        setAvailableCourses(titles)
      } catch(e) {}
    }
  }, [])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("")
  const [duration, setDuration] = useState("60 mins")

  const [managingExamId, setManagingExamId] = useState<number | null>(null)

  // MCQ Form State
  const [newQuestion, setNewQuestion] = useState("")
  const [newOptions, setNewOptions] = useState(["", "", "", ""])
  const [correctIndex, setCorrectIndex] = useState(0)

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return alert("Please select a course.")

    const newExam: Exam = {
      id: Date.now(),
      course: selectedCourse,
      mcqs: [],
      duration: duration,
      status: "Draft",
    }

    setExams([newExam, ...exams])
    setIsCreateModalOpen(false)
    setSelectedCourse("")
    setDuration("60 mins")
  }

  const handleDeleteExam = (id: number) => {
    if(confirm("Are you sure you want to remove this exam?")) {
      setExams(exams.filter(e => e.id !== id))
    }
  }

  const handleAddMCQ = (examId: number) => {
    if (!newQuestion.trim() || newOptions.some(opt => !opt.trim())) {
      return alert("Please fill out the question and all 4 options.")
    }

    const newMCQ: MCQ = {
      id: `mcq-${Date.now()}`,
      question: newQuestion,
      options: [...newOptions],
      correctOptionIndex: correctIndex
    }

    setExams(exams.map(exam => {
      if (exam.id === examId) {
        return {
          ...exam,
          status: "Active", // automatically mark active if it has questions
          mcqs: [...exam.mcqs, newMCQ]
        }
      }
      return exam
    }))

    // Reset MCQ form
    setNewQuestion("")
    setNewOptions(["", "", "", ""])
    setCorrectIndex(0)
  }

  const handleDeleteMCQ = (examId: number, mcqId: string) => {
    setExams(exams.map(exam => {
      if (exam.id === examId) {
        const remaining = exam.mcqs.filter(m => m.id !== mcqId)
        return {
          ...exam,
          status: remaining.length === 0 ? "Draft" : "Active",
          mcqs: remaining
        }
      }
      return exam
    }))
  }

  const updateOption = (index: number, value: string) => {
    const updated = [...newOptions]
    updated[index] = value
    setNewOptions(updated)
  }

  const managingExam = exams.find(e => e.id === managingExamId)

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Exams</h1>
          <p className="text-sm text-slate-500">Create exams and build MCQs for specific courses.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Exam
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[300px]">
            {exams.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No exams created yet.</p>
                <p className="text-sm text-slate-400 mt-1">Click the button above to assign an exam to a course.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Exam Name (Course)</th>
                    <th className="px-6 py-4 font-medium">Questions</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-brand-600" />
                          <span className="font-medium text-slate-900">{exam.course} Final Exam</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{exam.mcqs.length} MCQs</td>
                      <td className="px-6 py-4 text-slate-600">{exam.duration}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                          exam.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-brand-600"
                            onClick={() => setManagingExamId(exam.id)}
                          >
                            <Settings className="h-4 w-4 mr-2" /> Manage MCQs
                          </Button>
                          <button onClick={() => handleDeleteExam(exam.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 ml-2">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Exam Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Exam</h2>
                <p className="text-sm text-slate-500">Initialize an exam shell for a specific course.</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="create-exam-form" onSubmit={handleCreateExam} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Course</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a course...</option>
                    {availableCourses.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                  {availableCourses.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No courses available. Please create a course first.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Exam Duration</label>
                  <Input 
                    placeholder="e.g. 60 mins" 
                    required 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="create-exam-form" disabled={!selectedCourse}>
                Create Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage MCQs Builder Modal */}
      {managingExamId && managingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-slate-900">MCQ Builder: {managingExam.course}</h2>
                <p className="text-sm text-slate-500">Add multiple choice questions for this exam.</p>
              </div>
              <button 
                onClick={() => setManagingExamId(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Left Side: MCQ List */}
              <div className="w-1/3 border-r border-slate-200 overflow-y-auto bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase mb-4">Saved Questions ({managingExam.mcqs.length})</h3>
                {managingExam.mcqs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No questions added yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {managingExam.mcqs.map((mcq, idx) => (
                      <li key={mcq.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                        <span className="text-xs font-bold text-brand-600 mb-1 block">Q{idx + 1}.</span>
                        <p className="text-sm text-slate-800 line-clamp-2">{mcq.question}</p>
                        <button 
                          onClick={() => handleDeleteMCQ(managingExam.id, mcq.id)}
                          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Right Side: Add New MCQ */}
              <div className="w-2/3 p-6 overflow-y-auto bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Question</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Question Text</label>
                    <textarea 
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      placeholder="Type the question here..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Options (Select the correct one)</label>
                    <div className="space-y-3">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg border transition-colors ${
                          correctIndex === index ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                        }`}>
                          <button 
                            className="flex-shrink-0 focus:outline-none"
                            onClick={() => setCorrectIndex(index)}
                          >
                            {correctIndex === index ? (
                              <CheckCircle2 className="h-5 w-5 text-brand-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-300" />
                            )}
                          </button>
                          <span className="text-sm font-bold text-slate-500 w-6">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <Input 
                            placeholder={`Option ${index + 1}`}
                            value={newOptions[index]}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent px-0 h-8"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => handleAddMCQ(managingExam.id)} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Question to Exam
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
