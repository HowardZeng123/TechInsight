"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Settings, PieChart, Pencil, Smartphone, Laptop } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

interface RecentItem {
  id: string
  name: string
  createdAt: {
    seconds: number
    nanoseconds: number
  } | null
}

interface StatsData {
  totalLaptops: number
  totalPhones: number
  recentlyAddedLaptops: RecentItem[]
  recentlyAddedPhones: RecentItem[]
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<StatsData>({
    totalLaptops: 0,
    totalPhones: 0,
    recentlyAddedLaptops: [],
    recentlyAddedPhones: []
  })
  const [loading, setLoading] = useState(true)

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        // Lấy laptop
        const laptopsCollection = collection(db, "laptops")
        const laptopSnapshot = await getDocs(laptopsCollection)
        const laptopList: RecentItem[] = laptopSnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().name || "Không có tên",
            createdAt: doc.data().createdAt || null
          }))
          .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds
            }
            return 0
          })
          .slice(0, 5)
        
        // Lấy điện thoại
        const phonesCollection = collection(db, "smartphones")
        const phoneSnapshot = await getDocs(phonesCollection)
        const phoneList: RecentItem[] = phoneSnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().name || "Không có tên",
            createdAt: doc.data().createdAt || null
          }))
          .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds
            }
            return 0
          })
          .slice(0, 5)

        setStats({
          totalLaptops: laptopSnapshot.size,
          totalPhones: phoneSnapshot.size,
          recentlyAddedLaptops: laptopList,
          recentlyAddedPhones: phoneList
        })
        
        setLoading(false)
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [db])

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Trang Quản Trị</h1>
          <p className="text-muted-foreground">Quản lý và cập nhật thông tin hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button 
            onClick={() => router.push("/admin/laptop-form")} 
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm Laptop
          </Button>
          <Button 
            onClick={() => router.push("/admin/phone-form")} 
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm Điện Thoại
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Số Laptop</CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalLaptops}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Laptop trong cơ sở dữ liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Số Điện Thoại</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalPhones}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Điện thoại trong cơ sở dữ liệu
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="management" className="mb-8">
        <TabsList>
          <TabsTrigger value="management">Quản Lý Dữ Liệu</TabsTrigger>
          <TabsTrigger value="recentLaptops">Laptop Mới Nhất</TabsTrigger>
          <TabsTrigger value="recentPhones">Điện Thoại Mới Nhất</TabsTrigger>
        </TabsList>
        <TabsContent value="management" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Cộng Đồng (Forum)</CardTitle>
                <CardDescription>
                  Quản lý và kiểm duyệt bài đăng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Xem danh sách bài đăng của người dùng, xóa các bài vi phạm hoặc rác.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push("/admin/manage-forum")} 
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Kiểm Duyệt Cộng Đồng
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bài Viết (Article)</CardTitle>
                <CardDescription>
                  Đăng bài viết chuyên sâu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bài viết (Kiến trúc ARM...) sẽ hiển thị trong mục "BÀI VIẾT MỚI NHẤT" ở trang chủ.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push("/admin/article-form")} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo Bài Viết Mới
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân quyền</CardTitle>
                <CardDescription>
                  Phân quyền admin cho user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                 Nhập id của user từ firestore và nhập Key để phân quyền
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push("/admin-tools")} 
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Set Admin
                </Button>
              </CardFooter>
            </Card>

          </div>
        </TabsContent>
        
        <TabsContent value="recentLaptops">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Laptop Mới Nhất */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">5 Laptop Mới Nhất</h3>
                {stats.recentlyAddedLaptops.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-1 divide-y">
                      {stats.recentlyAddedLaptops.map((laptop) => (
                        <div key={laptop.id} className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-medium">{laptop.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {laptop.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/admin/edit-laptop/${laptop.id}`)}
                            >
                              <Pencil className="h-4 w-4 mr-1" /> Sửa
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/laptops/${laptop.id}`)}
                            >
                              Xem
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-md">
                    Chưa có laptop nào trong hệ thống.
                  </div>
                )}
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-muted-foreground"
                    onClick={() => router.push("/admin/manage-laptops")}
                  >
                    Xem tất cả laptop
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recentPhones">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
                <h3 className="text-lg font-medium">5 Điện Thoại Mới Nhất</h3>
                {stats.recentlyAddedPhones.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-1 divide-y">
                      {stats.recentlyAddedPhones.map((phone) => (
                        <div key={phone.id} className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-medium">{phone.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {phone.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/admin/edit-phone/${phone.id}`)}
                            >
                              <Pencil className="h-4 w-4 mr-1" /> Sửa
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/phones/${phone.id}`)}
                            >
                              Xem
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-md">
                    Chưa có điện thoại nào trong hệ thống.
                  </div>
                )}
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-muted-foreground"
                    onClick={() => router.push("/admin/manage-phones")}
                  >
                    Xem tất cả điện thoại
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
