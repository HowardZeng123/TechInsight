"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import PhoneForm from "@/components/admin/PhoneForm"
import { Loader2 } from "lucide-react"

const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

export default function EditPhonePage() {
  const params = useParams()
  const router = useRouter()
  const [phoneData, setPhoneData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPhoneData() {
      try {
        const id = params?.id as string
        if (!id) return

        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)
        const docRef = doc(db, "smartphones", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPhoneData({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("Không tìm thấy điện thoại này.")
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin điện thoại:", err)
        setError("Lỗi khi tải dữ liệu.")
      } finally {
        setLoading(false)
      }
    }

    fetchPhoneData()
  }, [params])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !phoneData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background gap-4">
        <p className="text-xl text-red-500 font-bold">{error || "Lỗi không xác định."}</p>
        <button onClick={() => router.push("/admin/manage-phones")} className="text-blue-500 underline">
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PhoneForm editMode={true} initialData={phoneData} phoneId={params?.id as string} />
    </div>
  )
}
