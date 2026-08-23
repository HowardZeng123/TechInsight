"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { SearchIcon, Heart, ChevronLeft, Filter, ChevronRight } from "lucide-react"
import { smartphoneService } from "@/services/firebaseServices"
import { Smartphone } from "@/types/smartphone"
import { useRouter } from "next/navigation"

import PhoneFilterPanel, { PhoneFilterState } from "@/components/phone-filter-panel"
import NotificationBell from "@/components/notification-bell"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PhoneCard from "@/components/phone-card"

export default function AllPhonesPage() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([])
  const phoneGridRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<{ email: string; username: string; avatar: string | null } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [sortOption, setSortOption] = useState('relevance')
  const router = useRouter()
  
  const [filters, setFilters] = useState<PhoneFilterState>({
    brands: [],
    socTypes: [],
    ramSizes: [],
    storageOptions: [],
    priceRanges: [],
    displaySizes: [],
    batteryLife: [],
    features: [],
  })
  
  const [allPhones, setAllPhones] = useState<Smartphone[]>([])
  const [filteredPhones, setFilteredPhones] = useState<Smartphone[]>([])
  const [displayedPhones, setDisplayedPhones] = useState<Smartphone[]>([])
  const [loading, setLoading] = useState(true)
  
  const totalPages = Math.ceil(filteredPhones.length / itemsPerPage)
  
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const phones = await smartphoneService.getAll();
        setAllPhones(phones as Smartphone[]);
        setFilteredPhones(phones as Smartphone[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching phones:", error);
        setLoading(false);
      }
    };
    
    fetchPhones();
    
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])
  
  useEffect(() => {
    if (filteredPhones.length === 0) return;
    
    let sorted = [...filteredPhones]
    
    switch (sortOption) {
      case 'price-low':
        sorted.sort((a, b) => 
          parseInt(a.price?.replace(/[^0-9]/g, '') || '0') - 
          parseInt(b.price?.replace(/[^0-9]/g, '') || '0')
        )
        break
      case 'price-high':
        sorted.sort((a, b) => 
          parseInt(b.price?.replace(/[^0-9]/g, '') || '0') - 
          parseInt(a.price?.replace(/[^0-9]/g, '') || '0')
        )
        break
      case 'rating':
        sorted.sort((a, b) => 
          (b.benchmarks?.overall || 0) - (a.benchmarks?.overall || 0)
        )
        break
    }
    
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setDisplayedPhones(sorted.slice(indexOfFirstItem, indexOfLastItem))
    
    setVisibleCards(Array(sorted.slice(indexOfFirstItem, indexOfLastItem).length).fill(false))
    
    setTimeout(() => {
      sorted.slice(indexOfFirstItem, indexOfLastItem).forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, 50 * index)
      })
    }, 100)
    
  }, [filteredPhones, currentPage, itemsPerPage, sortOption])
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPhones(allPhones)
    } else {
      const query = searchQuery.toLowerCase()
      const results = allPhones.filter(
        phone => 
          phone.name.toLowerCase().includes(query) ||
          phone.specs.soc?.toLowerCase().includes(query) ||
          phone.specs.ram?.toLowerCase().includes(query) ||
          phone.specs.storage?.toLowerCase().includes(query)
      )
      setFilteredPhones(results)
      setCurrentPage(1)
    }
  }, [searchQuery, allPhones])

  useEffect(() => {
    if (allPhones.length === 0) return;
    
    let results = [...allPhones];
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        phone => 
          phone.name.toLowerCase().includes(query) ||
          phone.specs.soc?.toLowerCase().includes(query) ||
          phone.specs.ram?.toLowerCase().includes(query) ||
          phone.specs.storage?.toLowerCase().includes(query)
      );
    }
    
    if (filters.brands.length > 0) {
      results = results.filter(phone => {
        const phoneName = phone.name.toLowerCase();
        return filters.brands.some(brand => phoneName.includes(brand.toLowerCase()));
      });
    }
    
    if (filters.socTypes.length > 0) {
      results = results.filter(phone => {
        return filters.socTypes.some((socType: string) => 
          phone.specs.soc?.toLowerCase().includes(socType.toLowerCase())
        );
      });
    }
    
    if (filters.ramSizes.length > 0) {
      results = results.filter(phone => {
        return filters.ramSizes.some((ramSize: string) => 
          phone.specs.ram?.toLowerCase().includes(ramSize.toLowerCase())
        );
      });
    }
    
    if (filters.storageOptions.length > 0) {
      results = results.filter(phone => {
        return filters.storageOptions.some((storageOption: string) => 
          phone.specs.storage?.toLowerCase().includes(storageOption.toLowerCase().replace(' ssd', ''))
        );
      });
    }
    
    if (filters.priceRanges.length > 0) {
      results = results.filter(phone => {
        const price = parseInt(phone.price?.replace(/[^0-9]/g, '') || '0');
        return filters.priceRanges.some((range: { min: number; max: number }) => 
          price >= range.min && price <= range.max
        );
      });
    }
    
    setFilteredPhones(results);
    setCurrentPage(1);
  }, [allPhones, searchQuery, filters]);
  
  const handleFilterChange = (newFilters: PhoneFilterState) => {
    setFilters(newFilters);
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Link
                href="/compare-select"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mr-2 dark:text-gray-300 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trở lại trang so sánh
              </Link>
            </div>
            <h1 className="text-2xl font-bold dark:text-white">Tất cả điện thoại</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {loading ? 'Đang tải dữ liệu...' : `Hiển thị ${filteredPhones.length} điện thoại`}
            </p>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg md:hidden dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-4">
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="sticky top-20">
              <PhoneFilterPanel onFilter={handleFilterChange} />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sắp xếp:</span>
                  <select 
                    className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="relevance">Liên quan nhất</option>
                    <option value="price-low">Giá: Thấp đến cao</option>
                    <option value="price-high">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá</option>
                  </select>
                </div>
              
                <div className="relative flex-1 max-w-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-600"
                  />
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Show:</span>
                  <select
                    className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div ref={phoneGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPhones.map((phone, index) => (
                <PhoneCard 
                  key={phone.id}
                  phone={phone}
                  isVisible={visibleCards[index]}
                />
              ))}
            </div>
            
            {filteredPhones.length > 0 && (
              <div className="flex items-center justify-center mt-10 space-x-2">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed dark:text-gray-600' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => changePage(pageNumber)}
                          className={`w-8 h-8 text-sm font-medium rounded-md ${currentPage === pageNumber ? 'bg-gray-900 text-white dark:bg-gray-600' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                        >
                          {pageNumber}
                        </button>
                      )
                    }
                    if ((pageNumber === 2 && currentPage > 3) || (pageNumber === totalPages - 1 && currentPage < totalPages - 2)) {
                      return <span key={pageNumber} className="text-gray-500 dark:text-gray-400">...</span>
                    }
                    return null
                  })}
                </div>
                
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed dark:text-gray-600' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {filteredPhones.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="mb-1 text-lg font-medium dark:text-white">Không tìm thấy điện thoại nào</h3>
                <p className="text-gray-600 dark:text-gray-300">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                <button onClick={() => setSearchQuery("")} className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Xóa tìm kiếm
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}