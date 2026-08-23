import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Tag, User } from "lucide-react"

interface Review {
  id: number
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  tags: string[]
}

export default function ReviewsSection(): React.ReactNode {
  const reviews: Review[] = [
    {
      id: 1,
      title: "MacBook Pro 16 (M3 Max) Review: The Ultimate Creator Laptop",
      excerpt: "Apple's latest flagship laptop sets new standards for performance and battery life.",
      image: "/placeholder.svg",
      author: "Alex Johnson",
      date: "April 18, 2025",
      tags: ["Apple", "MacBook", "Creator"],
    },
    {
      id: 2,
      title: "Dell XPS 15 (2025) Review: Still the Windows Laptop to Beat",
      excerpt: "Dell's flagship continues to impress with its stunning design and powerful performance.",
      image: "/placeholder.svg",
      author: "Sarah Chen",
      date: "April 15, 2025",
      tags: ["Dell", "XPS", "Windows"],
    },
    {
      id: 3,
      title: "ASUS ROG Zephyrus G14 Review: Compact Gaming Powerhouse",
      excerpt: "This 14-inch gaming laptop packs a serious punch without the bulk.",
      image: "/placeholder.svg",
      author: "Michael Rodriguez",
      date: "April 10, 2025",
      tags: ["ASUS", "Gaming", "Portable"],
    },
  ]

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Link key={review.id} href={`/reviews/${review.id}`} className="block group">
          <div className="overflow-hidden transition-all duration-200 bg-white border rounded-lg shadow-sm group-hover:shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full h-48 md:w-1/3">
                <Image
                  src={review.image || "/placeholder.svg"}
                  alt={review.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-gray-700">{review.title}</h3>
                <p className="mb-4 text-gray-600">{review.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {review.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {review.date}
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="w-4 h-4" />
                    {review.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <div className="text-center">
        <Link
          href="/reviews"
          className="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          View All Reviews
        </Link>
      </div>
    </div>
  )
}
