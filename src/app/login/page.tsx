"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      const savedTeachers = localStorage.getItem('adminTeachers')
      let teachers = []
      if (savedTeachers) {
        teachers = JSON.parse(savedTeachers)
      }

      const match = teachers.find((t: any) => t.username === username && t.password === password)
      
      if (match) {
        localStorage.setItem('currentTeacher', JSON.stringify(match))
        router.push("/teacher")
      } else if (username === "teacher_1234" && password === "password123") {
        // Fallback dummy user
        const dummy = { id: "T-0000", name: "Dummy Teacher", assignedCourses: [] }
        localStorage.setItem('currentTeacher', JSON.stringify(dummy))
        router.push("/teacher")
      } else {
        alert("Invalid username or password.")
      }
    }, 1000)
  }

  return (
    <Card className="border-none shadow-2xl shadow-slate-200/50">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
        <CardDescription className="text-center">
          Teacher Portal Access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Username</label>
            <Input
              type="text"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Link href="#" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* Left side - Decorative */}
      <div className="hidden md:flex flex-1 bg-brand-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-8">
              <Image src="/logo.png" alt="BFFP Logo" width={160} height={160} className="object-contain drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Welcome back to the Better Future for Pakistan TLMS.</h1>
            <p className="text-brand-100 text-lg">
              Empowering educators across the nation with premium resources, training, and certifications.
            </p>
          </motion.div>
        </div>

        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-32 -right-32 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md relative">
          <Link href="/" className="absolute -top-16 left-0 text-slate-500 hover:text-slate-900 flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Link>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
