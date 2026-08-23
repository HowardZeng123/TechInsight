"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, Plus, Trash } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

interface PhoneFormProps {
  editMode?: boolean
  initialData?: any
  phoneId?: string
}

export default function PhoneForm({ editMode = false, initialData = null, phoneId = "" }: PhoneFormProps) {
  const router = useRouter()
  const [showValidation, setShowValidation] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  
  // App & DB Init
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // Main state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "/placeholder.svg?height=600&width=600",
    price: "",
    originalPrice: "",
    purchaseLink: "",
    description: "",

    specs: {
      soc: "",
      ram: "",
      storage: "",
      display: "",
      battery: "",
      operatingSystem: "",
      frontCamera: "",
      rearCamera: "",
      charging: "",
      weight: "",
    },

    benchmarks: {
      performanceScore: 5,
      cameraScore: 5,
      batteryScore: 5,
      displayScore: 5,
      designScore: 5,
      value: 5,
      overall: 5,
      antutu: "",
      geekbenchMulti: "",
    },
  })

  const [pros, setPros] = useState<string[]>([""])
  const [cons, setCons] = useState<string[]>([""])

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        id: initialData.id || "",
        name: initialData.name || "",
        image: initialData.image || "/placeholder.svg?height=600&width=600",
        price: initialData.price || "",
        originalPrice: initialData.originalPrice || "",
        purchaseLink: initialData.purchaseLink || "",
        description: initialData.description || "",

        specs: {
          soc: initialData.specs?.soc || "",
          ram: initialData.specs?.ram || "",
          storage: initialData.specs?.storage || "",
          display: initialData.specs?.display || "",
          battery: initialData.specs?.battery || "",
          operatingSystem: initialData.specs?.operatingSystem || "",
          frontCamera: initialData.specs?.frontCamera || "",
          rearCamera: initialData.specs?.rearCamera || "",
          charging: initialData.specs?.charging || "",
          weight: initialData.specs?.weight || "",
        },

        benchmarks: {
          performanceScore: initialData.benchmarks?.performanceScore || 5,
          cameraScore: initialData.benchmarks?.cameraScore || 5,
          batteryScore: initialData.benchmarks?.batteryScore || 5,
          displayScore: initialData.benchmarks?.displayScore || 5,
          designScore: initialData.benchmarks?.designScore || 5,
          value: initialData.benchmarks?.value || 5,
          overall: initialData.benchmarks?.overall || 5,
          antutu: initialData.benchmarks?.antutu || "",
          geekbenchMulti: initialData.benchmarks?.geekbenchMulti || "",
        },
      })

      if (initialData.pros && initialData.pros.length > 0) {
        setPros(initialData.pros)
      }
      if (initialData.cons && initialData.cons.length > 0) {
        setCons(initialData.cons)
      }
    }
  }, [editMode, initialData])

  const handleRootChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [name]: value }
    }))
  }

  const handleBenchmarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      benchmarks: { 
        ...prev.benchmarks, 
        [name]: type === 'number' ? Number(value) : value 
      }
    }))
  }

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
  }

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
  }

  const validateForm = () => {
    const errors: string[] = []
    if (!formData.name) errors.push("Tên điện thoại là bắt buộc")
    if (!formData.id) errors.push("ID (Slug) là bắt buộc")
    if (!formData.price) errors.push("Giá là bắt buộc")
    if (!formData.specs.soc) errors.push("Vi xử lý (SoC) là bắt buộc")
    if (!formData.specs.ram) errors.push("RAM là bắt buộc")
    if (!formData.specs.storage) errors.push("Bộ nhớ là bắt buộc")
    
    setFormErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowValidation(true)

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    try {
      const finalData = {
        ...formData,
        pros: pros.filter(p => p.trim() !== ""),
        cons: cons.filter(c => c.trim() !== "")
      }

      if (editMode && phoneId) {
        const docRef = doc(db, "smartphones", phoneId)
        const { id, ...dataToUpdate } = finalData
        await updateDoc(docRef, { ...dataToUpdate, updatedAt: serverTimestamp() })
        alert("Cập nhật thành công!")
        router.push("/admin/manage-phones")
      } else {
        await addDoc(collection(db, "smartphones"), { ...finalData, createdAt: serverTimestamp() })
        alert("Thêm mới thành công!")
        router.push("/admin/manage-phones")
      }
    } catch (error) {
      console.error("Lỗi lưu:", error)
      alert("Có lỗi xảy ra khi lưu!")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground"
          onClick={() => router.push(editMode ? "/admin/manage-phones" : "/admin")}
        >
          <ChevronLeft className="h-4 w-4" />
          {editMode ? "Quay lại danh sách" : "Quay lại trang chủ Admin"}
        </Button>
        <h1 className="text-2xl font-bold">
          {editMode ? "Chỉnh Sửa Điện Thoại" : "Thêm Điện Thoại Mới"}
        </h1>
        <Button onClick={handleSubmit}>
          {editMode ? "Cập Nhật" : "Lưu"}
        </Button>
      </div>

      {showValidation && formErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-5">
              {formErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* THÔNG TIN CƠ BẢN */}
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Cơ Bản</CardTitle>
            <CardDescription>Thông tin định danh và hình ảnh</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên điện thoại <span className="text-red-500">*</span></Label>
              <Input name="name" value={formData.name} onChange={handleRootChange} placeholder="Vd: iPhone 15 Pro Max" />
            </div>
            <div className="space-y-2">
              <Label>ID (Slug URL) <span className="text-red-500">*</span></Label>
              <Input name="id" value={formData.id} onChange={handleRootChange} placeholder="Vd: iphone-15-pro-max" disabled={editMode} />
            </div>
            <div className="space-y-2">
              <Label>Giá bán <span className="text-red-500">*</span></Label>
              <Input name="price" value={formData.price} onChange={handleRootChange} placeholder="Vd: 29.990.000đ" />
            </div>
            <div className="space-y-2">
              <Label>Giá gốc (nếu đang giảm)</Label>
              <Input name="originalPrice" value={formData.originalPrice} onChange={handleRootChange} placeholder="Vd: 34.990.000đ" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Link Ảnh URL</Label>
              <Input name="image" value={formData.image} onChange={handleRootChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả ngắn</Label>
              <Textarea name="description" value={formData.description} onChange={handleRootChange} rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* CẤU HÌNH */}
        <Card>
          <CardHeader>
            <CardTitle>Thông Số Kỹ Thuật</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Vi xử lý (SoC) <span className="text-red-500">*</span></Label>
              <Input name="soc" value={formData.specs.soc} onChange={handleSpecChange} placeholder="Vd: Snapdragon 8 Gen 3" />
            </div>
            <div className="space-y-2">
              <Label>RAM <span className="text-red-500">*</span></Label>
              <Input name="ram" value={formData.specs.ram} onChange={handleSpecChange} placeholder="Vd: 8GB" />
            </div>
            <div className="space-y-2">
              <Label>Bộ nhớ trong (ROM) <span className="text-red-500">*</span></Label>
              <Input name="storage" value={formData.specs.storage} onChange={handleSpecChange} placeholder="Vd: 256GB" />
            </div>
            <div className="space-y-2">
              <Label>Màn hình</Label>
              <Input name="display" value={formData.specs.display} onChange={handleSpecChange} placeholder="Vd: 6.7 inch, OLED, 120Hz" />
            </div>
            <div className="space-y-2">
              <Label>Pin</Label>
              <Input name="battery" value={formData.specs.battery} onChange={handleSpecChange} placeholder="Vd: 5000 mAh" />
            </div>
            <div className="space-y-2">
              <Label>Hệ điều hành</Label>
              <Input name="operatingSystem" value={formData.specs.operatingSystem} onChange={handleSpecChange} placeholder="Vd: iOS 17" />
            </div>
            <div className="space-y-2">
              <Label>Camera sau</Label>
              <Input name="rearCamera" value={formData.specs.rearCamera} onChange={handleSpecChange} placeholder="Vd: 48MP + 12MP + 12MP" />
            </div>
            <div className="space-y-2">
              <Label>Camera trước</Label>
              <Input name="frontCamera" value={formData.specs.frontCamera} onChange={handleSpecChange} placeholder="Vd: 12MP" />
            </div>
            <div className="space-y-2">
              <Label>Sạc nhanh</Label>
              <Input name="charging" value={formData.specs.charging} onChange={handleSpecChange} placeholder="Vd: Sạc nhanh 45W" />
            </div>
          </CardContent>
        </Card>

        {/* BENCHMARKS & ĐÁNH GIÁ */}
        <Card>
          <CardHeader>
            <CardTitle>Điểm Đánh Giá & Benchmarks</CardTitle>
            <CardDescription>Thang điểm 10 cho điểm đánh giá</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Hiệu năng</Label>
              <Input type="number" name="performanceScore" min="0" max="10" step="0.1" value={formData.benchmarks.performanceScore} onChange={handleBenchmarkChange} />
            </div>
            <div className="space-y-2">
              <Label>Camera</Label>
              <Input type="number" name="cameraScore" min="0" max="10" step="0.1" value={formData.benchmarks.cameraScore} onChange={handleBenchmarkChange} />
            </div>
            <div className="space-y-2">
              <Label>Pin</Label>
              <Input type="number" name="batteryScore" min="0" max="10" step="0.1" value={formData.benchmarks.batteryScore} onChange={handleBenchmarkChange} />
            </div>
            <div className="space-y-2">
              <Label>Màn hình</Label>
              <Input type="number" name="displayScore" min="0" max="10" step="0.1" value={formData.benchmarks.displayScore} onChange={handleBenchmarkChange} />
            </div>
            <div className="space-y-2">
              <Label>Tổng quan</Label>
              <Input type="number" name="overall" min="0" max="10" step="0.1" value={formData.benchmarks.overall} onChange={handleBenchmarkChange} />
            </div>
            <div className="space-y-2">
              <Label>AnTuTu</Label>
              <Input name="antutu" value={formData.benchmarks.antutu} onChange={handleBenchmarkChange} />
            </div>
            <div className="space-y-2">
              <Label>Geekbench (Multi)</Label>
              <Input name="geekbenchMulti" value={formData.benchmarks.geekbenchMulti} onChange={handleBenchmarkChange} />
            </div>
          </CardContent>
        </Card>

        {/* ƯU & NHƯỢC ĐIỂM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ưu điểm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pros.map((pro, index) => (
                <div key={`pro-${index}`} className="flex items-center gap-2">
                  <Input value={pro} onChange={e => handleProChange(index, e.target.value)} placeholder="Nhập ưu điểm" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setPros(pros.filter((_, i) => i !== index))}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setPros([...pros, ""])}>
                <Plus className="w-4 h-4 mr-2" /> Thêm ưu điểm
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nhược điểm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cons.map((con, index) => (
                <div key={`con-${index}`} className="flex items-center gap-2">
                  <Input value={con} onChange={e => handleConChange(index, e.target.value)} placeholder="Nhập nhược điểm" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setCons(cons.filter((_, i) => i !== index))}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setCons([...cons, ""])}>
                <Plus className="w-4 h-4 mr-2" /> Thêm nhược điểm
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            {editMode ? "Cập Nhật" : "Lưu Mới"}
          </Button>
        </div>
      </form>
    </div>
  )
}
