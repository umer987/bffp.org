"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Award, Download, ExternalLink, Calendar, FileSearch } from "lucide-react"
import { getJson, apiFetchBlob } from "@/lib/api"

type TeacherCertificate = {
  id: string
  certificateNo: string
  issuedAt: string
  course: {
    title: string
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<TeacherCertificate[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCertificates() {
      try {
        const result = await getJson<{ success: boolean; data: TeacherCertificate[] }>("/api/teacher/certificate")
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
          <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500">View, download, and verify your earned certifications.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Loading certificates…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
      ) : certificates.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50 p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-700">No certificates yet</h2>
              <p className="text-sm text-slate-500">Pass an exam to generate your certificate automatically.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <img
                src={imageUrls[cert.id] ?? "/certificate_final.png"}
                alt={`Certificate ${cert.certificateNo}`}
                className="h-56 w-full object-cover"
              />
              <CardContent className="p-5">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Issued</span>
                    <span className="font-medium text-slate-900">{new Date(cert.issuedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-500">Certificate ID</p>
                    <p className="font-medium text-slate-900">{cert.certificateNo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
