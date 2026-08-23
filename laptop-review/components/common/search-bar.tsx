import Image from 'next/image'
import { useState, useEffect, useRef } from "react"
import { SearchIcon, X } from "lucide-react"
import { laptopService } from "@/services/firebaseServices"
import { useRouter } from 'next/navigation'

// Định nghĩa kiểu dữ liệu cho laptop
interface Laptop {
  id: string;
  name: string;
  image?: string;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    display: string;
  } | string;
  detailLink?: string;
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Laptop[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Xử lý click ngoài khu vực tìm kiếm để đóng kết quả
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý tìm kiếm khi người dùng nhập
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await laptopService.search(searchTerm);
          setSearchResults(results as Laptop[]);
          setShowResults(true);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/all-laptops?search=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
    }
  };

  const handleSearchItemClick = (laptopId: string) => {
    router.push(`/laptops/${laptopId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm laptop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-10 text-sm bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-900 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
          />
          <SearchIcon className="absolute w-4 h-4 text-gray-400 dark:text-gray-300 transform -translate-y-1/2 left-3 top-1/2" />
          {searchTerm && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
      
      {/* Kết quả tìm kiếm */}
      {showResults && (
        <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="inline-block h-6 w-6 border-t-2 border-b-2 border-gray-500 dark:border-gray-400 rounded-full animate-spin"></div>
              <p className="mt-2">Đang tìm kiếm...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              {searchResults.map((laptop) => (
                <div 
                  key={laptop.id}
                  className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => handleSearchItemClick(laptop.id)}
                >
                  {laptop.image && (
                    <div className="w-10 h-10 mr-3 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={laptop.image} 
                        alt={laptop.name}
                        fill
                        style={{objectFit: 'contain'}}
                        className="p-1"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{laptop.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {typeof laptop.specs === 'string' 
                        ? laptop.specs 
                        : `${laptop.specs.cpu}, ${laptop.specs.ram}, ${laptop.specs.storage}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>Không tìm thấy laptop nào phù hợp!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 