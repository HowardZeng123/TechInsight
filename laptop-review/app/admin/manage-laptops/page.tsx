"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronLeft, Pencil, Trash, Loader2, Search, ChevronRight, ChevronFirst, ChevronLast } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

type Laptop = {
  id: string
  name: string
  price: string
  specs: {
    cpu: string
    gpu: string
    ram: string
    storage: string
    display: string
    battery: string
  }
  createdAt: any
}

export default function ManageLaptopsPage() {
  const router = useRouter()
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [filteredLaptops, setFilteredLaptops] = useState<Laptop[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [paginatedLaptops, setPaginatedLaptops] = useState<Laptop[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  useEffect(() => {
    async function fetchLaptops() {
      try {
        setLoading(true)
        const laptopsCollection = collection(db, "laptops")
        const laptopSnapshot = await getDocs(laptopsCollection)
        
        const laptopList: Laptop[] = laptopSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || "Không có tên",
            price: data.price || "Chưa có giá",
            specs: {
              cpu: data.specs?.cpu || "",
              gpu: data.specs?.gpu || "",
              ram: data.specs?.ram || "",
              storage: data.specs?.storage || "",
              display: data.specs?.display || "",
              battery: data.specs?.battery || "",
            },
            createdAt: data.createdAt,
          }
        })

        // Sort by newest first if createdAt exists
        laptopList.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds
          }
          return 0
        })
        
        setLaptops(laptopList)
        setFilteredLaptops(laptopList)
        setLoading(false)
      } catch (error) {
        console.error("Lỗi khi tải danh sách laptop:", error)
        setError("Không thể tải danh sách laptop. Vui lòng thử lại sau.")
        setLoading(false)
      }
    }

    fetchLaptops()
  }, [db])

  // Update pagination when filtered laptops change
  useEffect(() => {
    const totalPages = Math.ceil(filteredLaptops.length / itemsPerPage)
    setTotalPages(totalPages || 1)
    
    // Reset to page 1 when search changes
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedLaptops(filteredLaptops.slice(startIndex, endIndex))
  }, [filteredLaptops, currentPage])

  // Hàm tìm kiếm laptop
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredLaptops(laptops)
      return
    }
    
    const filtered = laptops.filter(laptop => 
      laptop.name.toLowerCase().includes(query)
    )
    setFilteredLaptops(filtered)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleEdit = (laptopId: string) => {
    router.push(`/admin/edit-laptop/${laptopId}`)
  }

  const handleDelete = async (laptopId: string) => {
    try {
      setDeletingId(laptopId)
      await deleteDoc(doc(db, "laptops", laptopId))
      setLaptops(laptops.filter(laptop => laptop.id !== laptopId))
      setFilteredLaptops(filteredLaptops.filter(laptop => laptop.id !== laptopId))
      setDeletingId(null)
    } catch (error) {
      console.error("Lỗi khi xóa laptop:", error)
      setError("Không thể xóa laptop. Vui lòng thử lại sau.")
      setDeletingId(null)
    }
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground"
          onClick={() => router.push("/admin")}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại trang quản lý
        </Button>
        <h1 className="text-2xl font-bold">Quản Lý Laptop</h1>
        <Button 
          onClick={() => router.push("/admin/laptop-form")}
        >
          Thêm Laptop Mới
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Danh Sách Laptop</CardTitle>
          <CardDescription>
            Tất cả laptop hiện có trong hệ thống. Bạn có thể chỉnh sửa hoặc xóa các mục.
          </CardDescription>

          {/* Thanh tìm kiếm */}
          <div className="flex w-full max-w-sm items-center relative mt-4">
            <Input
              placeholder="Tìm kiếm laptop theo tên..."
              value={searchQuery}
              onChange={handleSearch}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
          ) : filteredLaptops.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <p>Không tìm thấy laptop nào phù hợp với "{searchQuery}"</p>
              ) : (
                <>
                  <p>Chưa có laptop nào trong hệ thống.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push("/admin/laptop-form")}
                  >
                    Thêm Laptop Đầu Tiên
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên Laptop</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>GPU</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLaptops.map((laptop) => (
                      <TableRow key={laptop.id}>
                        <TableCell className="font-medium">
                          {laptop.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          <span className="inline-block max-w-[150px] truncate">{laptop.id}</span>
                        </TableCell>
                        <TableCell>{laptop.specs.cpu}</TableCell>
                        <TableCell>{laptop.specs.gpu}</TableCell>
                        <TableCell>
                          {laptop.price ? (
                            <Badge variant="outline">{laptop.price}</Badge>
                          ) : (
                            <span className="text-muted-foreground">Chưa có giá</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(laptop.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  {deletingId === laptop.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa laptop "{laptop.name}" không? Thao tác này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(laptop.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {/* First page */}
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => handlePageChange(1)}>
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      {/* Ellipsis if needed */}
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum;
                        if (currentPage === 1) {
                          pageNum = i + 1;
                        } else if (currentPage === totalPages) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }
                        
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink 
                                onClick={() => handlePageChange(pageNum)}
                                isActive={currentPage === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      {/* Ellipsis if needed */}
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                Hiển thị {paginatedLaptops.length} / {filteredLaptops.length} laptop
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 