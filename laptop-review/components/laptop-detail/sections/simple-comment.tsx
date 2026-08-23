"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp } from "lucide-react"

// Định nghĩa kiểu dữ liệu comment
interface Comment {
  id: string
  username: string
  content: string
  timestamp: Date
  likes: number
}

// Component Comment chính
export function SimpleComment() {
  // Dữ liệu mẫu
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      username: "Nguyễn Văn A",
      content: "Sản phẩm này rất tốt!",
      timestamp: new Date(Date.now() - 7200000), // 2 giờ trước
      likes: 0,
    },
    {
      id: "2",
      username: "Trần Thị B",
      content: "Giá cả hợp lý và chất lượng tuyệt vời.",
      timestamp: new Date(Date.now() - 3600000), // 1 giờ trước
      likes: 3,
    },
  ])

  const [newComment, setNewComment] = useState("")

  // Hàm thêm comment mới
  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      username: "Kanji", // Tên người dùng hiện tại
      content: newComment,
      timestamp: new Date(),
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  // Hàm định dạng thời gian
  const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Vừa xong"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  }

  // Hàm thích comment
  const handleLikeComment = (id: string) => {
    setComments(comments.map((comment) => (comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment)))
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Tiêu đề */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">Bình luận ({comments.length})</h2>
      </div>

      {/* Ô nhập comment */}
      <div className="p-4">
        <Textarea
          placeholder="Viết bình luận..."
          className="w-full resize-none border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={handleAddComment}>Đăng</Button>
        </div>
      </div>

      {/* Danh sách comment */}
      <div className="p-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-3 last:border-0 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="font-semibold dark:text-white">{comment.username}</div>
              <p className="mt-1 dark:text-gray-200">{comment.content}</p>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatTimestamp(comment.timestamp)}</span>
              <button className="font-medium hover:underline" onClick={() => handleLikeComment(comment.id)}>
                Thích
              </button>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
