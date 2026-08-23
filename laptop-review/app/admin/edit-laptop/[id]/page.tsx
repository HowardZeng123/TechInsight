"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { ChevronLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LaptopForm from "@/components/admin/LaptopForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

export default function EditLaptopPage(props: { params: { id: string } }) {
  const router = useRouter()
  const laptopId = props.params.id
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [laptopData, setLaptopData] = useState<any>(null)
  const [laptopName, setLaptopName] = useState<string>("")

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  useEffect(() => {
    async function fetchLaptop() {
      try {
        setLoading(true)
        const laptopDoc = doc(db, "laptops", laptopId)
        const laptopSnapshot = await getDoc(laptopDoc)
        
        if (laptopSnapshot.exists()) {
          const data = laptopSnapshot.data()
          setLaptopData(data)
          setLaptopName(data.name || "")
        } else {
          setError("Không tìm thấy laptop với ID này.")
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Lỗi khi tải thông tin laptop:", error)
        setError("Không thể tải thông tin laptop. Vui lòng thử lại sau.")
        setLoading(false)
      }
    }

    if (laptopId) {
      fetchLaptop()
    }
  }, [db, laptopId])

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground"
          onClick={() => router.push("/admin/manage-laptops")}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách laptop
        </Button>
        
        <h1 className="text-2xl font-bold">
          {loading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <>Chỉnh sửa: {laptopName || "Laptop không xác định"}</>
          )}
        </h1>
        
        <Button
          variant="outline"
          onClick={() => router.push(`/laptops/${laptopId}`)}
          className="text-muted-foreground"
        >
          Xem trang sản phẩm
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : laptopData ? (
        <div className="min-h-screen bg-background">
          <LaptopForm editMode={true} initialData={laptopData} laptopId={laptopId} />
        </div>
      ) : null}
    </div>
  )
} 