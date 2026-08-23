"use client"

import { useState } from 'react'
import { Laptop } from '@/data/laptops'
import { Check, Search } from 'lucide-react'

interface CompareLaptopSelectorProps {
  laptops: Laptop[]
  selectedLaptops: number[]
  onToggleSelection: (id: number) => void
  maxSelections?: number
}

export default function CompareLaptopSelector({
  laptops,
  selectedLaptops,
  onToggleSelection,
  maxSelections = 2
}: CompareLaptopSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter laptops based on search query
  const filteredLaptops = searchQuery.trim() === '' 
    ? laptops 
    : laptops.filter(laptop => 
        laptop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.specs.toLowerCase().includes(searchQuery.toLowerCase())
      )

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm laptop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Chọn để so sánh</h3>
        <div className="text-sm text-gray-600">
          Đã chọn: <span className="font-medium">{selectedLaptops.length}/{maxSelections}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredLaptops.map((laptop) => (
          <div
            key={laptop.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              selectedLaptops.includes(laptop.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
            }`}
            onClick={() => onToggleSelection(laptop.id)}
          >
            <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{laptop.name}</p>
              <p className="text-xs text-gray-500 truncate">{laptop.specs}</p>
            </div>
            <div className="ml-2">
              {selectedLaptops.includes(laptop.id) ? (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className={`w-6 h-6 border-2 rounded-full border-gray-300 ${selectedLaptops.length >= maxSelections ? 'opacity-50' : ''}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLaptops.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          <p>Không tìm thấy laptop phù hợp</p>
        </div>
      )}
    </div>
  )
} 