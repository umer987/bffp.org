"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { FileText, Clock, AlertCircle, CheckCircle, Lock, X, ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type TeacherExamStats = {
  [examId: string]: {
    status: 'Available' | 'Failed' | 'Locked' | 'Passed';
    attemptsRemaining: number;
    score: number | null;
  }
}

export default function ExamsPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [exams, setExams] = useState<any[]>([])
  const [stats, setStats] = useState<TeacherExamStats>({})

  // Exam Runner State
  const [activeExam, setActiveExam] = useState<any>(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({})
  const [examResult, setExamResult] = useState<any>(null) // Used to show immediate results

  useEffect(() => {
    // 1. Check current teacher
    const currentTeacherRaw = localStorage.getItem('currentTeacher')
    if (!currentTeacherRaw) {
      router.push("/login")
      return
    }

    const currentTeacher = JSON.parse(currentTeacherRaw)
    setTeacher(currentTeacher)

    // 2. Load assigned admin exams
    const adminExamsRaw = localStorage.getItem('adminExams')
    let allExams: any[] = []
    if (adminExamsRaw) {
      allExams = JSON.parse(adminExamsRaw)
    }

    const assignedTitles = currentTeacher.assignedCourses || []
    const teacherAssignedExams = allExams.filter(e => assignedTitles.includes(e.course))
    setExams(teacherAssignedExams)

    // 3. Load stats
    const statsKey = `teacherExamStats_${currentTeacher.id}`
    const savedStats = localStorage.getItem(statsKey)
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Initialize stats for new exams
      const initialStats: TeacherExamStats = {}
      teacherAssignedExams.forEach(e => {
        initialStats[e.id] = {
          status: 'Available',
          attemptsRemaining: 3,
          score: null
        }
      })
      setStats(initialStats)
      localStorage.setItem(statsKey, JSON.stringify(initialStats))
    }
  }, [router])

  const updateStats = (newStats: TeacherExamStats) => {
    setStats(newStats)
    if (teacher) {
      localStorage.setItem(`teacherExamStats_${teacher.id}`, JSON.stringify(newStats))
    }
  }

  const startExam = (exam: any) => {
    setActiveExam(exam)
    setCurrentQIndex(0)
    setAnswers({})
    setExamResult(null)
  }

  const submitExam = () => {
    if (!activeExam || !teacher) return

    let correctCount = 0
    activeExam.mcqs.forEach((mcq: any) => {
      if (answers[mcq.id] === mcq.correctOptionIndex) {
        correctCount++
      }
    })

    const scorePercentage = Math.round((correctCount / activeExam.mcqs.length) * 100)
    const passed = scorePercentage >= 60

    const currentStat = stats[activeExam.id] || { status: 'Available', attemptsRemaining: 3, score: null }
    const attemptsLeft = passed ? currentStat.attemptsRemaining : currentStat.attemptsRemaining - 1
    
    let newStatus = passed ? 'Passed' : 'Failed'
    if (!passed && attemptsLeft <= 0) {
      newStatus = 'Locked'
      
      // Reset course progress logic
      localStorage.setItem(`timeSpent_${teacher.id}`, "0")
      // Force UI update across tabs
      window.dispatchEvent(new Event('storage')) 
    }

    const newStats = {
      ...stats,
      [activeExam.id]: {
        status: newStatus as 'Passed' | 'Failed' | 'Locked',
        attemptsRemaining: attemptsLeft,
        score: scorePercentage
      }
    }

    updateStats(newStats)

    setExamResult({
      score: scorePercentage,
      passed,
      locked: newStatus === 'Locked'
    })
  }

  const closeRunner = () => {
    setActiveExam(null)
    setExamResult(null)
  }

  if (!teacher) return null

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Examinations</h1>
        <p className="text-sm text-slate-500">Take exams, view past results, and track your remaining attempts.</p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
          <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>You have no available exams.</p>
          <p className="text-sm text-slate-400 mt-1">Exams will appear here once an administrator assigns them to your courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {exams.map((exam) => {
            const stat = stats[exam.id] || { status: 'Available', attemptsRemaining: 3, score: null }
            const totalQuestions = exam.mcqs?.length || 0

            return (
              <Card key={exam.id} className={`border-none shadow-sm ${stat.status === 'Locked' ? 'bg-slate-50' : 'bg-white'}`}>
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start space-x-4">
                    <div className={`mt-1 p-3 rounded-xl flex-shrink-0 ${
                      stat.status === 'Passed' ? 'bg-emerald-100 text-emerald-600' :
                      stat.status === 'Failed' ? 'bg-amber-100 text-amber-600' :
                      stat.status === 'Locked' ? 'bg-red-100 text-red-600' :
                      'bg-brand-100 text-brand-600'
                    }`}>
                      {stat.status === 'Passed' ? <CheckCircle className="h-6 w-6" /> :
                       stat.status === 'Failed' ? <AlertCircle className="h-6 w-6" /> :
                       stat.status === 'Locked' ? <Lock className="h-6 w-6" /> :
                       <FileText className="h-6 w-6" />}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{exam.course} Final Exam</h3>
                      <div className="flex flex-wrap items-center mt-2 text-sm text-slate-500 gap-x-4 gap-y-2">
                        <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {exam.duration}</span>
                        <span className="flex items-center"><FileText className="h-4 w-4 mr-1" /> {totalQuestions} Questions</span>
                        <span className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> 
                          {stat.attemptsRemaining} / 3 Attempts Left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 md:w-auto w-full md:border-l border-border md:pl-6">
                    {stat.score !== null && (
                      <div className="text-center sm:text-right w-full sm:w-auto">
                        <div className="text-sm font-medium text-slate-500">Last Score</div>
                        <div className={`text-xl font-bold ${
                          stat.status === 'Passed' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {stat.score}%
                        </div>
                      </div>
                    )}
                    
                    <div className="w-full sm:w-auto">
                      {stat.status === 'Available' && (
                        <Button className="w-full sm:w-auto" onClick={() => startExam(exam)} disabled={totalQuestions === 0}>
                          {totalQuestions === 0 ? "No MCQs Yet" : "Start Exam"}
                        </Button>
                      )}
                      {stat.status === 'Failed' && (
                        <Button variant="outline" onClick={() => startExam(exam)} className="w-full sm:w-auto border-amber-200 text-amber-700 hover:bg-amber-50" disabled={totalQuestions === 0}>
                          Retake Exam
                        </Button>
                      )}
                      {stat.status === 'Passed' && (
                        <Button variant="outline" className="w-full sm:w-auto border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                          View Results
                        </Button>
                      )}
                      {stat.status === 'Locked' && (
                        <div className="bg-red-50 text-red-700 text-xs font-medium px-3 py-2 rounded-md max-w-xs text-center">
                          Maximum attempts reached. Your course progress has been reset. Please relearn the material.
                        </div>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Exam Runner Modal */}
      {activeExam && (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col">
          <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0 shadow-sm">
            <div>
              <h2 className="font-bold text-slate-900">{activeExam.course} - Final Exam</h2>
              <p className="text-xs text-slate-500">Pass mark: 60%</p>
            </div>
            {!examResult && (
              <Button variant="ghost" onClick={closeRunner} className="text-slate-500 hover:text-slate-900">
                <X className="h-5 w-5 mr-2" /> Exit Exam
              </Button>
            )}
          </header>

          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center relative">
            {examResult ? (
              <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
                {examResult.passed ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">You Passed!</h2>
                    <p className="text-slate-500 mb-6">Congratulations on completing the exam.</p>
                  </>
                ) : examResult.locked ? (
                  <>
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Exam Locked</h2>
                    <p className="text-red-600 font-medium mb-2">You have failed 3 times.</p>
                    <p className="text-slate-500 text-sm mb-6">Your course progress has been reset to 0%. You must review the materials before attempting the exam again.</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Not Quite!</h2>
                    <p className="text-slate-500 mb-6">You did not meet the 60% passing requirement. Review the material and try again.</p>
                  </>
                )}
                
                <div className="bg-slate-50 p-4 rounded-xl mb-8">
                  <div className="text-sm text-slate-500 mb-1">Your Score</div>
                  <div className={`text-4xl font-black ${examResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {examResult.score}%
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={closeRunner}>
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <div className="max-w-3xl w-full">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-brand-600 uppercase tracking-wider">
                    Question {currentQIndex + 1} of {activeExam.mcqs.length}
                  </span>
                  <div className="flex items-center gap-2">
                    {activeExam.mcqs.map((_: any, i: number) => (
                      <div key={i} className={`h-2.5 w-2.5 rounded-full ${
                        i === currentQIndex ? 'bg-brand-600 ring-4 ring-brand-100' : 
                        answers[activeExam.mcqs[i].id] !== undefined ? 'bg-brand-300' : 'bg-slate-200'
                      }`} />
                    ))}
                  </div>
                </div>

                {activeExam.mcqs[currentQIndex] && (
                  <Card className="border-none shadow-xl">
                    <CardContent className="p-8 md:p-12">
                      <h3 className="text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
                        {activeExam.mcqs[currentQIndex].question}
                      </h3>
                      
                      <div className="space-y-4">
                        {activeExam.mcqs[currentQIndex].options.map((opt: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setAnswers({...answers, [activeExam.mcqs[currentQIndex].id]: idx})}
                            className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center ${
                              answers[activeExam.mcqs[currentQIndex].id] === idx 
                                ? 'border-brand-500 bg-brand-50 shadow-md transform -translate-y-0.5' 
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm ${
                              answers[activeExam.mcqs[currentQIndex].id] === idx 
                                ? 'bg-brand-500 text-white' 
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={`text-lg ${answers[activeExam.mcqs[currentQIndex].id] === idx ? 'text-brand-900 font-medium' : 'text-slate-700'}`}>
                              {opt}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="mt-8 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
                    disabled={currentQIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                  </Button>
                  
                  {currentQIndex === activeExam.mcqs.length - 1 ? (
                    <Button 
                      size="lg" 
                      onClick={submitExam}
                      disabled={Object.keys(answers).length < activeExam.mcqs.length}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg"
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      onClick={() => setCurrentQIndex(i => Math.min(activeExam.mcqs.length - 1, i + 1))}
                    >
                      Next <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  )
}
