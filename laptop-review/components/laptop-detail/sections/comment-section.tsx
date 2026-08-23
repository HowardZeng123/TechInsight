"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp } from "lucide-react"
import { type Comment, getCommentsByLaptopId, addComment as addCommentToCollection } from "@/mock_data/comment-collection"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { LogIn } from "lucide-react"

// Định nghĩa kiểu dữ liệu cho laptop
interface Laptop {
  id: string
  name: string
}

interface CurrentUser {
  id: string
  username: string
}

interface CommentSectionProps {
  laptop?: Laptop
  laptopId?: string
  laptopName?: string
  currentUser: CurrentUser
}

export function CommentSection({ laptop, laptopId: propLaptopId, laptopName: propLaptopName, currentUser }: CommentSectionProps) {
  // Xác định laptopId từ prop laptop hoặc prop laptopId
  const laptopId = laptop?.id || propLaptopId || "default-laptop"

  // Xác định laptopName từ prop laptop hoặc prop laptopName
  const displayName = propLaptopName || laptop?.name || "Sản phẩm"

  // State để lưu trữ comments
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  // Kiểm tra xem người dùng đã đăng nhập chưa
  const isLoggedIn = currentUser.id !== "guest"

  // Lấy comments từ collection khi component mount hoặc laptopId thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem(`comments_${laptopId}`);
      if (local) {
        const parsed = JSON.parse(local).map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        }));
        setComments(parsed);
        return;
      }
    }
    const laptopComments = getCommentsByLaptopId(laptopId);
    setComments(laptopComments);
  }, [laptopId]);

  // Hàm thêm comment mới
  const handleAddComment = () => {
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true)
      return
    }

    if (!newComment.trim()) return

    const commentData = {
      laptopId: laptopId,
      userId: currentUser.id,
      username: currentUser.username,
      content: newComment,
    }

    // Thêm comment vào collection
    const newCommentObj = addCommentToCollection(commentData)

    // Cập nhật state
    const updatedComments = [newCommentObj, ...comments];
    setComments(updatedComments);
    setNewComment("");
    if (typeof window !== "undefined") {
      localStorage.setItem(`comments_${laptopId}`, JSON.stringify(updatedComments));
    }
  }

  // Hàm mở dialog đăng nhập
  const showLoginDialog = () => {
    setIsLoginDialogOpen(true)
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
    // Cập nhật state
    setComments(comments.map((comment) => (comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment)))

    // Trong thực tế, bạn sẽ gọi API để cập nhật likes trong cơ sở dữ liệu
  }

  // Hướng dẫn người dùng đến trang đăng nhập
  const goToLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700 p-6 mb-6">
      {/* Tiêu đề */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold dark:text-white">
          Bình luận về {displayName} ({comments.length})
        </h2>
      </div>

      {/* Ô nhập comment */}
      <div className="p-4">
        {isLoggedIn ? (
          <>
            <Textarea
              placeholder={`Viết bình luận về ${displayName}...`}
              className="bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-8 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <Button onClick={handleAddComment}>Đăng</Button>
            </div>
          </>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bạn cần đăng nhập để có thể bình luận về sản phẩm này
            </p>
            <Button onClick={showLoginDialog} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Đăng nhập để bình luận
            </Button>
          </div>
        )}
      </div>

      {/* Dialog yêu cầu đăng nhập */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng nhập để bình luận</DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập hoặc đăng ký tài khoản để có thể bình luận về sản phẩm này.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="default" onClick={goToLogin}>
              Đăng nhập ngay
            </Button>
            <Button variant="outline" onClick={() => setIsLoginDialogOpen(false)}>
              Để sau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Danh sách comment */}
      <div className="p-4 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
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
          ))
        ) : (
          <div className="text-center py-4 text-gray-800 dark:text-gray-200">
            Chưa có bình luận nào về sản phẩm này. Hãy là người đầu tiên bình luận!
          </div>
        )}
      </div>
    </div>
  )
}
