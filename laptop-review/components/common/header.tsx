import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from "react"
import { Heart, Laptop, Smartphone, Scale, MessageSquare } from "lucide-react"
import NotificationBell from "@/components/notification-bell"
import SearchBar from '@/components/common/search-bar'
import ThemeToggle from '@/components/common/theme-toggle'
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const [user, setUser] = useState<{ email: string; username: string; avatar: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn lần sau!",
      variant: "default",
    });
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm dark:border-gray-800">
      <div className="w-full max-w-screen-2xl flex items-center h-16 px-4 mx-auto">
        <div className="flex items-center justify-between w-full gap-4 lg:gap-8">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/TechInsight_Logo.png" alt="TechInsight Logo" width={40} height={40} className="rounded" />
              <span className="text-xl font-bold dark:text-white hidden sm:block">TechInsight</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Right-side buttons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link href="/all-laptops" className="hidden md:flex items-center text-sm font-bold hover:text-gray-700 dark:text-gray-200 dark:hover:text-white">
              <Laptop className="w-5 h-5 mr-1" />
              <span>Laptop</span>
            </Link>
            <Link href="/all-phones" className="hidden md:flex items-center text-sm font-bold hover:text-gray-700 dark:text-gray-200 dark:hover:text-white">
              <Smartphone className="w-5 h-5 mr-1" />
              <span>Điện thoại</span>
            </Link>
            <Link href="/compare-select" className="flex items-center text-sm font-bold hover:text-gray-700 dark:text-gray-200 dark:hover:text-white">
              <Scale className="w-5 h-5 mr-1" />
              <span>So sánh</span>
            </Link>
            <Link href="/forum" className="hidden md:flex items-center text-sm font-bold hover:text-gray-700 dark:text-gray-200 dark:hover:text-white">
              <MessageSquare className="w-5 h-5 mr-1" />
              <span>Cộng Đồng</span>
            </Link>
            
            <NotificationBell />
            
            <ThemeToggle />
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={user?.avatar || "/user-circle.svg"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-400 dark:bg-gray-200"
                  />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 w-48 mt-2 bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                      <p>{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <hr className="dark:border-gray-700" />
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Trang cá nhân
                    </Link>
                    {user?.email === "admin@bayco.satij" && (
                      <Link
                        href="/admin"
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Trang Quản Trị
                      </Link>
                    )}
                    <Link
                      href="/favorite"
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Yêu thích
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
