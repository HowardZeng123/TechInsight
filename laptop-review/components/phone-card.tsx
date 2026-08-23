"use client"

import Image from "next/image"
import Link from "next/link"
import { Smartphone } from "@/types/smartphone"

interface PhoneCardProps {
  phone: Smartphone;
  isVisible?: boolean;
}

export default function PhoneCard({ phone, isVisible = true }: PhoneCardProps) {
  return (
    <div 
      className={`overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } hover:shadow-md hover:-translate-y-1 flex flex-col`}
    >
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/phones/${phone.id}`}>
          <div className="w-full h-40 mb-4 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-md relative">
            {phone.image ? (
                <Image 
                    src={phone.image} 
                    alt={phone.name || "Phone image"}
                    fill
                    style={{objectFit: 'contain'}}
                    className="p-2"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-300 p-2 text-center">
                    {phone.name}
                </div>
            )}
          </div>
        </Link>

        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <svg key={j} className={`w-4 h-4 ${j < Math.floor(phone.benchmarks?.overall || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            {phone.benchmarks?.overall ? phone.benchmarks.overall.toFixed(1) : "N/A"}
          </span>
        </div>
        
        <Link href={`/phones/${phone.id}`}>
          <h3 className="mb-1 text-lg font-semibold hover:text-blue-600 dark:text-white dark:hover:text-blue-400 line-clamp-2">{phone.name}</h3>
        </Link>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {phone.specs.soc}, {phone.specs.ram}, {phone.specs.storage}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2 h-12 items-start">
            {phone.price !== phone.originalPrice && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-md">
                Giảm giá
              </span>
            )}
            {(phone.benchmarks?.value !== undefined && phone.benchmarks.value > 8.5) && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-blue-800 rounded-md">
                Được yêu thích
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold dark:text-white">{phone.price}</span>
            {phone.originalPrice && phone.price !== phone.originalPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{phone.originalPrice}</span>
            )}
          </div>

          <div className="mt-2">
            <Link href={`/compare-select?category=phone&current=${phone.id}`} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              So sánh
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
