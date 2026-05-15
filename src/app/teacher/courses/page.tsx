"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { BookOpen, PlayCircle, Clock, BookText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MyCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [teacher, setTeacher] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    // 1. Check current teacher
    const currentTeacherRaw = localStorage.getItem('currentTeacher')
    if (!currentTeacherRaw) {
      router.push("/login")
      return
    }

    const currentTeacher = JSON.parse(currentTeacherRaw)
    setTeacher(currentTeacher)

    const loadTime = () => {
      const t = parseInt(localStorage.getItem(`timeSpent_${currentTeacher.id}`) || '0', 10)
      setTimeSpent(t)
    }
    loadTime()

    // Listen for our fast-forward test event
    window.addEventListener('storage', loadTime)

    // 2. Load all courses created by admin
    const adminCoursesRaw = localStorage.getItem('adminCourses')
    let allCourses: any[] = []
    if (adminCoursesRaw) {
      allCourses = JSON.parse(adminCoursesRaw)
    }

    // 3. Filter courses that are assigned to this teacher
    const assignedTitles = currentTeacher.assignedCourses || []
    const assignedCourses = allCourses.filter(c => assignedTitles.includes(c.title))

    // Math: 20 minutes = 5% progress => 1 minute = 0.25% progress. Max 100%.
    const calculatedProgress = Math.min(100, Math.floor(timeSpent * 0.25))

    // Map them to the UI format
    const mappedCourses = assignedCourses.map((c, idx) => {
      // Rotate colors for aesthetics
      const colors = [
        "bg-emerald-100 text-emerald-600",
        "bg-blue-100 text-blue-600",
        "bg-amber-100 text-amber-600",
        "bg-purple-100 text-purple-600"
      ]
      
      return {
        id: c.id,
        title: c.title,
        description: `This course contains ${c.lectures?.length || 0} PDF lectures.`,
        progress: calculatedProgress,
        totalModules: c.lectures?.length || 0,
        completedModules: Math.floor((calculatedProgress / 100) * (c.lectures?.length || 0)),
        duration: "Self Paced",
        status: calculatedProgress === 100 ? "Completed" : calculatedProgress > 0 ? "In Progress" : "Not Started",
        imageClass: colors[idx % colors.length]
      }
    })

    setCourses(mappedCourses)
    
    return () => window.removeEventListener('storage', loadTime)
  }, [router, timeSpent])

  if (!teacher) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <p className="text-sm text-slate-500">Welcome, {teacher.name}. View and manage your assigned training modules.</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>You have no assigned courses.</p>
          <p className="text-sm text-slate-400 mt-1">Please contact your administrator to get PDF books allotted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-none shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className={`h-40 ${course.imageClass} rounded-t-xl flex items-center justify-center relative`}>
                <BookOpen className="h-16 w-16 opacity-50" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {course.status}
                </div>
              </div>
              
              <CardContent className="flex-1 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{course.description}</p>
                
                <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                  <span className="flex items-center"><BookText className="h-4 w-4 mr-1" /> {course.totalModules} Lectures</span>
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {course.duration}</span>
                </div>

                {course.status !== "Not Started" && (
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">Progress</span>
                      <span className="text-brand-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-border">
                  {course.progress === 100 ? (
                    <Button variant="outline" className="w-full">Review Course</Button>
                  ) : course.progress > 0 ? (
                    <Button className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" /> Continue Learning
                    </Button>
                  ) : (
                    <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled={course.totalModules === 0}>
                      {course.totalModules === 0 ? "No Content Yet" : "Start Course"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
