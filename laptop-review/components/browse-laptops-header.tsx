"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"

// Định nghĩa lại kiểu dữ liệu phù hợp với trang chính
interface Laptop {
  id: string | number;
  name: string;
  specs: string;
  rating: number;
  reviews: number;
  salePrice: number;
  originalPrice: string | null;
  saveAmount: string | null;
  onSale: boolean;
  greatDeal: boolean;
  image: string;
  detailLink: string;
}

interface BrowseLaptopsHeaderProps {
  laptopData: Laptop[];
  handle: (newList: Laptop[]) => void;
}

export default function BrowseLaptopsHeader({ laptopData, handle }: BrowseLaptopsHeaderProps) {
    const [priceDropdownOpen, setPriceDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setPriceDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Add animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (headerRef.current) {
            observer.observe(headerRef.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

 
    
    return (
        <div
            ref={headerRef}
            className={`flex flex-col sm:flex-row sm:items-center justify-between mb-8 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <h2 className="text-3xl font-bold mb-5 sm:mb-0 dark:text-white">Tìm kiếm laptop</h2>

            <div className="flex gap-4">
                <button
                    className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-gray-700 transition-all flex items-center whitespace-nowrap bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-white hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-700"
                    onClick={()=> {
                        const cloneLaptopData = laptopData.slice()
                        const newList = cloneLaptopData.sort((a: Laptop, b: Laptop) => b.salePrice - a.salePrice)
                         handle(newList)
                    }}
                >
                    <ArrowDownWideNarrow className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Giá cao đến thấp
                </button>

                <button
                    className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-gray-700 transition-all flex items-center whitespace-nowrap bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-white hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-700"
                    onClick={()=> {
                        const cloneLaptopData = laptopData.slice()
                        const newList = cloneLaptopData.sort((a: Laptop, b: Laptop) => a.salePrice - b.salePrice)
                         handle(newList)
                    }}
                >
                    <ArrowUpWideNarrow className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Giá thấp đến cao
                </button>
            </div>
        </div>
    )
}
