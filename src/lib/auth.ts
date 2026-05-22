import { apiFetch, getJson, postJson, setStoredAuthToken } from "./api"

export type AuthResponse<T = any> = {
  success: boolean
  data: T
}

export function adminLogin(email: string, password: string) {
  return postJson<AuthResponse<{ token: string; user: any }>>("/api/auth/admin-login", {
    email,
    password,
  })
    .then((response) => {
      if (response.data?.token) {
        setStoredAuthToken(response.data.token)
      }
      return response
    })
}

export function teacherLogin(username: string, password: string) {
  return postJson<AuthResponse<{ token: string; user: any }>>("/api/teacher/login", {
    username,
    password,
  }).then((response) => {
    if (response.data?.token) {
      setStoredAuthToken(response.data.token)
    }
    return response
  })
}

export function getMe() {
  return getJson<AuthResponse<any>>("/api/auth/me")
}

export function getTeachers(search = "", page = 1, pageSize = 20) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  params.set("page", String(page))
  params.set("pageSize", String(pageSize))
  return getJson<AuthResponse<any[]>>(`/api/teachers?${params.toString()}`)
}

export function createTeacher(payload: any) {
  return postJson<AuthResponse<any>>("/api/teachers", payload)
}

export function updateTeacher(id: string, payload: any) {
  return apiFetch<AuthResponse<any>>(`/api/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteTeacher(id: string) {
  return apiFetch<void>(`/api/teachers/${id}`, {
    method: "DELETE",
  })
}

export function getCourses(search = "", page = 1, pageSize = 20) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  params.set("page", String(page))
  params.set("pageSize", String(pageSize))
  return getJson<AuthResponse<any[]>>(`/api/courses?${params.toString()}`)
}

export function createCourse(payload: any) {
  return postJson<AuthResponse<any>>("/api/courses", payload)
}

export function uploadPdf(file: File, folder?: string) {
  const formData = new FormData()
  formData.append("file", file)
  if (folder) formData.append("folder", folder)
  return apiFetch<AuthResponse<any>>("/api/uploads/pdf", {
    method: "POST",
    body: formData,
  })
}

export function addCourseResource(courseId: string, payload: any) {
  return apiFetch<AuthResponse<any>>(`/api/courses/${courseId}/resources`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getTeacherCourses() {
  return getJson<AuthResponse<any[]>>("/api/teacher/courses")
}

export function getTeacherExams() {
  return getJson<AuthResponse<any[]>>("/api/teacher/exams")
}

export function getClasses() {
  return getJson<AuthResponse<any[]>>("/api/classes")
}

export function createClass(payload: any) {
  return postJson<AuthResponse<any>>("/api/classes", payload)
}

export function getStudents(classId = "", search = "", page = 1, pageSize = 100) {
  const params = new URLSearchParams()
  if (classId) params.set("classId", classId)
  if (search) params.set("search", search)
  params.set("page", String(page))
  params.set("pageSize", String(pageSize))
  return getJson<AuthResponse<any[]>>(`/api/students?${params.toString()}`)
}

export function getFees() {
  return getJson<AuthResponse<any[]>>("/api/fees")
}

export function createStudent(payload: any) {
  return postJson<AuthResponse<any>>("/api/students", payload)
}

export function saveAttendance(payload: {
  classId: string
  date: string
  records: Array<{
    studentId: string
    status: "PRESENT" | "ABSENT" | "LEAVE" | "LATE"
    note?: string
  }>
}) {
  return postJson<AuthResponse<any>>("/api/attendance", payload)
}

export function collectFee(payload: {
  studentId: string
  month: number
  year: number
  amount: number
  paymentMethod?: "CASH" | "BANK_TRANSFER" | "CARD" | "OTHER"
}) {
  return postJson<AuthResponse<any>>("/api/fees/collect", payload)
}

export function getStudent(id: string) {
  return getJson<AuthResponse<any>>(`/api/students/${id}`)
}

export function updateStudent(id: string, payload: any) {
  return apiFetch<AuthResponse<any>>(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteStudent(id: string) {
  return apiFetch<void>(`/api/students/${id}`, {
    method: "DELETE",
  })
}

export function getAdminExams() {
  return getJson<AuthResponse<any[]>>("/api/exams")
}

export function createExam(payload: {
  courseId: string
  title: string
  durationMin: number
  passMarks: number
  maxAttempts: number
  mcqs: any[]
}) {
  return postJson<AuthResponse<any>>("/api/exams", payload)
}

export function addExamMcq(examId: string, payload: {
  question: string
  options: string[]
  correctOptionIndex: number
  marks?: number
}) {
  return postJson<AuthResponse<any>>(`/api/exams/${examId}/mcqs`, payload)
}

export function deleteExamMcq(examId: string, mcqId: string) {
  return apiFetch<void>(`/api/exams/${examId}/mcqs/${mcqId}`, { method: "DELETE" })
}
