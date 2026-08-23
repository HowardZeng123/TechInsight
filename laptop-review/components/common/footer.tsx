"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronUp, Facebook, Twitter, Instagram, Linkedin, Mail, Heart, RefreshCw, Home, Laptop, Smartphone } from "lucide-react"

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      <footer className="py-12 text-white bg-gray-900 dark:bg-gray-950">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 space-x-2">
                <div className="overflow-hidden rounded-full">
                  <Image src="/TechInsight_Logo.png" alt="TechInsight Logo" width={40} height={40} className="h-auto" />
                </div>
                <h3 className="text-xl font-bold text-white">TechInsight</h3>
              </div>
              <p className="mb-6 text-gray-400">
                Hướng dẫn chọn mua laptop đáng tin cậy: Phân tích chuẩn xác, so sánh thông minh và gợi ý hợp túi tiền – giúp bạn dễ dàng tìm ra thiết bị lý tưởng cho mục đích của bạn.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase text-gray-300">ĐIỀU HƯỚNG</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="/" className="flex items-center hover:text-white transition-colors">
                    <Home size={16} className="mr-2" />
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/all-laptops" className="flex items-center hover:text-white transition-colors">
                    <Laptop size={16} className="mr-2" />
                    Tất cả laptop
                  </Link>
                </li>
                <li>
                  <Link href="/all-phones" className="flex items-center hover:text-white transition-colors">
                    <Smartphone size={16} className="mr-2" />
                    Điện thoại
                  </Link>
                </li>
                <li>
                  <Link href="/favorite" className="flex items-center hover:text-white transition-colors">
                    <Heart size={16} className="mr-2" />
                    Yêu thích
                  </Link>
                </li>
                <li>
                  <Link href="/compare-select" className="flex items-center hover:text-white transition-colors">
                    <RefreshCw size={16} className="mr-2" />
                    So sánh
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase text-gray-300">LOẠI LAPTOP</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="/all-laptops?category=gaming" className="hover:text-white transition-colors">
                    Gaming Laptops
                  </Link>
                </li>
                <li>
                  <Link href="/all-laptops?category=ultrabook" className="hover:text-white transition-colors">
                    Ultrabooks
                  </Link>
                </li>
                <li>
                  <Link href="/all-laptops?category=budget" className="hover:text-white transition-colors">
                    Budget Laptops
                  </Link>
                </li>
                <li>
                  <Link href="/all-laptops?category=business" className="hover:text-white transition-colors">
                    Business Laptops
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase text-gray-300">THƯƠNG HIỆU</h4>
              <ul className="text-sm text-gray-400">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <li>
                    <Link href="/all-laptops?brand=asus" className="hover:text-white transition-colors">
                      Asus
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=dell" className="hover:text-white transition-colors">
                      Dell
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=hp" className="hover:text-white transition-colors">
                      HP
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=lenovo" className="hover:text-white transition-colors">
                      Lenovo
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=msi" className="hover:text-white transition-colors">
                      MSI
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=acer" className="hover:text-white transition-colors">
                      Acer
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=apple" className="hover:text-white transition-colors">
                      Apple
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=razer" className="hover:text-white transition-colors">
                      Razer
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-laptops?brand=samsung" className="hover:text-white transition-colors">
                      Samsung
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col items-center">
              <div className="flex space-x-6 text-sm text-gray-400 mb-4">
                <Link href="#" className="hover:text-white transition-colors">
                  Điều khoản sử dụng
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </div>
              <p className="text-sm text-center text-gray-400">
                &copy; {new Date().getFullYear()} TechInsight | Made by 4Sheep
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Nút quay lại đầu trang */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed p-3 text-white bg-gray-800 rounded-full shadow-lg bottom-6 right-6 hover:bg-gray-700 transition-all duration-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Quay lại đầu trang"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  )
} 