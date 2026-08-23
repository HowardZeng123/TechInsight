"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { searchLaptops } from "@/mock_data/data"

interface Laptop {
  id: string
  name: string
  image: string
  specs: {
    cpu: string
    gpu: string
  }
}

interface LaptopComparisonSelectorProps {
  currentLaptopId: string
}

export default function LaptopComparisonSelector({ currentLaptopId }: LaptopComparisonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Laptop[]>([])
  const [selectedLaptops, setSelectedLaptops] = useState<Laptop[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Update the useEffect to set the current laptop as selected by default
  // and make it non-removable
  useEffect(() => {
    const currentLaptop = searchLaptops("").find((laptop) => laptop.id === currentLaptopId)
    if (currentLaptop) {
      setSelectedLaptops([currentLaptop])
    }
  }, [currentLaptopId])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const results = searchLaptops(searchQuery).filter(
      (laptop) => !selectedLaptops.some((selected) => selected.id === laptop.id),
    )
    setSearchResults(results)
  }, [searchQuery, selectedLaptops])

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  // Add laptop to comparison
  const addLaptop = (laptop: Laptop) => {
    if (selectedLaptops.length < 4 && !selectedLaptops.some((selected) => selected.id === laptop.id)) {
      setSelectedLaptops([...selectedLaptops, laptop])
      setSearchQuery("")
      setSearchResults([])
    }
  }

  // Also update the removeLaptop function to prevent removing the current laptop:
  const removeLaptop = (laptopId: string) => {
    if (laptopId !== currentLaptopId) {
      setSelectedLaptops(selectedLaptops.filter((laptop) => laptop.id !== laptopId))
    }
  }

  // Navigate to comparison page
  const goToComparison = () => {
    if (selectedLaptops.length >= 2) {
      const laptopIds = selectedLaptops.map((laptop) => laptop.id).join("-vs-")
      router.push(`/compare/${laptopIds}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Compare with other laptops</h2>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded flex items-center justify-center"
        >
          <span>Compare this laptop with others</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLaptops.map((laptop) => (
              <div key={laptop.id} className="flex items-center bg-gray-100 rounded-full pl-2 pr-1 py-1">
                <span className="text-sm font-medium mr-1">{laptop.name}</span>
                {laptop.id !== currentLaptopId && (
                  <button
                    onClick={() => removeLaptop(laptop.id)}
                    className="w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {selectedLaptops.length < 4 && (
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for laptops to compare..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onClick={() => setIsDropdownOpen(true)}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isDropdownOpen && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((laptop) => (
                    <div
                      key={laptop.id}
                      onClick={() => {
                        addLaptop(laptop)
                        setIsDropdownOpen(false)
                      }}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                        <Image
                          src={laptop.image || "/placeholder.svg"}
                          alt={laptop.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{laptop.name}</div>
                        <div className="text-xs text-gray-500">
                          {laptop.specs.cpu} • {laptop.specs.gpu}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800 font-medium">
              Cancel
            </button>
            <button
              onClick={goToComparison}
              disabled={selectedLaptops.length < 2}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded ${
                selectedLaptops.length < 2 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Compare {selectedLaptops.length} Laptops
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
