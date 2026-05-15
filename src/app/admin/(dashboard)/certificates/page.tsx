"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Award, CheckCircle } from "lucide-react"

export default function CertificatesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificate Generation</h1>
          <p className="text-sm text-slate-500">Manage certificate templates and view issued certificates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Certificate Templates</CardTitle>
            <CardDescription>Customize the look and feel of certificates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 bg-brand-50 rounded-lg border-2 border-dashed border-brand-200 flex flex-col items-center justify-center text-brand-600">
              <Award className="h-8 w-8 mb-2" />
              <span className="font-medium">Standard BFFP Template</span>
            </div>
            <Button variant="outline" className="w-full">Edit Template Design</Button>
            <Button variant="outline" className="w-full">Update Authorized Signatures</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recently Issued</CardTitle>
            <CardDescription>Certificates automatically generated for passing teachers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Sarah Ahmed</div>
                      <div className="text-xs text-slate-500">Basic Child Psychology</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">View All Issued Records</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
