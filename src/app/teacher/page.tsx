"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { BookOpen, PlayCircle, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { getMe, getTeacherCourses } from "@/lib/auth"

function openCourseResource(course: any) {
  const firstResource = course.resources?.[0]
  if (!firstResource?.fileUrl) return
  window.open(firstResource.fileUrl, "_blank")
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [activeCourses, setActiveCourses] = useState<any[]>([])
  const [teacher, setTeacher] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const meResponse = await getMe()
        const currentTeacher = meResponse.data
        setTeacher(currentTeacher)

        const trackingKey = `timeSpent_${currentTeacher.id}`
        const savedTime = parseInt(localStorage.getItem(trackingKey) || "0", 10)
        setTimeSpent(savedTime)

        const courseResponse = await getTeacherCourses()
        const assignedCourses = courseResponse.data || []

        const calculatedProgress = Math.min(100, Math.floor(savedTime * 0.25))

        const mappedCourses = assignedCourses.map((item: any, idx: number) => {
          const course = item.course
          const colors = [
            "bg-emerald-100 text-emerald-600",
            "bg-blue-100 text-blue-600",
            "bg-amber-100 text-amber-600",
            "bg-purple-100 text-purple-600"
          ]

          const totalModules = course.resources?.length || 0
          return {
            id: course.id,
            title: course.title,
            progress: calculatedProgress,
            totalModules,
            completedModules: Math.floor((calculatedProgress / 100) * totalModules),
            nextModule: course.resources && course.resources.length > 0 ? course.resources[0].title : "No PDF lectures yet",
            resources: course.resources || [],
            image: colors[idx % colors.length],
          }
        })

        setActiveCourses(mappedCourses)
      } catch (err) {
        console.error(err)
        setError("Unable to load dashboard data. Please sign in again.")
        router.push("/login")
      }
    }

    loadData()
  }, [router])

  const upcomingExams = [
    {
      id: 1,
      course: "Assigned Exam Mockup",
      date: "Tomorrow, 10:00 AM",
      duration: "45 mins",
      attemptsRemaining: 2,
      status: "Ready"
    }
  ]

  if (error) {
    return (
      <div className="text-sm text-red-600">{error}</div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Learning Dashboard</h1>
        <p className="text-sm text-slate-500">Track your progress and continue your certification journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">In Progress Courses</h2>

          {activeCourses.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-xl shadow-sm">
              <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">No courses assigned yet.</p>
              <p className="text-sm text-slate-400 mt-1">Please wait for an administrator to allot courses to your account.</p>
            </div>
          ) : (
            activeCourses.map((course) => (
              <Card key={course.id} className="border-none shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className={`sm:w-48 h-32 sm:h-auto ${course.image} flex items-center justify-center`}>
                    <BookOpen className="h-12 w-12 opacity-50" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <PlayCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-[300px]">Up next: {course.nextModule}</span>
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-700/10">
                        {course.progress}% Complete
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{course.completedModules} of {course.totalModules} lectures read</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <Button variant="outline" size="sm">View Resources</Button>
                      <Button
                        size="sm"
                        disabled={course.totalModules === 0}
                        onClick={() => openCourseResource(course)}
                      >
                        {course.totalModules === 0 ? "No Content" : "Continue Learning"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="font-medium text-slate-900">{exam.course}</div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="h-4 w-4 mr-2" /> {exam.date}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <AlertCircle className="h-4 w-4 mr-2" /> {exam.attemptsRemaining} attempts left
                  </div>
                  <Button className="w-full mt-2" size="sm">Start Exam</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-brand-400" />
                Completed
              </CardTitle>
              <CardDescription className="text-slate-400">
                You have earned 0 certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-slate-400 text-center py-4">
                  Complete courses to earn certificates.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
