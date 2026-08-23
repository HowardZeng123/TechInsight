"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import AdminProtection from "@/components/auth/AdminProtection"
import { Laptop, Smartphone, LayoutDashboard, Plus, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  // Kiểm tra kích thước màn hình để hiển thị nav phù hợp
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const navItems = [
    {
      title: "Trang Quản Trị",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      title: "Quản lý Laptop",
      href: "/admin/manage-laptops",
      icon: <Laptop className="h-4 w-4 mr-2" />,
    },
    {
      title: "Quản lý Điện Thoại",
      href: "/admin/manage-phones",
      icon: <Smartphone className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <AdminProtection>
      {/* Thanh navigation cho desktop */}
      {!isMobile && (
        <div className="border-b">
          <div className="container mx-auto flex h-16 items-center px-4">
            <div className="mr-4 hidden md:flex">
              <Link 
                href="/"
                className="flex items-center"
              >
                <Laptop className="h-6 w-6 mr-2" />
                <span className="font-medium">Trang Chủ</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>

          </div>
        </div>
      )}

      {/* Thanh navigation cho mobile */}
      {isMobile && (
        <div className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link 
              href="/"
              className="flex items-center"
            >
              <Laptop className="h-6 w-6 mr-2" />
              <span className="font-medium">Admin</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <span>Menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {navItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={item.href} className="flex items-center">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Về Trang Chính</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {children}
    </AdminProtection>
  )
} 