"use client"

import { useState } from 'react'
import { Smartphone } from '@/types/smartphone'
import Image from 'next/image'

interface PhoneCardSelectableProps {
  phone: Smartphone
  isSelected: boolean
  onToggleSelect: (id: string) => void
  isSelectionDisabled: boolean
  isVisible?: boolean
}

export default function PhoneCardSelectable({
  phone,
  isSelected,
  onToggleSelect,
  isSelectionDisabled,
  isVisible = true
}: PhoneCardSelectableProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm transition-all duration-500 ease-in-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        ${isSelected ? 'border-blue-400 ring-2 ring-blue-100 dark:ring-blue-800' : 'hover:shadow-md hover:-translate-y-1'} 
        relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-2 right-2 z-10">
        <input 
          type="checkbox" 
          id={`compare-${phone.id}`}
          checked={isSelected}
          onChange={() => onToggleSelect(phone.id)}
          disabled={isSelectionDisabled && !isSelected}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-400 dark:bg-gray-600 dark:checked:bg-blue-500 dark:focus:ring-blue-400"
        />
        <label htmlFor={`compare-${phone.id}`} className="sr-only">Chọn để so sánh</label>
      </div>

      <div className="p-4">
        <div className="relative w-full h-40 mb-4 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md">
          {phone.image ? (
            <Image src={phone.image} alt={phone.name || "Phone image"} fill style={{objectFit: 'contain'}} className="p-2"/>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-300">{phone.name}</div>
          )}
        </div>

        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <svg key={j} className={`w-4 h-4 ${j < Math.floor(phone.benchmarks?.overall || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{phone.benchmarks?.overall ? phone.benchmarks.overall.toFixed(1) : "N/A"}</span>
        </div>
        <h3 className="mb-1 font-semibold dark:text-white line-clamp-2">{phone.name}</h3>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{phone.specs.soc}, {phone.specs.ram}, {phone.specs.storage}</p>

        <div className="mt-2 flex flex-col justify-end">
          <div className="flex gap-2 mb-2">
            {phone.originalPrice && phone.originalPrice !== phone.price && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-md">Giảm giá</span>
            )}
          </div>          
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold dark:text-white">{phone.price}</span>
            {phone.originalPrice && phone.originalPrice !== phone.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{phone.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
