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
        <section className="relative overflow-hidden bg-white pt-24 pb-32">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0 bg-slate-50/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-brand-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-4000" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Left Column - Text & Hook */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="flex-1 space-y-8 max-w-2xl text-center lg:text-left"
              >
                <motion.div variants={fadeIn} className="inline-flex items-center rounded-full bg-white backdrop-blur-sm border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                  The Future of Education in Pakistan
                </motion.div>

                <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Empower Your <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">Teaching Journey</span>
                </motion.h1>

                <motion.p variants={fadeIn} className="text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Join Pakistan's premier Teacher Learning Management System. Elevate your classroom impact with world-class pedagogical training, modern tools, and exclusive certifications.
                </motion.p>

                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:-translate-y-0.5">
                      Start Learning Today <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#programs" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:text-brand-600 transition-all">
                      Explore Programs
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeIn} className="pt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start text-sm text-slate-500 font-medium">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Teacher" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shadow-sm">
                      10k+
                    </div>
                  </div>
                  <p>Trusted by over 10,000 teachers nationwide</p>
                </motion.div>
              </motion.div>

              {/* Right Column - Visual/Graphic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1 relative w-full max-w-lg lg:max-w-none hidden lg:block"
              >
                <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-transparent z-10" />
                  <img
                    src="/heoimg.png"
                    alt="Teacher engaging with students"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />

                  {/* Floating UI Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-8 left-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certification</p>
                      <p className="text-sm font-bold text-slate-900">STEM AI</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-12 right-8 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                      <BookText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Course</p>
                      <p className="text-sm font-bold text-slate-900">SCIENCE DIY</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-none shadow-md hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 text-brand-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>STEM AI</CardTitle>
                  <CardDescription>Integrate Science, Technology, Engineering, Math, and Artificial Intelligence.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2" /> AI tools for education</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2" /> Robotics integration</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2" /> Tech-driven lessons</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle>SCIENCE DIY</CardTitle>
                  <CardDescription>Hands-on science experiments and practical demonstrations for classrooms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2" /> Low-cost experiments</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2" /> Interactive learning</li>
                    <li className="flex items-center"><ChevronRight className="h-4 w-4 text-brand-500 mr-2" /> Scientific method</li>
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
