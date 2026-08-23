"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon, Heart } from "lucide-react"
import { laptopService, smartphoneService } from "@/services/firebaseServices"
import { Laptop } from "@/types/laptop"
import { Smartphone } from "@/types/smartphone"

import LatestNews from "@/components/latest-news"
import ArticleHighlights from "@/components/article-highlights"
import FilterPanel, { FilterState } from "@/components/filter-panel"
import PhoneFilterPanel, { PhoneFilterState } from "@/components/phone-filter-panel"
import RecommendedSection from "@/components/recommended-section"
import NotificationBell from "@/components/notification-bell"
import BrowseLaptopsHeader from "@/components/browse-laptops-header"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PhoneCard from "@/components/phone-card"
import Head from 'next/head'

const ITEMS_PER_HOMEPAGE = 9;

export default function Home() {
  const [activeTab, setActiveTab] = useState<'laptop' | 'phone'>('laptop');
  
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [visiblePhoneCards, setVisiblePhoneCards] = useState<boolean[]>([]);
  
  const laptopGridRef = useRef<HTMLDivElement>(null)
  const phoneGridRef = useRef<HTMLDivElement>(null)
  
  const [user, setUser] = useState<{ email: string; username: string; avatar: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const maxScrollsAllowed = 5;
  const scrollThrottleRef = useRef(false);
  const hasShownPromptRef = useRef(false);
  
  const [filters, setFilters] = useState<FilterState>({
    brands: [], cpuTypes: [], ramSizes: [], storageOptions: [], priceRanges: [], displaySizes: [], batteryLife: [], features: [],
  })

  const [phoneFilters, setPhoneFilters] = useState<PhoneFilterState>({
    brands: [], socTypes: [], ramSizes: [], storageOptions: [], priceRanges: [], displaySizes: [], batteryLife: [], features: [],
  })

  const [allLaptops, setAllLaptops] = useState<Laptop[]>([]);
  const [filteredData, setFilteredData] = useState<Laptop[]>([]) 
  const [dataSort, setDataSort] = useState<Laptop[]>([])
  
  const [allPhones, setAllPhones] = useState<Smartphone[]>([]);
  const [filteredPhones, setFilteredPhones] = useState<Smartphone[]>([]) 
  const [phoneDataSort, setPhoneDataSort] = useState<Smartphone[]>([])

  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!user;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [laptops, phones] = await Promise.all([
          laptopService.getAll(),
          smartphoneService.getAll()
        ]);
        
        setAllLaptops(laptops as Laptop[]);
        setFilteredData(laptops as Laptop[]);
        setDataSort((laptops as Laptop[]).slice(0, ITEMS_PER_HOMEPAGE));
        setVisibleCards(Array((laptops as Laptop[]).slice(0, ITEMS_PER_HOMEPAGE).length).fill(false));
        
        setAllPhones(phones as Smartphone[]);
        setFilteredPhones(phones as Smartphone[]);
        setPhoneDataSort((phones as Smartphone[]).slice(0, ITEMS_PER_HOMEPAGE));
        setVisiblePhoneCards(Array((phones as Smartphone[]).slice(0, ITEMS_PER_HOMEPAGE).length).fill(false));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'laptop') {
      if (dataSort.length === 0) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            dataSort.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => {
                  const currentDisplayLength = dataSort.length;
                  const newState = prev.length === currentDisplayLength ? [...prev] : Array(currentDisplayLength).fill(false);
                  if (index < newState.length) {
                    newState[index] = true;
                  }
                  return newState;
                })
              }, 100 * index)
            })
            if (laptopGridRef.current) observer.unobserve(laptopGridRef.current);
          }
        }, { threshold: 0.1 }
      )
      if (laptopGridRef.current) observer.observe(laptopGridRef.current)
      return () => observer.disconnect()
    } else {
      if (phoneDataSort.length === 0) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            phoneDataSort.forEach((_, index) => {
              setTimeout(() => {
                setVisiblePhoneCards(prev => {
                  const currentDisplayLength = phoneDataSort.length;
                  const newState = prev.length === currentDisplayLength ? [...prev] : Array(currentDisplayLength).fill(false);
                  if (index < newState.length) {
                    newState[index] = true;
                  }
                  return newState;
                })
              }, 100 * index)
            })
            if (phoneGridRef.current) observer.unobserve(phoneGridRef.current);
          }
        }, { threshold: 0.1 }
      )
      if (phoneGridRef.current) observer.observe(phoneGridRef.current)
      return () => observer.disconnect()
    }
  }, [dataSort, phoneDataSort, activeTab])
  
  function handleSort(newListData: Laptop[]) {
    setFilteredData(newListData);
    setDataSort(newListData.slice(0, ITEMS_PER_HOMEPAGE));
  }
  
  useEffect(() => {
    if (isLoggedIn || hasShownPromptRef.current) return;
    
    const handleScroll = () => {
      if (scrollCount >= maxScrollsAllowed) {
        setShowLoginPrompt(true);
        hasShownPromptRef.current = true;
        return;
      }
      
      if (scrollThrottleRef.current) return;
      
      scrollThrottleRef.current = true;
      setTimeout(() => {
        scrollThrottleRef.current = false;
      }, 1000);
      
      setScrollCount(prev => {
        const newCount = Math.min(prev + 1, maxScrollsAllowed);
        if (newCount >= maxScrollsAllowed && !hasShownPromptRef.current) {
          setShowLoginPrompt(true);
          hasShownPromptRef.current = true;
        }
        return newCount;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoggedIn, scrollCount, maxScrollsAllowed]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowLoginPrompt(false);
    }
  }, [isLoggedIn]);
  
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // Laptops filter logic
  useEffect(() => {
    if (allLaptops.length === 0) return;
    let results = [...allLaptops];
    
    if (filters.brands.length > 0) {
      results = results.filter(laptop => {
        const laptopName = laptop.name.toLowerCase();
        return filters.brands.some(brand => laptopName.includes(brand.toLowerCase()));
      });
    }
    if (filters.cpuTypes.length > 0) {
      results = results.filter(laptop => filters.cpuTypes.some((cpuType: string) => laptop.specs.cpu.toLowerCase().includes(cpuType.toLowerCase())));
    }
    if (filters.ramSizes.length > 0) {
      results = results.filter(laptop => filters.ramSizes.some((ramSize: string) => laptop.specs.ram.toLowerCase().includes(ramSize.toLowerCase())));
    }
    if (filters.storageOptions.length > 0) {
      results = results.filter(laptop => filters.storageOptions.some((storageOption: string) => laptop.specs.storage.toLowerCase().includes(storageOption.toLowerCase().replace(' ssd', ''))));
    }
    if (filters.priceRanges.length > 0) {
      results = results.filter(laptop => {
        const price = parseInt(laptop.price?.replace(/[^0-9]/g, '') || '0');
        return filters.priceRanges.some(range => price >= range.min && price <= range.max);
      });
    }
    if (filters.displaySizes.length > 0) {
      results = results.filter(laptop => filters.displaySizes.some(size => {
        const displayText = laptop.specs.display.toLowerCase();
        const sizeValue = size.replace('"', '').toLowerCase();
        return displayText.includes(sizeValue + '"') || displayText.includes(sizeValue + ' inch');
      }));
    }
    setFilteredData(results);
    setDataSort(results.slice(0, ITEMS_PER_HOMEPAGE));
  }, [filters, allLaptops]);
  
  // Phones filter logic
  useEffect(() => {
    if (allPhones.length === 0) return;
    let results = [...allPhones];
    
    if (phoneFilters.brands.length > 0) {
      results = results.filter(phone => {
        const phoneName = phone.name.toLowerCase();
        return phoneFilters.brands.some(brand => phoneName.includes(brand.toLowerCase()));
      });
    }
    if (phoneFilters.socTypes.length > 0) {
      results = results.filter(phone => phoneFilters.socTypes.some(soc => phone.specs.soc?.toLowerCase().includes(soc.toLowerCase())));
    }
    if (phoneFilters.ramSizes.length > 0) {
      results = results.filter(phone => phoneFilters.ramSizes.some(ramSize => phone.specs.ram?.toLowerCase().includes(ramSize.toLowerCase())));
    }
    if (phoneFilters.storageOptions.length > 0) {
      results = results.filter(phone => phoneFilters.storageOptions.some(storageOption => phone.specs.storage?.toLowerCase().includes(storageOption.toLowerCase().replace(' ssd', ''))));
    }
    if (phoneFilters.priceRanges.length > 0) {
      results = results.filter(phone => {
        const price = parseInt(phone.price?.replace(/[^0-9]/g, '') || '0');
        return phoneFilters.priceRanges.some(range => price >= range.min && price <= range.max);
      });
    }
    
    setFilteredPhones(results);
    setPhoneDataSort(results.slice(0, ITEMS_PER_HOMEPAGE));
  }, [phoneFilters, allPhones]);

  const handleFilterChange = (newFilters: FilterState) => setFilters(newFilters);
  const handlePhoneFilterChange = (newFilters: PhoneFilterState) => setPhoneFilters(newFilters);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div className="text-center">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Tiếp tục đọc với TechInsight</h3>
              <div className="w-full h-2 mb-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min((scrollCount / maxScrollsAllowed) * 100, 100)}%` }}/>
              </div>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Bạn đã xài {scrollCount}/{maxScrollsAllowed} lượt miễn phí</p>
              <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Đăng nhập</Link>
                <Link href="/register" className="w-full px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50">Tạo tài khoản</Link>
                {scrollCount < maxScrollsAllowed && (
                  <button onClick={handleCloseLoginPrompt} className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Để sau</button> 
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className={`container px-4 py-8 mx-auto transition-all ${showLoginPrompt ? 'filter blur-sm' : ''}`}>
        <section className="mb-12">
          <LatestNews />
          <div className="flex justify-center mt-6">
            <Link href="/all-news" className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
              Xem tất cả tin tức
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold dark:text-white">Gợi ý dành cho bạn</h2>
          <RecommendedSection />
        </section>

        {/* Tab Switching */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
            <button
              className={`px-8 py-3 rounded-md font-medium text-sm transition-colors ${activeTab === 'laptop' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              onClick={() => setActiveTab('laptop')}
            >
              Laptop
            </button>
            <button
              className={`px-8 py-3 rounded-md font-medium text-sm transition-colors ${activeTab === 'phone' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              onClick={() => setActiveTab('phone')}
            >
              Điện thoại
            </button>
          </div>
        </div>

        {/* Filter and Results */}
        {activeTab === 'laptop' ? (
          <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <FilterPanel onFilter={handleFilterChange} />
            </div>
            <div className="lg:col-span-3 relative z-0">
              <BrowseLaptopsHeader laptopData={filteredData} handle={handleSort} />
            
              <div ref={laptopGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-0">
                {loading ? (
                  <div className="col-span-3 flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : dataSort.length === 0 ? (
                  <div className="col-span-3 text-center py-20">
                    <p className="text-gray-600 dark:text-gray-300">Không tìm thấy laptop nào phù hợp với bộ lọc.</p>
                  </div>
                ) : (
                  dataSort.map((laptop, index) => (
                    <div 
                      key={laptop.id} 
                      className={`overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm transition-all duration-500 ease-in-out ${
                        visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      } hover:shadow-md hover:-translate-y-1 flex flex-col`}
                    >
                      <div className="p-4 flex flex-col flex-grow">
                        <Link href={`/laptops/${laptop.id}`}>
                          <div className="w-full h-40 mb-4 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md relative">
                            {laptop.image ? (
                                <Image src={laptop.image} alt={laptop.name || "Laptop image"} fill style={{objectFit: 'contain'}} className="p-2"/>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-300 p-2 text-center">{laptop.name}</div>
                            )}
                          </div>
                        </Link>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <svg key={j} className={`w-4 h-4 ${j < Math.floor(laptop.benchmarks?.overall || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{laptop.benchmarks?.overall ? laptop.benchmarks.overall.toFixed(1) : "N/A"}</span>
                        </div>
                        <Link href={`/laptops/${laptop.id}`}>
                          <h3 className="mb-1 text-lg font-semibold hover:text-blue-600 dark:text-white dark:hover:text-blue-400 line-clamp-2">{laptop.name}</h3>
                        </Link>
                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{laptop.specs.cpu}, {laptop.specs.ram}, {laptop.specs.storage}</p>
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2 h-12 items-start">
                            {laptop.price !== laptop.originalPrice && (
                              <span className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-md">Giảm giá</span>
                            )}
                            {(laptop.benchmarks?.value !== undefined && laptop.benchmarks.value > 8.5) && (
                              <span className="px-2 py-1 text-xs font-medium text-white bg-blue-800 rounded-md">Được yêu thích nhất</span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold dark:text-white">{laptop.price}</span>
                            {laptop.originalPrice && laptop.price !== laptop.originalPrice && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{laptop.originalPrice}</span>
                            )}
                          </div>
                          <div className="mt-2">
                            <Link href={`/compare-select?current=${laptop.id}`} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 w-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              So sánh
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-center mt-10 mb-6">
                <Link href="/all-laptops" className="px-8 py-3 text-base font-medium text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-sm flex items-center hover:shadow-md hover:-translate-y-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                  Nhiều hơn nữa
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <PhoneFilterPanel onFilter={handlePhoneFilterChange} />
            </div>
            <div className="lg:col-span-3 relative z-0">
              {/* Phone Grid with animation */}
              <div ref={phoneGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-0 mt-6">
                {loading ? (
                  <div className="col-span-3 flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : phoneDataSort.length === 0 ? (
                  <div className="col-span-3 text-center py-20">
                    <p className="text-gray-600 dark:text-gray-300">Không tìm thấy điện thoại nào phù hợp với bộ lọc.</p>
                  </div>
                ) : (
                  phoneDataSort.map((phone, index) => (
                    <PhoneCard 
                      key={phone.id} 
                      phone={phone} 
                      isVisible={visiblePhoneCards[index]} 
                    />
                  ))
                )}
              </div>

              <div className="flex justify-center mt-10 mb-6">
                <Link href="/all-phones" className="px-8 py-3 text-base font-medium text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-sm flex items-center hover:shadow-md hover:-translate-y-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                  Nhiều điện thoại hơn
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold dark:text-white">BÀI VIẾT MỚI NHẤT</h2>
          <ArticleHighlights />
        </section>
        <div className="flex justify-center mt-10 mb-6">
          <Link href="/all-articles" className="px-8 py-3 text-base font-medium text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-sm flex items-center hover:shadow-md hover:-translate-y-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
            Đọc Thêm
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
