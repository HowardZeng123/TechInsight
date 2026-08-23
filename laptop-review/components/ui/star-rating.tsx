"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating: number
  onRatingChange?: (rating: number) => void
}

export default function StarRating({ rating, maxRating = 10, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  // Calculate how many stars to show based on the rating
  // For a 10-star system, we'll show 10 stars
  const stars = Array.from({ length: 10 }, (_, i) => i + 1)

  // Convert rating to a 10-star scale
  const normalizedRating = (rating / maxRating) * 10

  return (
    <div className="flex">
      {stars.map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= (hoverRating || normalizedRating) ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground"
          }`}
          onMouseEnter={() => setHoverRating((star / 10) * maxRating)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange?.((star / 10) * maxRating)}
        />
      ))}
    </div>
  )
}
