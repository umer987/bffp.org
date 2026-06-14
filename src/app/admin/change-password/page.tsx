"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { changeAdminPassword } from "@/lib/auth"
import { ArrowLeft, Key } from "lucide-react"

export default function AdminChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setLoading(true)
    try {
      await changeAdminPassword(currentPassword, newPassword)
      setSuccess("Password changed successfully. Please log in again.")
      setTimeout(() => router.push("/admin/login"), 1500)
    } catch (err: any) {
      setError(err?.message || "Unable to change password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-600">
            <ArrowLeft className="h-4 w-4" />
            <Link href="/admin/login" className="hover:text-brand-600">
              Back to Admin Login
            </Link>
          </div>

          <Card className="border-none shadow-2xl shadow-slate-200/50">
            <CardHeader className="space-y-3 p-8">
              <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </div>
              <CardTitle className="text-3xl">Admin Password</CardTitle>
              <CardDescription className="text-slate-600">
                Provide your current password and a new password to update your admin credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <Input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">New Password</label>
                  <Input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating password…" : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
