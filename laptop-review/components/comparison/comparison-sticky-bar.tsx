"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

interface ComparisonStickyBarProps {
  selectedIds: (number | string)[]
  itemsData: any[] // Array of Laptop or Smartphone
  onRemove: (id: number | string) => void
  onClearAll: () => void
  maxSelections?: number
  category?: 'laptop' | 'phone'
}

export default function ComparisonStickyBar({
  selectedIds,
  itemsData,
  onRemove,
  onClearAll,
  maxSelections = 2,
  category = 'laptop'
}: ComparisonStickyBarProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  // Get selected items
  const selectedItems = itemsData.filter(item => 
    selectedIds.includes(item.id)
  )
  
  // Calculate comparison URL
  const comparisonUrl = selectedIds.length >= 2 
    ? `/compare/${selectedIds.join('-vs-')}?category=${category}` 
    : "#"
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (selectedIds.length === 0) return null
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-md transform transition-transform duration-300 ${
        isMounted ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container flex items-center justify-between p-4 mx-auto">
        <div className="flex items-center gap-4">
          <span className="font-medium dark:text-white">Đã chọn: {selectedIds.length}/{maxSelections}</span>
          <div className="flex gap-3">
            {selectedItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <span className="text-sm font-medium dark:text-white line-clamp-1 max-w-[150px]">{item.name}</span>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onClearAll}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Xóa tất cả
          </button>
          
          <Link
            href={comparisonUrl}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors ${
              selectedIds.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
            }`}
            onClick={e => {
              if (selectedIds.length < 2) {
                e.preventDefault()
              }
            }}
          >
            So sánh ngay
          </Link>
        </div>
      </div>
    </div>
  )
}