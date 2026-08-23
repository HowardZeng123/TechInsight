"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { SearchIcon, Heart } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { laptopService, smartphoneService } from "@/services/firebaseServices"
import { Laptop as FirestoreLaptop } from "@/types/laptop"
import { Smartphone } from "@/types/smartphone"
import { Laptop } from "@/data/laptops"

import FilterPanel, { FilterState } from "@/components/filter-panel"
import PhoneFilterPanel, { PhoneFilterState } from "@/components/phone-filter-panel"
import BrowseLaptopsHeader from "@/components/browse-laptops-header"
import ComparisonStickyBar from "@/components/comparison/comparison-sticky-bar"
import LaptopCardSelectable from "@/components/comparison/laptop-card-selectable"
import PhoneCardSelectable from "@/components/comparison/phone-card-selectable"
import QuickViewModal from "@/components/comparison/quick-view-modal"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

const convertFirestoreLaptopToUIFormat = (laptop: FirestoreLaptop): Laptop => {
  const price = laptop.price || '';
  const salePrice = price ? parseInt(price.replace(/[^0-9]/g, "")) || 0 : 0;
  const originalPrice = laptop.originalPrice || null;
  const specs = `${laptop.specs.cpu || ''}, ${laptop.specs.ram || ''}, ${laptop.specs.storage || ''}`;
  
  return {
    id: laptop.id,
    name: laptop.name,
    specs: specs,
    rating: laptop.benchmarks?.overall || 4.5,
    reviews: 120,
    salePrice: salePrice,
    originalPrice: originalPrice,
    saveAmount: originalPrice ? (parseInt(originalPrice.replace(/[^0-9]/g, "")) - salePrice).toString() : null,
    onSale: !!originalPrice,
    greatDeal: (laptop.benchmarks?.overall || 0) > 8.5,
    image: laptop.image || "/placeholder.svg?height=600&width=600",
    detailLink: `/laptops/${laptop.id}`,
    purchaseLink: '',
  };
};

