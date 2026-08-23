"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { newsService } from "@/services/firebaseServices"

export default function NewsForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toLocaleDateString('vi-VN'),
    readTime: "5 phút đọc"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.image || !formData.excerpt) {
      setError("Vui lòng điền đầy đủ tiêu đề, hình ảnh và tóm tắt.")
      return
    }

    try {
      setLoading(true)
      setError("")
      await newsService.add(formData)
      alert("Đã thêm tin tức thành công!")
      router.push("/admin")
    } catch (err: any) {
      console.error(err)
      setError("Lỗi khi thêm tin tức: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-6 mx-auto">
      <div className="flex items-center mb-6 space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Thêm Tin Tức Mới</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
            <CardDescription>Nhập thông tin cơ bản cho bản tin (News).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Ví dụ: Apple trình làng MacBook Pro M3..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Đường dẫn hình ảnh (URL)</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Tóm tắt ngắn</Label>
              <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Công nghệ tản nhiệt mới giúp máy duy trì..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung bài viết (Markdown/HTML)</Label>
              <Textarea id="content" name="content" className="min-h-[200px]" value={formData.content} onChange={handleChange} placeholder="Nội dung chi tiết..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Tác giả</Label>
                <Input id="author" name="author" value={formData.author} onChange={handleChange} placeholder="Tên tác giả" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Ngày đăng</Label>
                <Input id="date" name="date" value={formData.date} onChange={handleChange} placeholder="DD/MM/YYYY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Thời gian đọc</Label>
                <Input id="readTime" name="readTime" value={formData.readTime} onChange={handleChange} placeholder="Ví dụ: 6 phút đọc" />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? "Đang xử lý..." : "Lưu Tin Tức"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
