// laptop-review/components/comparison/ComparisonOverview.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ComparisonOverviewProps = {
  laptops: any[];
  category?: 'laptop' | 'phone';
};

export default function ComparisonOverview({ laptops, category = 'laptop' }: ComparisonOverviewProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removedLaptopId, setRemovedLaptopId] = useState<string | null>(null);
  const [otherLaptopId, setOtherLaptopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isPhone = category === 'phone';
  const detailPrefix = isPhone ? '/phones' : '/laptops';
  const collectionName = isPhone ? 'smartphones' : 'laptops';
  const itemLabel = isPhone ? 'điện thoại' : 'laptop';

  const handleRemoveLaptop = (laptopId: string) => {
    const otherLaptop = laptops.find(laptop => laptop.id !== laptopId);
    setRemovedLaptopId(laptopId);
    if (otherLaptop) {
      setOtherLaptopId(otherLaptop.id);
    }
    setIsModalOpen(true);
  };

  const searchLaptops = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const itemsRef = collection(db, collectionName);
      const querySnapshot = await getDocs(itemsRef);
      
      const filteredResults = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase()) && 
          item.id !== otherLaptopId
        )
        .slice(0, 5);
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error(`Error searching ${collectionName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchLaptops(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectNewLaptop = (newLaptopId: string) => {
    if (otherLaptopId) {
      router.push(`/compare/${otherLaptopId}-vs-${newLaptopId}?category=${category}`);
    } else {
      router.push(`${detailPrefix}/${newLaptopId}`);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Tổng quan</h2>

        <div className="grid grid-cols-2 gap-8">
          {laptops.map((laptop) => (
            <div key={laptop.id} className="text-center flex flex-col items-center">
              <div className="relative w-full h-[200px] mb-4">
                <Image
                  src={laptop.image || "/placeholder.svg"}
                  alt={laptop.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">{laptop.name}</h3>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{laptop.price}</div>
              <div className="flex justify-center space-x-2 mt-auto">
                <Link
                  href={`${detailPrefix}/${laptop.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
                >
                  Xem chi tiết
                </Link>
                <button
                  onClick={() => handleRemoveLaptop(laptop.id)}
                  className="inline-block bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium py-2 px-6 rounded"
                >
                  Xóa {itemLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Chọn {itemLabel} thay thế</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Tìm và chọn {itemLabel} để thay thế cho {itemLabel} đã xóa.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder={`Nhập tên ${itemLabel} cần tìm...`}
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
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 mr-4 relative">
                        <Image 
                          src={laptop.image || "/placeholder.svg"} 
                          alt={laptop.name}
                          fill
                          className="object-contain"
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