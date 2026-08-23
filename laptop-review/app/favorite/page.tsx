"use client"

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2, RefreshCw, ChevronLeft, Star, ShoppingCart } from "lucide-react"
import { User } from '@/lib/firebase'
import { laptopService } from '@/services/firebaseServices'
import FavoriteButton from '@/components/common/FavoriteButton'

const FavoritePage = () => {
  const [user, setUser] = useState<any>(null)
  const [favoriteItems, setFavoriteItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user')
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage)
      setUser(userData)
      fetchFavoriteItems(userData.uid)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchFavoriteItems = async (userId: string) => {
    try {
      setLoading(true)
      
      // Lấy thông tin user từ Firestore
      const userObj = await User.getFromFirestore(userId)
      console.log("User Object:", userObj)
      
      if (!userObj || !userObj.favoriteItems || userObj.favoriteItems.length === 0) {
        console.log("Không có dữ liệu yêu thích hoặc danh sách rỗng")
        setFavoriteItems([])
        setLoading(false)
        return
      }
      
      // Lấy thông tin laptop từ danh sách id yêu thích
      const favoriteIds = userObj.favoriteItems
      console.log("Danh sách ID yêu thích:", favoriteIds)
      
      const laptops = await Promise.all(
        favoriteIds.map(async (id: string) => {
          try {
            console.log("Đang tải laptop ID:", id)
            const laptop = await laptopService.getById(id)
            console.log("Kết quả laptop:", laptop)
            return laptop
          } catch (error) {
            console.error(`Lỗi khi lấy thông tin laptop ${id}:`, error)
            return null
          }
        })
      )
      
      // Lọc bỏ các phần tử null (trường hợp một laptop đã bị xóa)
      const validLaptops = laptops.filter(laptop => laptop !== null)
      console.log("Danh sách laptop hợp lệ:", validLaptops)
      setFavoriteItems(validLaptops)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (laptopId: string) => {
    if (!user) return
    
    try {
      const userObj = await User.getFromFirestore(user.uid)
      if (!userObj) return
      
      await userObj.removeFavoriteItem(laptopId)
      // Cập nhật lại danh sách
      setFavoriteItems(favoriteItems.filter(item => item.id !== laptopId))
    } catch (error) {
      console.error("Lỗi khi xóa mục yêu thích:", error)
    }
  }

  // Hàm làm mới dữ liệu
  const refreshData = () => {
    if (user) {
      fetchFavoriteItems(user.uid)
    }
  }
  
  // Làm mới hoàn toàn trang bằng cách làm mới trình duyệt
  const forceRefresh = () => {
    // Xóa bộ nhớ cache
    if (window.caches) {
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          return caches.delete(key);
        }));
      });
    }
    
    // Làm mới trang
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 text-gray-600">
            <Link href="/" className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trang chủ
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            Laptop Yêu Thích
          </h1>
          
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <p className="text-xl font-medium text-gray-700">Đang tải danh sách yêu thích...</p>
            <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 text-gray-600">
            <Link href="/" className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trang chủ
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            Laptop Yêu Thích
          </h1>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-red-50 rounded-full p-5 inline-flex mb-6">
                <Heart className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Vui lòng đăng nhập</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Đăng nhập để lưu và quản lý danh sách laptop yêu thích của bạn trên mọi thiết bị.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8 text-gray-600">
            <Link href="/" className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trang chủ
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            Laptop Yêu Thích
          </h1>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-gray-100 rounded-full p-5 inline-flex mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Bạn chưa có laptop yêu thích</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Hãy duyệt qua các laptop và nhấn vào biểu tượng trái tim để thêm vào danh sách yêu thích.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/all-laptops" 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Khám phá laptop
                </Link>
                <button
                  onClick={forceRefresh}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Làm mới trang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8 text-gray-600">
          <Link href="/" className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            Laptop Yêu Thích
          </h1>
          
          <div className="flex gap-3">
            <button 
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới dữ liệu
            </button>
            <button 
              onClick={forceRefresh}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Làm mới trang
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-gray-700">
            <span className="font-semibold">{favoriteItems.length}</span> laptop yêu thích
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((laptop) => (
            <div 
              key={laptop.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 group"
            >
              <div className="relative">
                {/* Ảnh thumbnail */}
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-lg">
                    {laptop.name}
                  </div>
                </div>
                
                {/* Nút yêu thích */}
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton
                    laptopId={laptop.id}
                    initialFavorite={true}
                    onToggleFavorite={(isFavorite) => {
                      if (!isFavorite) {
                        removeFavorite(laptop.id)
                      }
                    }}
                    size={24}
                    className="p-2 bg-white rounded-full shadow-sm"
                  />
                </div>

                {/* Badge giảm giá */}
                {laptop.originalPrice && laptop.price !== laptop.originalPrice && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded-md">
                    Giảm giá
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <Link href={`/laptops/${laptop.id}`}>
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < Math.floor(laptop.benchmarks?.overall || 0) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'} mr-0.5`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {laptop.benchmarks?.overall ? laptop.benchmarks.overall.toFixed(1) : "N/A"}
                    </span>
                  </div>
                  
                  {/* Tên laptop */}
                  <h3 className="font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {laptop.name}
                  </h3>
                  
                  {/* Thông số kỹ thuật */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {laptop.specs?.cpu}, {laptop.specs?.ram}, {laptop.specs?.storage}
                  </p>
                  
                  {/* Giá */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">{laptop.price}</span>
                    {laptop.originalPrice && laptop.originalPrice !== laptop.price && (
                      <span className="text-sm text-gray-500 line-through">{laptop.originalPrice}</span>
                    )}
                  </div>
                </Link>
                
                {/* Nút hành động */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Link 
                    href={`/laptops/${laptop.id}`}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-blue-600 text-center hover:bg-blue-50 transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                  <button 
                    onClick={() => removeFavorite(laptop.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Xóa khỏi danh sách yêu thích"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FavoritePage
