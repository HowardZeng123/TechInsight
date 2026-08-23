"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Tạo hàm đếm ngược và điều hướng về trang chủ khi đếm ngược kết thúc
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    // Xóa timer khi component unmount
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-500 p-6">
          <AlertTriangle className="h-20 w-20 text-white mx-auto" />
        </div>
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không có quyền truy cập
          </h1>
          
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập vào trang này. Chỉ người dùng có quyền admin mới có thể xem trang này.
          </p>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-gray-100 rounded-full w-16 h-16">
              <span className="text-2xl font-bold text-gray-800">{countdown}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Sẽ tự động chuyển về trang chủ sau {countdown} giây
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Quay về trang chủ ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 