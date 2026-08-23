"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ChevronLeft, Pencil, Trash, Loader2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

type Phone = {
  id: string
  name: string
  price: string
  specs: {
    soc: string
    ram: string
    storage: string
    battery: string
  }
  createdAt: any
}

export default function ManagePhonesPage() {
  const router = useRouter()
  const [phones, setPhones] = useState<Phone[]>([])
  const [filteredPhones, setFilteredPhones] = useState<Phone[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [paginatedPhones, setPaginatedPhones] = useState<Phone[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  useEffect(() => {
    async function fetchPhones() {
      try {
        setLoading(true)
        const phonesCollection = collection(db, "smartphones")
        const phoneSnapshot = await getDocs(phonesCollection)
        
        const phoneList: Phone[] = phoneSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || "Không có tên",
            price: data.price || "Chưa có giá",
            specs: {
              soc: data.specs?.soc || "",
              ram: data.specs?.ram || "",
              storage: data.specs?.storage || "",
              battery: data.specs?.battery || "",
            },
            createdAt: data.createdAt,
          }
        })

        phoneList.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds
          }
          return 0
        })
        
        setPhones(phoneList)
        setFilteredPhones(phoneList)
        setLoading(false)
      } catch (error) {
        console.error("Lỗi khi tải danh sách điện thoại:", error)
        setError("Không thể tải danh sách. Vui lòng thử lại sau.")
        setLoading(false)
      }
    }

    fetchPhones()
  }, [db])

  useEffect(() => {
    const totalPages = Math.ceil(filteredPhones.length / itemsPerPage)
    setTotalPages(totalPages || 1)
    
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedPhones(filteredPhones.slice(startIndex, endIndex))
  }, [filteredPhones, currentPage])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredPhones(phones)
      return
    }
    
    const filtered = phones.filter(phone => 
      phone.name.toLowerCase().includes(query)
    )
    setFilteredPhones(filtered)
    setCurrentPage(1)
  }

  const handleEdit = (phoneId: string) => {
    router.push(`/admin/edit-phone/${phoneId}`)
  }

  const handleDelete = async (phoneId: string) => {
    try {
      setDeletingId(phoneId)
      await deleteDoc(doc(db, "smartphones", phoneId))
      setPhones(phones.filter(phone => phone.id !== phoneId))
      setFilteredPhones(filteredPhones.filter(phone => phone.id !== phoneId))
      setDeletingId(null)
    } catch (error) {
      console.error("Lỗi khi xóa điện thoại:", error)
      setError("Không thể xóa. Vui lòng thử lại sau.")
      setDeletingId(null)
    }
  }

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
        <h1 className="text-2xl font-bold">Quản Lý Điện Thoại</h1>
        <Button onClick={() => router.push("/admin/phone-form")}>
          Thêm Điện Thoại Mới
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Danh Sách Điện Thoại</CardTitle>
          <CardDescription>
            Tất cả điện thoại hiện có trong hệ thống.
          </CardDescription>

          <div className="flex w-full max-w-sm items-center relative mt-4">
            <Input
              placeholder="Tìm kiếm điện thoại theo tên..."
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
          ) : filteredPhones.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <p>Không tìm thấy điện thoại nào phù hợp với "{searchQuery}"</p>
              ) : (
                <>
                  <p>Chưa có điện thoại nào trong hệ thống.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push("/admin/phone-form")}
                  >
                    Thêm Điện Thoại Đầu Tiên
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
                      <TableHead>Tên</TableHead>
                      <TableHead>SoC</TableHead>
                      <TableHead>RAM/ROM</TableHead>
                      <TableHead>Pin</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPhones.map((phone) => (
                      <TableRow key={phone.id}>
                        <TableCell className="font-medium">{phone.name}</TableCell>
                        <TableCell>{phone.specs.soc}</TableCell>
                        <TableCell>{phone.specs.ram} / {phone.specs.storage}</TableCell>
                        <TableCell>{phone.specs.battery}</TableCell>
                        <TableCell>
                          {phone.price ? (
                            <Badge variant="outline">{phone.price}</Badge>
                          ) : (
                            <span className="text-muted-foreground">Chưa có giá</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(phone.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                                  {deletingId === phone.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa "{phone.name}" không? Thao tác này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(phone.id)} className="bg-red-500 hover:bg-red-600">
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
                      
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum = currentPage === 1 ? i + 1 : currentPage === totalPages ? totalPages - 2 + i : currentPage - 1 + i;
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink onClick={() => handlePageChange(pageNum)} isActive={currentPage === pageNum}>
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
