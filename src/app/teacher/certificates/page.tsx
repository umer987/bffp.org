"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Award, Download, ExternalLink, Calendar } from "lucide-react"

export default function CertificatesPage() {
  const certificates = [
    {
      id: "CERT-09283",
      course: "Basic Child Psychology",
      issueDate: "September 5, 2024",
      score: "92%",
      validity: "Lifetime",
      imageClass: "bg-gradient-to-br from-brand-600 to-brand-800"
    },
    {
      id: "CERT-08112",
      course: "Introduction to Special Education",
      issueDate: "August 12, 2024",
      score: "88%",
      validity: "Lifetime",
      imageClass: "bg-gradient-to-br from-blue-600 to-blue-800"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500">View, download, and verify your earned certifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Visual Certificate Preview */}
            <div className={`h-48 ${cert.imageClass} p-6 flex flex-col justify-between text-white relative`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10 flex justify-between items-start">
                <Award className="h-8 w-8 text-brand-100" />
                <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                  {cert.id}
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-brand-100 uppercase tracking-wider mb-1">Certificate of Completion</p>
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">{cert.course}</h3>
              </div>
            </div>
            
            <CardContent className="p-5">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Issued</span>
                  <span className="font-medium text-slate-900">{cert.issueDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Score</span>
                  <span className="font-medium text-slate-900">{cert.score}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full text-brand-700 border-brand-200 hover:bg-brand-50">
                  <ExternalLink className="h-4 w-4 mr-2" /> Verify
                </Button>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" /> PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State / Keep Learning Card */}
        <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50 flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
          <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
            <Award className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Earn More Certificates</h3>
          <p className="text-sm text-slate-500 mb-6">Complete more courses and pass exams to expand your portfolio.</p>
          <Button variant="outline" className="bg-white">Browse Courses</Button>
        </Card>
      </div>
    </div>
  )
}
