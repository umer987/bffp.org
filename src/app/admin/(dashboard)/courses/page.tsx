"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { BookOpen, Plus, FileText, Video, Settings, X, Upload, File, Trash2 } from "lucide-react"

type Lecture = {
  id: string;
  title: string;
  fileName: string;
}

type Course = {
  id: number;
  title: string;
  enrolled: number;
  status: string;
  modules: number;
  lastUpdated: string;
  lectures: Lecture[];
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('adminCourses')
    if (savedCourses) {
      const parsed = JSON.parse(savedCourses)
      const migrated = parsed.map((c: any) => ({
        ...c,
        lectures: c.lectures || []
      }))
      setCourses(migrated)
    } else {
      // Default initial courses
      const defaultCourses = [
        {
          id: 1,
          title: "Modern Pedagogy & Active Learning",
          enrolled: 450,
          status: "Published",
          modules: 0,
          lastUpdated: "2 days ago",
          lectures: []
        },
        {
          id: 2,
          title: "Digital Literacy for Educators",
          enrolled: 320,
          status: "Published",
          modules: 0,
          lastUpdated: "1 week ago",
          lectures: []
        },
        {
          id: 3,
          title: "Advanced Classroom Psychology",
          enrolled: 0,
          status: "Draft",
          modules: 0,
          lastUpdated: "Just now",
          lectures: []
        }
      ]
      setCourses(defaultCourses)
      localStorage.setItem('adminCourses', JSON.stringify(defaultCourses))
    }
  }, [])

  // Save to localStorage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('adminCourses', JSON.stringify(courses))
    }
  }, [courses])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCourseTitle, setNewCourseTitle] = useState("")

  const [managingCourseId, setManagingCourseId] = useState<number | null>(null)
  
  // Create Course logic
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCourseTitle.trim()) return

    const newCourse: Course = {
      id: Date.now(),
      title: newCourseTitle,
      enrolled: 0,
      status: "Draft",
      modules: 0,
      lastUpdated: "Just now",
      lectures: []
    }

    setCourses([newCourse, ...courses])
    setIsCreateModalOpen(false)
    setNewCourseTitle("")
  }

  // Manage Course logic
  const managingCourse = courses.find(c => c.id === managingCourseId)

  const handleUploadLecture = (courseId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    // reset input
    e.target.value = ''

    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: course.lectures.length + 1,
          lectures: [
            ...course.lectures,
            { id: `lec-${Date.now()}`, title: file.name, fileName: file.name }
          ]
        }
      }
      return course
    }))
  }

  const handleDeleteLecture = (courseId: number, lectureId: string) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const newLectures = course.lectures.filter(l => l.id !== lectureId)
        return {
          ...course,
          modules: newLectures.length,
          lectures: newLectures
        }
      }
      return course
    }))
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Courses</h1>
          <p className="text-sm text-slate-500">Create courses and upload PDF lectures directly.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {courses.map(course => (
            <Card key={course.id} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 flex-shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-slate-500">
                        <span>{course.modules} Lectures</span>
                        <span>•</span>
                        <span>{course.enrolled} Enrolled</span>
                        <span>•</span>
                        <span>Updated {course.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      course.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {course.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-brand-600"
                      onClick={() => setManagingCourseId(course.id)}
                    >
                      <Settings className="h-4 w-4 mr-2" /> Manage Lectures
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Resource Library</CardTitle>
              <CardDescription>Upload general teaching materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-slate-600 border-dashed">
                <FileText className="h-4 w-4 mr-2" /> Upload PDF Books
              </Button>
              <Button variant="outline" className="w-full justify-start text-slate-600 border-dashed">
                <FileText className="h-4 w-4 mr-2" /> Upload Teaching Guides
              </Button>
              <Button variant="outline" className="w-full justify-start text-slate-600 border-dashed">
                <Video className="h-4 w-4 mr-2" /> Upload Video Lectures
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Course</h2>
                <p className="text-sm text-slate-500">Add a title for your new course.</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form id="create-course-form" onSubmit={handleCreateCourse} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Course Title</label>
                  <Input 
                    placeholder="e.g. STEM AI Curriculum" 
                    required 
                    value={newCourseTitle} 
                    onChange={e => setNewCourseTitle(e.target.value)} 
                  />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" form="create-course-form">Create Course</Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Lectures Modal */}
      {managingCourseId && managingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Lectures: {managingCourse.title}</h2>
                <p className="text-sm text-slate-500">Upload PDF lectures directly to this course.</p>
              </div>
              <button 
                onClick={() => setManagingCourseId(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Uploaded Lectures ({(managingCourse.lectures || []).length})</h3>
                <div className="relative inline-block overflow-hidden">
                  <Button size="sm" variant="outline" className="pointer-events-none">
                    <Upload className="h-3 w-3 mr-2" /> Upload PDF
                  </Button>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleUploadLecture(managingCourse.id, e)}
                  />
                </div>
              </div>
              
              {!(managingCourse.lectures && managingCourse.lectures.length > 0) ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No PDF lectures uploaded yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Click the button above to add your first lecture.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {(managingCourse.lectures || []).map((lecture) => (
                    <li key={lecture.id} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center">
                        <File className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
                        <span className="text-slate-700 font-medium truncate max-w-[200px] sm:max-w-[400px] text-base">{lecture.title}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md font-medium">PDF Document</span>
                        <button 
                          onClick={() => handleDeleteLecture(managingCourse.id, lecture.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors rounded p-1.5 hover:bg-red-50"
                          title="Remove Lecture"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-6 border-t border-border bg-slate-50 flex justify-end">
              <Button onClick={() => setManagingCourseId(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
