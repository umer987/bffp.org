import React from 'react'
import { Card, CardContent } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"

interface SubjectResult {
  name: string
  totalMarks: number
  obtainedMarks: number
}

interface ReportCardProps {
  studentName: string
  rollNo: string
  className: string
  examType: string
  subjects: SubjectResult[]
}

export const ReportCard: React.FC<ReportCardProps> = ({
  studentName,
  rollNo,
  className,
  examType,
  subjects
}) => {
  const totalMarks = subjects.reduce((acc, sub) => acc + sub.totalMarks, 0)
  const totalObtained = subjects.reduce((acc, sub) => acc + sub.obtainedMarks, 0)
  const percentage = ((totalObtained / totalMarks) * 100).toFixed(1)

  const getGrade = (pct: number) => {
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B'
    if (pct >= 60) return 'C'
    if (pct >= 50) return 'D'
    return 'F'
  }

  const grade = getGrade(parseFloat(percentage))

  return (
    <div className="bg-white p-8 border-8 border-double border-slate-200 w-[210mm] min-h-[297mm] mx-auto shadow-xl print:shadow-none print:border-slate-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest">BFFP Public School</h1>
        <p className="text-slate-500 font-medium italic mt-1">Striving for Excellence in Education</p>
        <div className="mt-4 inline-block px-4 py-1 bg-slate-900 text-white font-bold rounded-sm">
          {examType} - SESSION 2025-26
        </div>
      </div>

      <Separator className="bg-slate-200 mb-8" />

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-6 mb-10 bg-slate-50 p-6 rounded-lg border border-slate-100">
        <div className="space-y-2">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-tighter">Student Name</p>
          <p className="text-xl font-bold text-slate-900">{studentName}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-tighter">Roll Number</p>
          <p className="text-xl font-bold text-slate-900">{rollNo}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-tighter">Class / Grade</p>
          <p className="text-xl font-bold text-slate-900">{className}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-tighter">Issue Date</p>
          <p className="text-xl font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Results Table */}
      <table className="w-full border-collapse mb-10">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="border border-slate-800 p-3 text-left">Subject</th>
            <th className="border border-slate-800 p-3 text-center">Total Marks</th>
            <th className="border border-slate-800 p-3 text-center">Obtained Marks</th>
            <th className="border border-slate-800 p-3 text-center">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="border border-slate-200 p-3 font-bold text-slate-800">{sub.name}</td>
              <td className="border border-slate-200 p-3 text-center font-medium">{sub.totalMarks}</td>
              <td className="border border-slate-200 p-3 text-center font-bold text-brand-700">{sub.obtainedMarks}</td>
              <td className="border border-slate-200 p-3 text-center font-medium">
                {((sub.obtainedMarks / sub.totalMarks) * 100).toFixed(0)}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-black">
            <td className="border border-slate-300 p-4 text-right">GRAND TOTAL</td>
            <td className="border border-slate-300 p-4 text-center">{totalMarks}</td>
            <td className="border border-slate-300 p-4 text-center text-brand-700">{totalObtained}</td>
            <td className="border border-slate-300 p-4 text-center">{percentage}%</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer Summary */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="p-4 bg-emerald-50 rounded-lg text-center border border-emerald-100">
          <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Grade</p>
          <p className="text-4xl font-black text-emerald-700">{grade}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
          <p className="text-xs text-blue-600 font-bold uppercase mb-1">Status</p>
          <p className="text-2xl font-black text-blue-700">{parseFloat(percentage) >= 50 ? 'PROMOTED' : 'DETAINED'}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Attendance</p>
          <p className="text-2xl font-black text-slate-700">92%</p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-20 flex justify-between items-end px-4">
        <div className="text-center w-48">
          <div className="border-b border-slate-400 mb-2"></div>
          <p className="text-sm font-bold text-slate-700">Class Teacher</p>
        </div>
        <div className="text-center w-48">
          <div className="border-b border-slate-400 mb-2 h-10 flex items-center justify-center">
            <span className="font-serif italic text-slate-400">Stamp</span>
          </div>
          <p className="text-sm font-bold text-slate-700">Principal</p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-center text-[10px] text-slate-400 uppercase tracking-widest">
        This is a computer generated result card. Any alteration will void the result.
      </div>
    </div>
  )
}
