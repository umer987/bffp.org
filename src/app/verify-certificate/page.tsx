"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { getJson } from "@/lib/api"
import { ArrowLeft, CheckCircle, Search, XCircle } from "lucide-react"

type CertificateDetails = {
  certificateNo: string
  teacherName: string
  courseTitle: string
  issuedAt: string
  examStatus: string
  qrPayload: string
}

export default function VerifyCertificatePage() {
  const [stemId, setStemId] = useState("")
  const [certificate, setCertificate] = useState<CertificateDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedId = stemId.trim()
    if (!trimmedId) {
      setError("Please enter a STEM ID to verify.")
      setCertificate(null)
      return
    }

    setLoading(true)
    setError(null)
    setCertificate(null)

    try {
      const response = await getJson<{ success: boolean; data: CertificateDetails }>(
        `/api/certificate/verify?stemId=${encodeURIComponent(trimmedId)}`
      )
      setCertificate(response.data)
    } catch (err: any) {
      setError(err?.message || "Unable to verify certificate.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-brand-600 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>

          <Card className="border-none shadow-2xl shadow-slate-200/50">
            <CardHeader className="space-y-4 p-8">
              <div>
                <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Certificate Verification
                </div>
                <CardTitle className="mt-4 text-3xl">Verify a STEM certificate</CardTitle>
                <CardDescription className="max-w-2xl text-slate-600">
                  Enter the STEM ID from your certificate to confirm its validity and view certificate details.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              <form onSubmit={handleVerify} className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">STEM ID</label>
                  <Input
                    placeholder="Enter STEM ID (e.g. BFFP-1681234567890-ABCD)"
                    value={stemId}
                    onChange={(event) => setStemId(event.target.value)}
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    {error}
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying…" : "Verify STEM ID"}
                </Button>
              </form>

              {certificate ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-900 mb-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Verified</p>
                      <p className="text-2xl font-semibold">STEM certificate is valid</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">STEM ID</p>
                      <p className="font-medium text-slate-900 break-all">{certificate.certificateNo}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Course</p>
                      <p className="font-medium text-slate-900">{certificate.courseTitle}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Teacher</p>
                      <p className="font-medium text-slate-900">{certificate.teacherName}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Issued At</p>
                      <p className="font-medium text-slate-900">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-brand-950/5 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Exam Status</p>
                    <p>{certificate.examStatus}</p>
                  </div>

                  <div className="mt-4 text-sm text-slate-500">
                    This certificate is issued by Better Future for Pakistan and verified using the STEM ID printed on the certificate.
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
