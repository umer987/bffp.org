"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Award, CheckCircle, Download, Calendar, FileSearch } from "lucide-react"
import { getJson, apiFetchBlob } from "@/lib/api"

type CertificateRecord = {
  id: string
  certificateNo: string
  issuedAt: string
  teacher: {
    fullName: string
  }
  course: {
    title: string
  }
}

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCertificates() {
      try {
        const result = await getJson<{ success: boolean; data: CertificateRecord[] }>("/api/admin/certificates")
        setCertificates(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load certificates")
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  useEffect(() => {
    if (certificates.length === 0) return

    let active = true
    const objectUrls: string[] = []

    async function loadImages() {
      const urls: Record<string, string> = {}
      await Promise.all(
        certificates.map(async (cert) => {
          try {
            const blob = await apiFetchBlob(`/api/certificate/image/${cert.id}`)
            const url = URL.createObjectURL(blob)
            urls[cert.id] = url
            objectUrls.push(url)
          } catch (error) {
            console.error("Certificate image fetch failed", cert.id, error)
          }
        }),
      )

      if (active) {
        setImageUrls(urls)
      }
    }

    loadImages()

    return () => {
      active = false
      objectUrls.forEach(URL.revokeObjectURL)
    }
  }, [certificates])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificate Generation</h1>
          <p className="text-sm text-slate-500">Manage certificate templates and view issued certificates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Certificate Template</CardTitle>
            <CardDescription>Based on public/certificate_final.png with placeholder fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src="/certificate_final.png"
                alt="Certificate template"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Fields rendered</p>
              <p>Teacher Name</p>
              <p>Program / Curriculum Title</p>
              <p>Completion Date & Time</p>
              <p>Certificate ID</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Recently Issued Certificates</CardTitle>
              <CardDescription>Certificates automatically generated for passed exams.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">Loading certificates…</div>
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
              ) : certificates.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">No certificates have been generated yet.</div>
              ) : (
                <div className="grid gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                      <img
                        src={imageUrls[cert.id] ?? `/api/certificate/image/${cert.id}`}
                        alt={`Certificate ${cert.certificateNo}`}
                        className="h-56 w-full object-cover"
                      />
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-500">{cert.teacher.fullName}</p>
                            <h3 className="text-lg font-semibold text-slate-900">{cert.course.title}</h3>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <p className="text-sm text-slate-500">Certificate ID</p>
                          <p className="text-sm font-medium text-slate-900">{cert.certificateNo}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <a
                            href={imageUrls[cert.id] ?? `/api/certificate/image/${cert.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <FileSearch className="mr-2 h-4 w-4" /> Preview
                          </a>
                          <a
                            href={imageUrls[cert.id] ?? `/api/certificate/image/${cert.id}`}
                            download={`certificate-${cert.certificateNo}.png`}
                            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                          >
                            <Download className="mr-2 h-4 w-4" /> Download PNG
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
