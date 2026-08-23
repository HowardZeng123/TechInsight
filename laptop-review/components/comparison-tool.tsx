"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"


//use for a different page later

export default function ComparisonTool() {
  const [selectedLaptops, setSelectedLaptops] = useState([
    {
      id: 1,
      name: "MacBook Pro 16",
      image: "/placeholder.svg",
      processor: "Apple M3 Max",
      ram: "32GB",
      storage: "1TB SSD",
      display: "16-inch Liquid Retina XDR",
      gpu: "Apple M3 Max (38-core)",
      battery: "Up to 22 hours",
      weight: "4.8 lbs",
      price: "$2,999",
    },
    {
      id: 2,
      name: "Dell XPS 15",
      image: "/placeholder.svg",
      processor: "Intel Core i9-13900H",
      ram: "32GB",
      storage: "1TB SSD",
      display: "15.6-inch 4K OLED",
      gpu: "NVIDIA RTX 4070",
      battery: "Up to 12 hours",
      weight: "4.2 lbs",
      price: "$2,199",
    },
  ])

  const removeLaptop = (id: number) => {
    setSelectedLaptops(selectedLaptops.filter((laptop) => laptop.id !== id))
  }

  const specs = [
    { name: "Processor", key: "processor" },
    { name: "RAM", key: "ram" },
    { name: "Storage", key: "storage" },
    { name: "Display", key: "display" },
    { name: "GPU", key: "gpu" },
    { name: "Battery", key: "battery" },
    { name: "Weight", key: "weight" },
    { name: "Price", key: "price" },
  ] as const

  return (
    <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Specification
              </th>
              {selectedLaptops.map((laptop) => (
                <th
                  key={laptop.id}
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  <div className="flex items-center justify-between">
                    <span>{laptop.name}</span>
                    <button
                      onClick={() => removeLaptop(laptop.id)}
                      className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
              {selectedLaptops.length < 3 && (
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  <button className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    + Add Laptop
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">Image</td>
              {selectedLaptops.map((laptop) => (
                <td key={laptop.id} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <div className="relative w-24 h-24">
                    <Image
                      src={laptop.image || "/placeholder.svg"}
                      alt={laptop.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </td>
              ))}
              {selectedLaptops.length < 3 && <td></td>}
            </tr>

            {specs.map((spec) => (
              <tr key={spec.key}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{spec.name}</td>
                {selectedLaptops.map((laptop) => (
                  <td key={laptop.id} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {laptop[spec.key]}
                  </td>
                ))}
                {selectedLaptops.length < 3 && <td></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
