"use client"

import { useState, useEffect } from "react"
import { BellIcon, LogIn } from "lucide-react"
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import {firebaseConfig} from "../lib/firebase"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Định nghĩa kiểu dữ liệu cho notification
interface Notification {
  id: string
  title: string
  time: string
  read: boolean
}

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("user");
      setUser(storedUserData ? JSON.parse(storedUserData) : null);
    }

    const fetchNotifications = async () => {
      const queryNoti = await getDocs(collection(db, "notification"))
      let dbNoti: Notification[] = []
      queryNoti.forEach((noti) => {
        const objNoti: Notification = {
          id: noti.id,
          title: noti.data().title,
          time: noti.data().time,
          read: noti.data().read,
        }
        dbNoti = [...dbNoti, objNoti]
      })
      setNotifications(dbNoti)
    }
  
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const toggleNotifications = () => {
    // Nếu chưa đăng nhập, hiển thị dialog yêu cầu đăng nhập
    if (!user) {
      setIsLoginDialogOpen(true)
      return
    }
    setShowNotifications(!showNotifications)
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Hướng dẫn người dùng đến trang đăng nhập
  const goToLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-700 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && user && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dialog yêu cầu đăng nhập */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng nhập để xem thông báo</DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập hoặc đăng ký tài khoản để có thể xem thông báo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="default" onClick={goToLogin}>
              <LogIn className="w-4 h-4 mr-2" /> Đăng nhập ngay
            </Button>
            <Button variant="outline" onClick={() => setIsLoginDialogOpen(false)}>
              Để sau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showNotifications && user && (
        <div
          className="absolute right-0 z-20 w-80 mt-2 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fade-in"
          style={{ animationDuration: '0.2s' }}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? "bg-gray-50 dark:bg-gray-700" : "dark:bg-gray-800"
                  } animate-fade-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    {!notification.read && (
                      <div className="w-2 h-2 mt-1.5 mr-2 bg-blue-500 rounded-full"></div>
                    )}
                    <div className={!notification.read ? "ml-0" : "ml-4"}>
                      <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 text-center border-t dark:border-gray-700">
            <button className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}