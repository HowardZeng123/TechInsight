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
import { ChevronLeft, Trash, Loader2, Search, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { forumService, ForumPost } from "@/lib/forumService"

export default function ManageForumPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const postsList = await forumService.getAllPosts("all")
        setPosts(postsList)
        setFilteredPosts(postsList)
        setLoading(false)
      } catch (err: any) {
        console.error(err)
        setError("Lỗi tải danh sách bài viết.")
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredPosts(posts)
      return
    }
    
    const filtered = posts.filter(item => 
      item.title?.toLowerCase().includes(query) || 
      item.authorName?.toLowerCase().includes(query)
    )
    setFilteredPosts(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá bài viết này? Hành động này sẽ xóa luôn cả các bình luận của bài viết.")) return
    try {
      await forumService.deletePost(id)
      setPosts(posts.filter(p => p.id !== id))
      setFilteredPosts(filteredPosts.filter(p => p.id !== id))
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
        <h1 className="text-2xl font-bold">Kiểm Duyệt Cộng Đồng</h1>
      </div>

      {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài đăng của người dùng</CardTitle>
          <CardDescription>Kiểm duyệt nội dung, xóa các bài spam hoặc vi phạm quy tắc</CardDescription>
          <div className="flex w-full max-w-sm items-center relative mt-4">
            <Input placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..." value={searchQuery} onChange={handleSearch} className="pr-10" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Chưa có bài viết nào trong cộng đồng.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Chủ đề</TableHead>
                  <TableHead>Người đăng</TableHead>
                  <TableHead>Tương tác</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-800">{item.category}</span>
                    </TableCell>
                    <TableCell>{item.authorName}</TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        {item.views} xem, {item.commentCount} bình luận
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/forum/${item.id}`)} title="Xem chi tiết">
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => item.id && handleDelete(item.id)} className="text-destructive" title="Xóa bài">
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
