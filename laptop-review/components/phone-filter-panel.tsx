"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  ChevronDown, 
  Smartphone, 
  Database, 
  HardDrive, 
  Cpu, 
  DollarSign, 
  Monitor, 
  Battery, 
  Sliders, 
  X,
  Plus
} from "lucide-react"
import { Smartphone as SmartphoneType } from "@/types/smartphone"

const priceRanges = [
  { min: 0, max: 5000000, label: "Dưới 5 triệu" },
  { min: 5000000, max: 10000000, label: "5 - 10 triệu" },
  { min: 10000000, max: 20000000, label: "10 - 20 triệu" },
  { min: 20000000, max: 30000000, label: "20 - 30 triệu" },
  { min: 30000000, max: Infinity, label: "Trên 30 triệu" },
]

export interface PhoneFilterState {
  brands: string[];
  socTypes: string[];
  ramSizes: string[];
  storageOptions: string[];
  priceRanges: Array<{ min: number; max: number }>;
  displaySizes: string[];
  batteryLife: string[];
  features: string[];
}

interface PhoneFilterPanelProps {
  onFilter?: (filters: PhoneFilterState) => void;
  allPhones?: SmartphoneType[];
}

interface ExpandedState {
  brand: boolean;
  soc: boolean;
  ram: boolean;
  storage: boolean;
  price: boolean;
  display: boolean;
  battery: boolean;
  [key: string]: boolean;
}

