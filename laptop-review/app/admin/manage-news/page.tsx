"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { ChevronLeft, Pencil, Trash, Loader2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { newsService } from "@/services/firebaseServices"
import { deleteDoc, doc, getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

export default function ManageNewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<any[]>([])
  const [filteredNews, setFilteredNews] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        const newsList = await newsService.getAll()
        setNews(newsList)
        setFilteredNews(newsList)
        setLoading(false)
      } catch (err: any) {
        console.error(err)
        setError("Lỗi tải tin tức.")
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredNews(news)
      return
    }
    
    const filtered = news.filter(item => 
      item.title?.toLowerCase().includes(query)
    )
    setFilteredNews(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá tin này?")) return
    try {
      await deleteDoc(doc(db, "news", id))
      setNews(news.filter(n => n.id !== id))
      setFilteredNews(filteredNews.filter(n => n.id !== id))
    } catch (err: any) {
      console.error(err)
      alert("Xoá thất bại: " + err.message)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin")}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Quản Lý Tin Tức</h1>
        <Button onClick={() => router.push("/admin/news-form")}>Thêm Tin Tức Mới</Button>
      </div>

      {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Tin Tức</CardTitle>
          <CardDescription>Quản lý các tin tức hiển thị ở trang chủ</CardDescription>
          <div className="flex w-full max-w-sm items-center relative mt-4">
            <Input placeholder="Tìm kiếm theo tiêu đề..." value={searchQuery} onChange={handleSearch} className="pr-10" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Không có tin tức nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
