// laptop-review/components/comparison/ComparisonOverview.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ComparisonOverviewProps = {
  laptops: any[];
};

export default function ComparisonOverview({ laptops }: ComparisonOverviewProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removedLaptopId, setRemovedLaptopId] = useState<string | null>(null);
  const [otherLaptopId, setOtherLaptopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi người dùng muốn xóa laptop
  const handleRemoveLaptop = (laptopId: string) => {
    const otherLaptop = laptops.find(laptop => laptop.id !== laptopId);
    setRemovedLaptopId(laptopId);
    if (otherLaptop) {
      setOtherLaptopId(otherLaptop.id);
    }
    setIsModalOpen(true);
  };

  // Hàm tìm kiếm laptop theo keyword
  const searchLaptops = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const laptopsRef = collection(db, "laptops");
      // Thực hiện tìm kiếm cả prefix và substring
      const querySnapshot = await getDocs(laptopsRef);
      
      // Lọc kết quả ở client-side (vì Firestore không hỗ trợ tìm kiếm substring)
      const filteredResults = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(laptop => 
          laptop.name.toLowerCase().includes(keyword.toLowerCase()) && 
          laptop.id !== otherLaptopId // Loại trừ laptop đang còn lại trong so sánh
        )
        .slice(0, 5); // Giới hạn 5 kết quả
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching laptops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Khi người dùng thay đổi từ khóa tìm kiếm
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchLaptops(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Hàm xử lý khi người dùng chọn laptop mới
  const handleSelectNewLaptop = (newLaptopId: string) => {
    if (otherLaptopId) {
      // Chuyển hướng đến trang so sánh mới với laptop đã chọn và laptop mới
      router.push(`/compare/${otherLaptopId}-vs-${newLaptopId}`);
    } else {
      // Nếu không có laptop nào còn lại, chuyển hướng đến trang chi tiết laptop mới
      router.push(`/laptops/${newLaptopId}`);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Overview</h2>

        <div className="grid grid-cols-2 gap-8">
          {laptops.map((laptop) => (
            <div key={laptop.id} className="text-center">
              <div className="relative w-full h-[200px] mb-4">
                <Image
                  src={laptop.image}
                  alt={laptop.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">{laptop.name}</h3>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{laptop.price}</div>
              <div className="flex justify-center space-x-2">
                <Link
                  href={`/laptops/${laptop.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
                >
                  Xem chi tiết
                </Link>
                <button
                  onClick={() => handleRemoveLaptop(laptop.id)}
                  className="inline-block bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium py-2 px-6 rounded"
                >
                  Xóa laptop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal tìm kiếm laptop mới */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Chọn laptop thay thế</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Tìm và chọn laptop để thay thế cho laptop đã xóa.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tên laptop cần tìm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-4 w-4" />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Kết quả tìm kiếm */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Đang tìm kiếm...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {searchResults.map((laptop) => (
                    <li 
                      key={laptop.id} 
                      className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => handleSelectNewLaptop(laptop.id)}
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 mr-4">
                        <img 
                          src={laptop.image || "/placeholder.svg"} 
                          alt={laptop.name}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{laptop.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{laptop.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : searchQuery ? (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">Không tìm thấy kết quả phù hợp</p>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}