export default function CompareSelectPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const initialCategory = searchParams.get('category') === 'phone' ? 'phone' : 'laptop';
  const [activeTab, setActiveTab] = useState<'laptop' | 'phone'>(initialCategory);

  const [visibleCards, setVisibleCards] = useState<boolean[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  
  const [selectedLaptops, setSelectedLaptops] = useState<string[]>([])
  const [selectedPhones, setSelectedPhones] = useState<string[]>([])
  
  // Laptops state
  const [firestoreLaptops, setFirestoreLaptops] = useState<FirestoreLaptop[]>([])
  const [laptopData, setLaptopData] = useState<Laptop[]>([])
  const [dataSortLaptops, setDataSortLaptops] = useState<Laptop[]>([])
  
  // Phones state
  const [allPhones, setAllPhones] = useState<Smartphone[]>([])
  const [phoneDataSort, setPhoneDataSort] = useState<Smartphone[]>([])

  const [quickViewLaptop, setQuickViewLaptop] = useState<string | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState<FilterState>({
    brands: [], cpuTypes: [], ramSizes: [], storageOptions: [], priceRanges: [], displaySizes: [], batteryLife: [], features: [],
  })

  const [phoneFilters, setPhoneFilters] = useState<PhoneFilterState>({
    brands: [], socTypes: [], ramSizes: [], storageOptions: [], priceRanges: [], displaySizes: [], batteryLife: [], features: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [laptops, phones] = await Promise.all([
          laptopService.getAll(),
          smartphoneService.getAll()
        ]);

        const fireLaptops = laptops as FirestoreLaptop[];
        setFirestoreLaptops(fireLaptops);
        const convertedLaptops = fireLaptops.map(convertFirestoreLaptopToUIFormat);
        setLaptopData(convertedLaptops);
        setDataSortLaptops(convertedLaptops);

        const phoneList = phones as Smartphone[];
        setAllPhones(phoneList);
        setPhoneDataSort(phoneList);

        const maxLen = Math.max(convertedLaptops.length, phoneList.length);
        setVisibleCards(Array(maxLen).fill(false));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const currentData = activeTab === 'laptop' ? dataSortLaptops : phoneDataSort;
    if (currentData.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          currentData.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              })
            }, 100 * index)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [dataSortLaptops, phoneDataSort, activeTab])

  useEffect(() => {
    const currentId = searchParams.get('current')
    if (currentId) {
      if (initialCategory === 'laptop') {
        setSelectedLaptops([currentId])
      } else {
        setSelectedPhones([currentId])
      }
    }
  }, [searchParams, initialCategory])

  // Laptops Filter
  useEffect(() => {
    if (laptopData.length === 0) return;
    const results = laptopData.filter(uiLaptop => {
      const firestoreLaptop = firestoreLaptops.find(l => l.id === uiLaptop.id);
      if (!firestoreLaptop) return false;
      if (filters.brands.length > 0 && !filters.brands.some(brand => uiLaptop.name.toLowerCase().includes(brand.toLowerCase()))) return false;
      if (filters.cpuTypes.length > 0 && !filters.cpuTypes.some((cpu: string) => firestoreLaptop.specs.cpu?.toLowerCase().includes(cpu.toLowerCase()))) return false;
      if (filters.ramSizes.length > 0 && !filters.ramSizes.some((ram: string) => firestoreLaptop.specs.ram?.toLowerCase().includes(ram.toLowerCase()))) return false;
      if (filters.storageOptions.length > 0 && !filters.storageOptions.some((storage: string) => firestoreLaptop.specs.storage?.toLowerCase().includes(storage.toLowerCase().replace(' ssd', '')))) return false;
      if (filters.priceRanges.length > 0 && !filters.priceRanges.some(range => uiLaptop.salePrice >= range.min && uiLaptop.salePrice <= range.max)) return false;
      return true;
    });
    setDataSortLaptops(results);
  }, [filters, laptopData, firestoreLaptops]);

  // Phones Filter
  useEffect(() => {
    if (allPhones.length === 0) return;
    const results = allPhones.filter(phone => {
      if (phoneFilters.brands.length > 0 && !phoneFilters.brands.some(brand => phone.name.toLowerCase().includes(brand.toLowerCase()))) return false;
      if (phoneFilters.socTypes.length > 0 && !phoneFilters.socTypes.some((soc: string) => phone.specs.soc?.toLowerCase().includes(soc.toLowerCase()))) return false;
      if (phoneFilters.ramSizes.length > 0 && !phoneFilters.ramSizes.some((ram: string) => phone.specs.ram?.toLowerCase().includes(ram.toLowerCase()))) return false;
      if (phoneFilters.storageOptions.length > 0 && !phoneFilters.storageOptions.some((storage: string) => phone.specs.storage?.toLowerCase().includes(storage.toLowerCase().replace(' ssd', '')))) return false;
      if (phoneFilters.priceRanges.length > 0) {
        const price = parseInt(phone.price?.replace(/[^0-9]/g, '') || '0');
        if (!phoneFilters.priceRanges.some(range => price >= range.min && price <= range.max)) return false;
      }
      return true;
    });
    setPhoneDataSort(results);
  }, [phoneFilters, allPhones]);

  const toggleLaptopSelection = (id: string) => {
    if (selectedLaptops.includes(id)) setSelectedLaptops(selectedLaptops.filter(item => item !== id))
    else if (selectedLaptops.length < 2) setSelectedLaptops([...selectedLaptops, id])
    else alert("Đã chọn tối đa 2 laptop.")
  }

  const togglePhoneSelection = (id: string) => {
    if (selectedPhones.includes(id)) setSelectedPhones(selectedPhones.filter(item => item !== id))
    else if (selectedPhones.length < 2) setSelectedPhones([...selectedPhones, id])
    else alert("Đã chọn tối đa 2 điện thoại.")
  }

  const clearSelection = () => {
    if (activeTab === 'laptop') setSelectedLaptops([])
    else setSelectedPhones([])
  }

  const handleQuickView = (id: string) => {
    setQuickViewLaptop(id)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => setIsQuickViewOpen(false)

  const currentQuickViewObj = quickViewLaptop !== null 
    ? laptopData.find(laptop => laptop.id === quickViewLaptop) || null
    : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium dark:text-white">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold dark:text-white">Chọn Thiết bị để So sánh</h1>
          <p className="text-gray-600 dark:text-gray-300">Chọn tối đa 2 sản phẩm để so sánh chi tiết</p>
        </div>

        {/* Tab Switching */}
        <div className="flex justify-center mb-10">
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

        {activeTab === 'laptop' ? (
          <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <FilterPanel onFilter={setFilters} />
            </div>
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <BrowseLaptopsHeader laptopData={laptopData} handle={setDataSortLaptops} />
                <div className="px-4 py-2 ml-4 text-sm font-medium bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg">
                  Đã chọn: {selectedLaptops.length}/2 sản phẩm
                </div>
              </div>
              <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dataSortLaptops.map((laptop, index) => (
                  <LaptopCardSelectable
                    key={laptop.id}
                    laptop={laptop}
                    isSelected={selectedLaptops.includes(laptop.id.toString())}
                    onToggleSelect={(id) => toggleLaptopSelection(id.toString())}
                    isSelectionDisabled={selectedLaptops.length >= 2 && !selectedLaptops.includes(laptop.id.toString())}
                    onQuickView={(id) => handleQuickView(id.toString())}
                    isVisible={visibleCards[index]}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <PhoneFilterPanel onFilter={setPhoneFilters} />
            </div>
            <div className="lg:col-span-3">
              <div className="flex items-center justify-end mb-6">
                <div className="px-4 py-2 ml-4 text-sm font-medium bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg">
                  Đã chọn: {selectedPhones.length}/2 sản phẩm
                </div>
              </div>
              <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {phoneDataSort.map((phone, index) => (
                  <PhoneCardSelectable
                    key={phone.id}
                    phone={phone}
                    isSelected={selectedPhones.includes(phone.id)}
                    onToggleSelect={togglePhoneSelection}
                    isSelectionDisabled={selectedPhones.length >= 2 && !selectedPhones.includes(phone.id)}
                    isVisible={visibleCards[index]}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        {currentQuickViewObj && (
          <QuickViewModal
            laptop={currentQuickViewObj}
            isOpen={isQuickViewOpen}
            onClose={closeQuickView}
            onAddToCompare={(id) => toggleLaptopSelection(id.toString())}
            isInCompareList={selectedLaptops.includes(currentQuickViewObj.id.toString())}
            isCompareDisabled={selectedLaptops.length >= 2 && !selectedLaptops.includes(currentQuickViewObj.id.toString())}
          />
        )}
      </main>

      {/* Comparison Sticky Bar */}
      {(activeTab === 'laptop' && selectedLaptops.length > 0) && (
        <ComparisonStickyBar
          selectedIds={selectedLaptops}
          itemsData={laptopData}
          onRemove={toggleLaptopSelection}
          onClearAll={clearSelection}
          maxSelections={2}
          category="laptop"
        />
      )}
      {(activeTab === 'phone' && selectedPhones.length > 0) && (
        <ComparisonStickyBar
          selectedIds={selectedPhones}
          itemsData={allPhones}
          onRemove={togglePhoneSelection}
          onClearAll={clearSelection}
          maxSelections={2}
          category="phone"
        />
      )}

      <Footer />
    </div>
  )
}