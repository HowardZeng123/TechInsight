"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

interface Laptop {
  id: number
  name: string
  image: string
  description: string
  price: string
}

export default function FavoritesSection(): React.ReactNode {
  // In a real app, this would be fetched from Firebase Firestore
  const [favorites, setFavorites] = useState<Laptop[]>([
    {
      id: 1,
      name: "MacBook Pro 16",
      image: "/placeholder.svg",
      description: "M3 Max, 32GB RAM, 1TB SSD",
      price: "$2,999",
    },
    {
      id: 2,
      name: "Dell XPS 15",
      image: "/placeholder.svg",
      description: "Intel Core i9, 32GB RAM, 1TB SSD",
      price: "$2,199",
    },
  ])

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id))
  }

  if (!isLoggedIn) {
    return (
      <div className="p-8 text-center bg-white border rounded-lg shadow-sm">
        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="mb-2 text-lg font-medium">Your favorites will appear here</h3>
        <p className="mb-4 text-sm text-gray-500">
          Sign in to save your favorite laptops and access them from any device.
        </p>
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="p-8 text-center bg-white border rounded-lg shadow-sm">
        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="mb-2 text-lg font-medium">No favorites yet</h3>
        <p className="mb-4 text-sm text-gray-500">
          Browse laptops and click the heart icon to add them to your favorites.
        </p>
        <Link href="/" className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
          Browse Laptops
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {favorites.map((laptop) => (
        <div key={laptop.id} className="relative overflow-hidden bg-white border rounded-lg shadow-sm group">
          <button
            onClick={() => removeFavorite(laptop.id)}
            className="absolute z-10 p-1.5 text-gray-500 bg-white rounded-full shadow-sm top-2 right-2 hover:text-red-500"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
          <Link href={`/laptops/${laptop.id}`}>
            <div className="relative h-40">
              <Image
                src={laptop.image || "/placeholder.svg"}
                alt={laptop.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="mb-1 text-sm font-medium">{laptop.name}</h3>
              <p className="mb-2 text-xs text-gray-500">{laptop.description}</p>
              <p className="text-sm font-bold">{laptop.price}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
