"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Wallet, TrendingUp, AlertCircle, Clock, FileText, Download, Printer, X, CheckCircle, User, Calendar } from "lucide-react"
import { getClasses, getStudents, getFees, collectFee } from "@/lib/auth"

type FeeRow = {
  id: string
  studentId: string
  studentName: string
  rollNo: string
  className: string
  amount: number
  month: number
  year: number
  status: "PAID" | "PENDING" | "OVERDUE"
  date: string
}

const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear()
const currentMonthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date())

export default function FeesPage() {
  const [fees, setFees] = useState<FeeRow[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [receiptModal, setReceiptModal] = useState<any>(null)
  const [collectModal, setCollectModal] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [classStudents, setClassStudents] = useState<any[]>([])
  const [loadingFees, setLoadingFees] = useState(true)
  
  // Collection Modal State
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMonth, setPaymentMonth] = useState("May 2026")
  const [savingFee, setSavingFee] = useState(false)
  const [feeError, setFeeError] = useState<string | null>(null)

  const currentMonthFees = fees.filter((f) => f.month === currentMonth && f.year === currentYear)
  const totalCollected = currentMonthFees.filter((f) => f.status === "PAID").reduce((acc, f) => acc + f.amount, 0)
  const totalPendingCount = currentMonthFees.filter((f) => f.status === "PENDING").length
  const totalOverdueCount = currentMonthFees.filter((f) => f.status === "OVERDUE").length
  const totalExpected = currentMonthFees.reduce((acc, f) => acc + f.amount, 0)

  const filteredFees = fees.filter(f => {
    const matchesSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) || f.rollNo.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || f.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const availableStudents = classStudents

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await getClasses()
        setClasses(response.data || [])
      } catch (err) {
        console.error("Failed to load classes", err)
      }
    }

    loadClasses()
  }, [])

  useEffect(() => {
    const loadFees = async () => {
      setLoadingFees(true)
      try {
        const response = await getFees()
        const items = response.data || []
        setFees(items.map((fee: any) => ({
          id: fee.id,
          studentId: fee.studentId,
          studentName: fee.student?.fullName || "Unknown",
          rollNo: fee.student?.rollNumber || "-",
          className: fee.student?.class?.name || "-",
          amount: Number(fee.amount),
          month: fee.month,
          year: fee.year,
          status: fee.status,
          date: fee.paidAt ? new Date(fee.paidAt).toISOString().split("T")[0] : "-",
        })))
      } catch (err) {
        console.error("Failed to load fees", err)
      } finally {
        setLoadingFees(false)
      }
    }

    loadFees()
  }, [])

  useEffect(() => {
    if (!selectedClass) {
      setClassStudents([])
      setSelectedStudent(null)
      return
    }

    const loadClassStudents = async () => {
      try {
        const response = await getStudents(selectedClass, "", 1, 100)
        const items = response.data || []
        setClassStudents(items.map((student: any) => ({
          id: student.id,
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          className: student.class?.name || "",
        })))
      } catch (err) {
        console.error("Failed to load class students", err)
        setClassStudents([])
      }
    }

    loadClassStudents()
  }, [selectedClass])

  const selectedClassName = classes.find((cls) => cls.id === selectedClass)?.name || ""

  const parseMonthYear = (monthString: string) => {
    const [monthName, yearText] = monthString.split(" ")
    const monthIndex = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ].findIndex((name) => name.toLowerCase().startsWith(monthName.toLowerCase()))
    return {
      month: monthIndex >= 0 ? monthIndex + 1 : 1,
      year: parseInt(yearText, 10) || new Date().getFullYear(),
    }
  }

  const handleCollectFee = async () => {
    if (!selectedStudent || !paymentAmount) return
    setFeeError(null)
    setSavingFee(true)

    const { month, year } = parseMonthYear(paymentMonth)

    try {
      const response = await collectFee({
        studentId: selectedStudent.id,
        month,
        year,
        amount: parseFloat(paymentAmount),
        paymentMethod: "CASH",
      })

      const fee = response.data?.fee
      if (!fee) {
        throw new Error("Invalid fee response")
      }

      const newPayment = {
        id: fees.length + 1,
        student: selectedStudent.fullName,
        rollNo: selectedStudent.rollNumber,
        class: selectedClassName || selectedStudent.className || selectedStudent.class || "",
        amount: parseFloat(paymentAmount),
        month: paymentMonth,
        status: "Paid",
        date: new Date().toISOString().split('T')[0],
      }

      const existingIndex = fees.findIndex(f => f.studentName === selectedStudent.fullName && `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(currentYear, f.month - 1))} ${f.year}` === paymentMonth)
      if (existingIndex !== -1) {
        const updatedFees = [...fees]
        updatedFees[existingIndex] = newPayment
        setFees(updatedFees)
      } else {
        setFees([newPayment, ...fees])
      }

      setCollectModal(false)
      setReceiptModal(newPayment)
      setSelectedClass("")
      setSelectedStudent(null)
      setPaymentAmount("")
    } catch (err: any) {
      console.error(err)
      setFeeError(err?.message || "Failed to save fee collection.")
    } finally {
      setSavingFee(false)
    }
  }

  const openCollectModalForStudent = (fee: any) => {
    const matchedClass = classes.find((cls) => cls.name === fee.className)
    if (matchedClass) {
      setSelectedClass(matchedClass.id)
    } else {
      setSelectedClass("")
    }

    const student = classStudents.find((s) => s.rollNumber === fee.rollNo)
    setSelectedStudent(student || { fullName: fee.studentName, rollNumber: fee.rollNo, className: fee.className })
    setPaymentAmount(fee.amount.toString())
    setPaymentMonth(`${new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(currentYear, fee.month - 1))} ${fee.year}`)
    setCollectModal(true)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-sm text-slate-500">Track collections, pending payments, and generate receipts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
          <Button onClick={() => setCollectModal(true)} className="bg-brand-600 hover:bg-brand-700 text-white">
            <Wallet className="h-4 w-4 mr-2" /> Collect Fee
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title={`Total Collected (${currentMonthName})`} value={`Rs. ${(totalCollected / 1000).toFixed(1)}k`} icon={TrendingUp} color="emerald" />
        <MetricCard title="Pending Payments" value={totalPendingCount} icon={Clock} color="amber" />
        <MetricCard title="Overdue Payments" value={totalOverdueCount} icon={AlertCircle} color="red" />
        <MetricCard title="Monthly Expected" value={`Rs. ${(totalExpected / 1000).toFixed(1)}k`} icon={Wallet} color="brand" />
      </div>

      {/* Filters & Table */}
      <Card className="border-none shadow-sm">
        <div className="border-b border-slate-100 bg-white p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search student or roll number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-48"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Roll No</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Month</th>
                <th className="px-6 py-4 font-medium">Payment Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{fee.rollNo}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{fee.studentName}</div>
                    <div className="text-xs text-slate-500">{fee.className}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">Rs. {fee.amount}</td>
                  <td className="px-6 py-4">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(currentYear, fee.month - 1))} {fee.year}</td>
                  <td className="px-6 py-4">{fee.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      fee.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                      fee.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fee.status === 'PAID' ? (
                      <Button onClick={() => setReceiptModal(fee)} variant="ghost" size="sm" className="text-brand-600 hover:bg-brand-50">
                        <FileText className="h-4 w-4 mr-2" /> Receipt
                      </Button>
                    ) : (
                      <Button onClick={() => openCollectModalForStudent(fee)} variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
                        Collect
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Collect Fee Modal */}
      {collectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-2xl overflow-hidden border-none">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-brand-400" />
                <h2 className="text-lg font-bold">Collect Student Fee</h2>
              </div>
              <button onClick={() => setCollectModal(false)} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardContent className="p-6 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" /> Select Class
                  </label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value)
                      setSelectedStudent(null)
                      setPaymentAmount("")
                    }}
                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">Choose Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" /> Select Student
                  </label>
                  <select 
                    disabled={!selectedClass}
                    value={selectedStudent?.id || ""}
                    onChange={(e) => {
                      const student = availableStudents.find((s) => s.id === e.target.value)
                      setSelectedStudent(student)
                      if (student) setPaymentAmount("")
                    }}
                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 outline-none disabled:opacity-50"
                  >
                    <option value="">Choose Student</option>
                    {availableStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Fee Month</label>
                  <Input value={paymentMonth} readOnly className="bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Amount (Rs.)</label>
                  <Input 
                    type="number" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {selectedStudent && (
                <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                      {selectedStudent.fullName?.[0] || "S"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedStudent.fullName}</p>
                      <p className="text-xs text-slate-500">Roll: {selectedStudent.rollNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold">Total Due</p>
                    <p className="text-lg font-black text-brand-600">Rs. {paymentAmount}</p>
                  </div>
                </div>
              )}

              {feeError && (
                <div className="rounded-md bg-red-50 border border-red-200 text-sm text-red-700 p-3">
                  {feeError}
                </div>
              )}
              <Button 
                onClick={handleCollectFee}
                disabled={!selectedStudent || !paymentAmount || savingFee}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-12 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingFee ? "Saving..." : "Confirm Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden">
            <div className="bg-brand-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-lg font-bold">Fee Receipt</h2>
              <button onClick={() => setReceiptModal(null)} className="p-1 hover:bg-brand-700 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 bg-slate-50/50">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Rs. {receiptModal.amount}</h3>
                <p className="text-emerald-600 font-medium flex items-center justify-center">
                  Payment Successful
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-sm shadow-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name</span>
                  <span className="font-medium text-slate-900">{receiptModal.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll Number</span>
                  <span className="font-medium text-slate-900">{receiptModal.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class</span>
                  <span className="font-medium text-slate-900">{receiptModal.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Month</span>
                  <span className="font-medium text-slate-900">{receiptModal.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date</span>
                  <span className="font-medium text-slate-900">{receiptModal.date}</span>
                </div>
              </div>

              <Button onClick={() => window.print()} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                <Printer className="h-4 w-4 mr-2" /> Print Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color = "brand" }: any) {
  const colorStyles: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorStyles[color] || colorStyles.brand}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

