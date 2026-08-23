"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminProtection from "@/components/auth/AdminProtection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Check, Info, AlertCircle } from "lucide-react"

export function AdminTools() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info" | null,
    message: string
  }>({ type: null, message: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleSetAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: "info", message: "Đang xử lý..." })

    try {
      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          secretKey,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "Đã đặt người dùng thành admin thành công!",
        })
        // Reset form
        setUserId("")
        setSecretKey("")
      } else {
        setStatus({
          type: "error",
          message: data.error || "Có lỗi xảy ra khi đặt người dùng làm admin.",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground"
          onClick={() => router.push("/admin")}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại trang admin
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Công cụ quản trị</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Đặt quyền Admin</h2>

          <form onSubmit={handleSetAdmin} className="space-y-4">
            <div>
              <Label htmlFor="userId">ID người dùng</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Nhập User ID"
                required
              />
            </div>

            <div>
              <Label htmlFor="secretKey">Mã bí mật</Label>
              <Input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Nhập mã bí mật"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đặt làm Admin"}
            </Button>
          </form>

          {status.type && (
            <Alert className="mt-4" variant={status.type === "error" ? "destructive" : "default"}>
              {status.type === "success" && <Check className="h-4 w-4" />}
              {status.type === "error" && <AlertCircle className="h-4 w-4" />}
              {status.type === "info" && <Info className="h-4 w-4" />}
              <AlertTitle>
                {status.type === "success" && "Thành công"}
                {status.type === "error" && "Lỗi"}
                {status.type === "info" && "Thông báo"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              1. <strong>ID người dùng</strong>: Là UID của người dùng trong Firebase Authentication.
            </p>
            <p>
              2. <strong>Mã bí mật</strong>: Là mã xác thực bảo mật chỉ người quản trị biết.
            </p>
            <p>
              3. Khi đặt làm admin, người dùng sẽ có quyền truy cập vào trang admin và các tính năng quản trị.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProtectedAdminTools() {
  return (
    <AdminProtection>
      <AdminTools />
    </AdminProtection>
  )
} 