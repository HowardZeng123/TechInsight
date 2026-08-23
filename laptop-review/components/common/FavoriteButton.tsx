"use client"

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { User } from '@/lib/firebase'
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  laptopId: string | number
  className?: string
  size?: number
  initialFavorite?: boolean
  onToggleFavorite?: (isFavorite: boolean) => void
}

export default function FavoriteButton({
  laptopId,
  className = '',
  size = 16,
  initialFavorite = false,
  onToggleFavorite
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userObj, setUserObj] = useState<User | null>(null)
  const { toast } = useToast()

  // Lấy thông tin người dùng từ localStorage khi component được render
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user')
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage)
      setUser(userData)

      // Khởi tạo đối tượng User từ dữ liệu local
      const initUserObj = async () => {
        try {
          const userFromFirestore = await User.getFromFirestore(userData.uid)
          if (userFromFirestore) {
            setUserObj(userFromFirestore)
            const isFav = userFromFirestore.isFavorite(String(laptopId))
            setIsFavorite(isFav)
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error)
        }
      }

      initUserObj()
    }
  }, [laptopId])

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để sử dụng tính năng yêu thích!",
        variant: "destructive",
      })
      return
    }

    if (isLoading) return // Ngăn người dùng click nhanh nhiều lần
    setIsLoading(true)

    try {
      // Sử dụng userObj từ state nếu đã có, nếu không thì lấy từ Firestore
      let currentUserObj = userObj
      if (!currentUserObj) {
        currentUserObj = await User.getFromFirestore(user.uid)
        setUserObj(currentUserObj)
      }

      if (!currentUserObj) {
        setIsLoading(false)
        return
      }

      // Cập nhật UI trước để tăng trải nghiệm người dùng
      const newFavoriteState = !isFavorite
      setIsFavorite(newFavoriteState)

      // Cập nhật dữ liệu Firestore
      if (newFavoriteState) {
        await currentUserObj.addFavoriteItem(String(laptopId))
      } else {
        await currentUserObj.removeFavoriteItem(String(laptopId))
      }
      
      // Gọi callback nếu được cung cấp
      if (onToggleFavorite) {
        onToggleFavorite(newFavoriteState)
      }
      
      // Hiển thị toast thông báo
      toast({
        title: newFavoriteState ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích",
        description: newFavoriteState 
          ? "Sản phẩm đã được thêm vào danh sách yêu thích" 
          : "Sản phẩm đã được xóa khỏi danh sách yêu thích",
        variant: "default",
      })

      // Refresh trang favorite nếu đang ở đó và đã xóa item
      if (window.location.pathname.includes('/favorite') && !newFavoriteState) {
        // Thay vì reload toàn bộ trang, có thể sử dụng context/state để cập nhật
        // Nhưng hiện tại sẽ dùng reload để đảm bảo tương thích
        window.location.reload()
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", error)
      // Phục hồi trạng thái UI nếu xảy ra lỗi
      setIsFavorite(isFavorite)
      
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault() // Ngăn chặn sự kiện click lan sang parent component
        e.stopPropagation()
        toggleFavorite()
      }}
      className={`transition-colors duration-300 ${className} ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
      aria-label={isFavorite ? "Xóa khỏi mục yêu thích" : "Thêm vào yêu thích"}
      disabled={isLoading}
    >
      <Heart 
        size={size} 
        className={`transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}
      />
    </button>
  )
} 