export default function PhoneFilterPanel({ onFilter, allPhones }: PhoneFilterPanelProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({
    brand: true,
    soc: true,
    ram: true,
    storage: true,
    price: true,
    display: false,
    battery: false,
  })

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

  const [customRam, setCustomRam] = useState<string>('')

  const brands = ["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Google", "Asus", "Sony"]
  const socTypes = ["Apple A-series", "Snapdragon 8 Gen 3", "Snapdragon 8 Gen 2", "Snapdragon 7", "MediaTek Dimensity 9000", "MediaTek Dimensity 8000", "Exynos"]
  const ramSizes = ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"]
  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"]
  const displaySizes = ["< 6 inch", "6.1 inch", "6.4 inch", "6.7 inch", "6.8 inch", "> 6.8 inch"]
  const batteryCapacities = ["< 4000mAh", "4000-4500mAh", "4500-5000mAh", "> 5000mAh"]

  const toggleSection = (section: keyof ExpandedState) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = useCallback((filterType: keyof PhoneFilterState, value: any) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters }
      
      if (filterType === 'priceRanges') {
        const priceRange = value as { min: number; max: number }
        const index = newFilters.priceRanges.findIndex(range => range.min === priceRange.min && range.max === priceRange.max)
        
        if (index > -1) {
          newFilters.priceRanges = newFilters.priceRanges.filter((_, i) => i !== index)
        } else {
          newFilters.priceRanges = [...newFilters.priceRanges, priceRange]
        }
      } else {
        const arr = newFilters[filterType] as string[]
        if (arr.includes(value)) {
          // @ts-ignore
          newFilters[filterType] = arr.filter(item => item !== value)
        } else {
          // @ts-ignore
          newFilters[filterType] = [...arr, value]
        }
      }
      
      return newFilters
    })
  }, [])

  const handleAddCustomRam = () => {
    if (customRam && !filters.ramSizes.includes(customRam)) {
      setFilters(prev => ({
        ...prev,
        ramSizes: [...prev.ramSizes, customRam]
      }))
      setCustomRam('')
    }
  }

  useEffect(() => {
    if (onFilter) {
      onFilter(filters)
    }
  }, [filters, onFilter])

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      socTypes: [],
      ramSizes: [],
      storageOptions: [],
      priceRanges: [],
      displaySizes: [],
      batteryLife: [],
      features: [],
    })
  }

  const activeFilterCount = Object.values(filters).reduce((count, filterArray) => {
    return count + (Array.isArray(filterArray) ? filterArray.length : 0)
  }, 0)

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center dark:text-white">
          <Sliders className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Bộ lọc Điện thoại
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Xóa tất cả ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("brand")}
        >
          <span className="font-medium flex items-center">
            <Smartphone className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Thương hiệu
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.brand ? "rotate-180" : ""}`} />
        </button>

        {expanded.brand && (
          <div className="space-y-2 mt-2 max-h-48 overflow-y-auto custom-scrollbar">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleFilterChange('brands', brand)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SoC Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("soc")}
        >
          <span className="font-medium flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Vi xử lý (SoC)
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.soc ? "rotate-180" : ""}`} />
        </button>

        {expanded.soc && (
          <div className="space-y-2 mt-2 max-h-48 overflow-y-auto custom-scrollbar">
            {socTypes.map((soc) => (
              <div key={soc} className="flex items-center">
                <input
                  type="checkbox"
                  id={`soc-${soc}`}
                  checked={filters.socTypes.includes(soc)}
                  onChange={() => handleFilterChange('socTypes', soc)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`soc-${soc}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {soc}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RAM Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("ram")}
        >
          <span className="font-medium flex items-center">
            <Database className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            RAM
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.ram ? "rotate-180" : ""}`} />
        </button>

        {expanded.ram && (
          <div className="space-y-2 mt-2">
            {ramSizes.map((ram) => (
              <div key={ram} className="flex items-center">
                <input
                  type="checkbox"
                  id={`ram-${ram}`}
                  checked={filters.ramSizes.includes(ram)}
                  onChange={() => handleFilterChange('ramSizes', ram)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`ram-${ram}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {ram}
                </label>
              </div>
            ))}
            
            <div className="mt-3 flex items-center">
              <input
                type="text"
                value={customRam}
                onChange={(e) => setCustomRam(e.target.value)}
                placeholder="Nhập RAM"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <button
                onClick={handleAddCustomRam}
                className="flex items-center justify-center p-1 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 border border-transparent dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Storage Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("storage")}
        >
          <span className="font-medium flex items-center">
            <HardDrive className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Bộ nhớ
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.storage ? "rotate-180" : ""}`} />
        </button>

        {expanded.storage && (
          <div className="space-y-2 mt-2">
            {storageOptions.map((storage) => (
              <div key={storage} className="flex items-center">
                <input
                  type="checkbox"
                  id={`storage-${storage}`}
                  checked={filters.storageOptions.includes(storage)}
                  onChange={() => handleFilterChange('storageOptions', storage)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`storage-${storage}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {storage}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("price")}
        >
          <span className="font-medium flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Khoảng giá
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.price ? "rotate-180" : ""}`} />
        </button>

        {expanded.price && (
          <div className="space-y-2 mt-2">
            {priceRanges.map((range) => (
              <div key={range.label} className="flex items-center">
                <input
                  type="checkbox"
                  id={`price-${range.label}`}
                  checked={filters.priceRanges.some(r => r.min === range.min && r.max === range.max)}
                  onChange={() => handleFilterChange('priceRanges', range)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`price-${range.label}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display Size Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("display")}
        >
          <span className="font-medium flex items-center">
            <Monitor className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Kích thước màn hình
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.display ? "rotate-180" : ""}`} />
        </button>

        {expanded.display && (
          <div className="space-y-2 mt-2">
            {displaySizes.map((size) => (
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  id={`display-${size}`}
                  checked={filters.displaySizes.includes(size)}
                  onChange={() => handleFilterChange('displaySizes', size)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`display-${size}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {size}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Battery Capacity Filter */}
      <div className="mb-4 border-b dark:border-gray-700 pb-2">
        <button
          className="flex items-center justify-between w-full mb-2 text-left dark:text-white"
          onClick={() => toggleSection("battery")}
        >
          <span className="font-medium flex items-center">
            <Battery className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Dung lượng pin
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded.battery ? "rotate-180" : ""}`} />
        </button>

        {expanded.battery && (
          <div className="space-y-2 mt-2">
            {batteryCapacities.map((capacity) => (
              <div key={capacity} className="flex items-center">
                <input
                  type="checkbox"
                  id={`battery-${capacity}`}
                  checked={filters.batteryLife.includes(capacity)}
                  onChange={() => handleFilterChange('batteryLife', capacity)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor={`battery-${capacity}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {capacity}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
