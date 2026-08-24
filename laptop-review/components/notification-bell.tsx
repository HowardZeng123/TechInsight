"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BellIcon, LogIn, X } from "lucide-react"
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore"
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
  link?: string
}

export default function NotificationBell() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa
    let currentUser: any = null;
    let localReadIds: string[] = [];
    let localDeletedIds: string[] = [];
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("user");
      currentUser = storedUserData ? JSON.parse(storedUserData) : null;
      setUser(currentUser);
      
      try { 
        const storedReads = localStorage.getItem("read_notifications");
        localReadIds = storedReads ? JSON.parse(storedReads) : [];
      } catch(e) { localReadIds = []; }
      
      try { 
        const storedDeleteds = localStorage.getItem("deleted_notifications");
        localDeletedIds = storedDeleteds ? JSON.parse(storedDeleteds) : [];
      } catch(e) { localDeletedIds = []; }
    }

    const fetchNotifications = async () => {
      const queryNoti = await getDocs(collection(db, "notification"))
      let dbNoti: Notification[] = []
      queryNoti.forEach((noti) => {
        const data = noti.data();
        
        if (localDeletedIds.includes(noti.id)) return;
        
        // Chỉ lấy thông báo của user hiện tại (nếu có userId) hoặc thông báo chung
        if (data.userId && currentUser && data.userId !== currentUser.uid && data.userId !== currentUser.email) {
          return;
        }
        
        const isRead = data.read || localReadIds.includes(noti.id);
        
        const objNoti: Notification = {
          id: noti.id,
          title: data.title,
          time: data.time || new Date().toLocaleTimeString(),
          read: isRead,
          ...data // keep data to know if it's general
        }
        dbNoti = [...dbNoti, objNoti]
      })
      // Sắp xếp thông báo mới nhất lên đầu
      setNotifications(dbNoti.reverse())
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

  const markAsRead = async (id: string) => {
    const noti = notifications.find(n => n.id === id);
    if (!noti) return;
    
    let link = noti.link;
    const rawData = noti as any;
    if (!link) {
       if (rawData.postId) link = `/forum/${rawData.postId}`;
       else if (rawData.targetId) {
          if (noti.title.includes("Laptop")) link = `/laptops/${rawData.targetId}`;
          else if (noti.title.includes("Điện thoại")) link = `/phones/${rawData.targetId}`;
          else if (noti.title.includes("Bài viết")) link = `/all-articles`;
       }
    }
    
    if (link) {
      router.push(link);
      setShowNotifications(false);
    }
    
    if (noti.read) return;
    
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
    
    if ((noti as any).userId) {
      // Update firestore cho thông báo cá nhân
      try {
        await updateDoc(doc(db, "notification", id), { read: true });
      } catch (e) {
        console.error("Lỗi update thông báo cá nhân", e);
      }
    } else {
      // Lưu vào localStorage cho thông báo chung
      let localReadIds: string[] = [];
      try {
        const storedReads = localStorage.getItem("read_notifications");
        localReadIds = storedReads ? JSON.parse(storedReads) : [];
      } catch (e) { localReadIds = []; }
      
      if (!localReadIds.includes(id)) {
        localReadIds.push(id);
        localStorage.setItem("read_notifications", JSON.stringify(localReadIds));
      }
    }
  }

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent markAsRead from firing
    const noti = notifications.find(n => n.id === id);
    if (!noti) return;
    
    // Xoá khỏi danh sách hiện tại
    setNotifications(notifications.filter(n => n.id !== id));
    
    // Luôn lưu ID vào localStorage để lỡ xoá trên db lỗi thì cũng không bị hiện lại
    let localDeletedIds: string[] = [];
    try {
      const storedDeleteds = localStorage.getItem("deleted_notifications");
      localDeletedIds = storedDeleteds ? JSON.parse(storedDeleteds) : [];
    } catch (e) {
      localDeletedIds = [];
    }
    
    if (!localDeletedIds.includes(id)) {
      localDeletedIds.push(id);
      localStorage.setItem("deleted_notifications", JSON.stringify(localDeletedIds));
    }
    
    if ((noti as any).userId) {
      // Xoá thông báo cá nhân trên firestore
      try {
        await deleteDoc(doc(db, "notification", id));
      } catch (error) {
        console.error("Lỗi xoá thông báo:", error);
      }
    }
  }

  const markAllAsRead = async () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    
    let localReadIds: string[] = [];
    try {
      const storedReads = localStorage.getItem("read_notifications");
      localReadIds = storedReads ? JSON.parse(storedReads) : [];
    } catch (e) { localReadIds = []; }
    
    for (const noti of notifications) {
      if (!noti.read) {
        if ((noti as any).userId) {
          try {
            await updateDoc(doc(db, "notification", noti.id), { read: true });
          } catch(e) {}
        } else {
          if (!localReadIds.includes(noti.id)) {
            localReadIds.push(noti.id);
          }
        }
      }
    }
    localStorage.setItem("read_notifications", JSON.stringify(localReadIds));
  }

  const deleteAllNotifications = async () => {
    let localDeletedIds: string[] = [];
    try {
      const storedDeleteds = localStorage.getItem("deleted_notifications");
      localDeletedIds = storedDeleteds ? JSON.parse(storedDeleteds) : [];
    } catch (e) { localDeletedIds = []; }
    
    for (const noti of notifications) {
      if (!localDeletedIds.includes(noti.id)) {
        localDeletedIds.push(noti.id);
      }
      if ((noti as any).userId) {
        try {
          await deleteDoc(doc(db, "notification", noti.id));
        } catch(e) {}
      }
    }
    localStorage.setItem("deleted_notifications", JSON.stringify(localDeletedIds));
    setNotifications([]);
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
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Đã đọc tất cả
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={deleteAllNotifications}
                  className="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? "bg-gray-50 dark:bg-gray-700" : "dark:bg-gray-800"
                  } animate-fade-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      {!notification.read && (
                        <div className="w-2 h-2 mt-1.5 mr-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                      <div className={!notification.read ? "ml-0" : "ml-4"}>
                        <p className="text-sm font-medium dark:text-white line-clamp-2">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteNotification(e, notification.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                      title="Xóa thông báo"
                    >
                      <X className="w-4 h-4" />
                    </button>
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