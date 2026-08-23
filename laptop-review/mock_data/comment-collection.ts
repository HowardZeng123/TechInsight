// Collection lưu trữ dữ liệu comment

export interface Comment {
  id: string
  laptopId: string
  userId: string
  username: string
  content: string
  timestamp: Date
  likes: number
}

// Dữ liệu mẫu cho collection
export const commentCollection: Comment[] = [
  {
    id: "1",
    laptopId: "macbook-pro-14-m3-pro",
    userId: "user1",
    username: "Nguyễn Văn A",
    content: "Sản phẩm này rất tốt, tôi đã sử dụng được 2 năm và vẫn hoạt động tốt!",
    timestamp: new Date(Date.now() - 7200000), // 2 giờ trước
    likes: 0,
  },
  {
    id: "2",
    laptopId: "macbook-pro-14-m3-pro",
    userId: "user2",
    username: "Trần Thị B",
    content: "Giá cả hợp lý và chất lượng tuyệt vời.",
    timestamp: new Date(Date.now() - 3600000), // 1 giờ trước
    likes: 3,
  },
  {
    id: "3",
    laptopId: "macbook-pro-14-m3-pro",
    userId: "user3",
    username: "Lê Văn C",
    content: "Pin trâu, hiệu năng tốt.",
    timestamp: new Date(Date.now() - 1800000), // 30 phút trước
    likes: 1,
  },
]

// Hàm để lấy tất cả comment của một laptop cụ thể
export function getCommentsByLaptopId(laptopId: string): Comment[] {
  return [...commentCollection]
    .filter((comment) => comment.laptopId === laptopId)
    .map(comment => ({
      ...comment,
      timestamp: new Date(comment.timestamp),
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Hàm để thêm comment mới
export function addComment(comment: Omit<Comment, "id" | "timestamp" | "likes">): Comment {
  const newComment: Comment = {
    id: Date.now().toString(),
    timestamp: new Date(),
    likes: 0,
    ...comment,
  }

  commentCollection.push(newComment)
  return newComment
}

// Hàm để thích comment
export function likeComment(commentId: string): Comment | undefined {
  const comment = commentCollection.find((c) => c.id === commentId)
  if (comment) {
    comment.likes += 1
  }
  return comment
}
