"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { BookOpen, Users, Award, ChevronRight, BookText } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-brand-50 pt-20 pb-32">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="max-w-3xl mx-auto space-y-8"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2"></span>
                Better Future for Pakistan
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Empowering Teachers for a <span className="text-brand-600">Better Future</span> for Pakistan
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-xl text-slate-600 max-w-2xl mx-auto">
                Join our premium Teacher Learning Management System. We provide world-class training, courses, and certifications to elevate educational quality.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto text-base">
                    Start Learning Today <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#programs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-white">
                    Explore Programs
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="py-4 md:py-0">
                <div className="text-4xl font-bold text-brand-600 mb-2">10,000+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Teachers Trained</div>
              </div>
              <div className="py-4 md:py-0">
                <div className="text-4xl font-bold text-brand-600 mb-2">50+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Courses Available</div>
              </div>
              <div className="py-4 md:py-0">
                <div className="text-4xl font-bold text-brand-600 mb-2">25,000+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Certificates Issued</div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs / Features */}
        <section id="programs" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Learning Programs</h2>
              <p className="text-slate-600">Discover our comprehensive curriculum designed to enhance teaching methodologies and classroom management skills.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 text-brand-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>Modern Pedagogy</CardTitle>
                  <CardDescription>Master the latest teaching techniques and active learning strategies.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Interactive classrooms</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Student engagement</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Assessment methods</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Classroom Management</CardTitle>
                  <CardDescription>Learn how to foster a positive, inclusive, and disciplined environment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Behavior tracking</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Conflict resolution</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Inclusive practices</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle>Digital Literacy</CardTitle>
                  <CardDescription>Integrate technology into your teaching to prepare students for the future.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> EdTech tools</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Online assessments</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2"/> Digital resources</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial / Impact */}
        <section id="impact" className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">What Our Teachers Say</h2>
            <div className="max-w-4xl mx-auto bg-brand-50 rounded-3xl p-8 md:p-12 relative">
              <div className="absolute top-0 left-12 -translate-y-1/2 text-brand-200">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="text-xl md:text-2xl font-medium text-slate-700 italic relative z-10 leading-relaxed">
                "The resources and certification programs provided by BFFP have completely transformed my teaching methodology. I feel more equipped to handle modern classroom challenges and inspire my students every day."
              </p>
              <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-brand-200 rounded-full flex items-center justify-center font-bold text-brand-700">SA</div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Sarah Ahmed</div>
                  <div className="text-sm text-slate-500">Senior Science Teacher, Lahore</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
