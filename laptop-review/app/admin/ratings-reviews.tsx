"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import StarRating from "@/components/ui/star-rating"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

type RatingsReviewsProps = {
  onChange?: (ratings: typeof ratings, descriptions: typeof descriptions, images: typeof images) => void
}

export default function RatingsReviews({ onChange }: RatingsReviewsProps) {
  const [ratings, setRatings] = useState({
    designWeight: 5,
    monitor: 5,
    keyboard: 5,
    touchPad: 5,
    speaker: 5,
    webcam: 5,
    ports: 5,
  })

  const [descriptions, setDescriptions] = useState({
    designWeight: "",
    monitor: "",
    keyboard: "",
    touchPad: "",
    speaker: "",
    webcam: "",
    ports: "",
  })

  const [images, setImages] = useState({
    designWeight: null as File | null,
    monitor: null as File | null,
    keyboard: null as File | null,
    touchPad: null as File | null,
    speaker: null as File | null,
    webcam: null as File | null,
    ports: null as File | null,
  })

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }))

    if (onChange) {
      onChange(
        {
          ...ratings,
          [category]: value,
        },
        descriptions,
        images,
      )
    }
  }

  const handleDescriptionChange = (category: keyof typeof descriptions, value: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [category]: value,
    }))

    // Call the onChange prop whenever ratings, descriptions, or images change
    if (onChange) {
      onChange(
        ratings,
        {
          ...descriptions,
          [category]: value,
        },
        images,
      )
    }
  }

  const handleImageUpload = (category: keyof typeof images, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImages((prev) => ({
        ...prev,
        [category]: e.target.files![0],
      }))

      if (onChange) {
        onChange(ratings, descriptions, {
          ...images,
          [category]: e.target.files![0],
        })
      }
    }
  }

  const handleRemoveImage = (category: keyof typeof images) => {
    setImages((prev) => ({
      ...prev,
      [category]: null,
    }))

    if (onChange) {
      onChange(ratings, descriptions, {
        ...images,
        [category]: null,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Ratings & Reviews</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Rate each category from 1 to 10 and provide a brief description
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="design-weight">Design and Weight</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="design-weight"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.designWeight}
                    onChange={(e) => handleRatingChange("designWeight", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.designWeight}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("designWeight", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the design and weight..."
                className="min-h-[100px]"
                value={descriptions.designWeight}
                onChange={(e) => handleDescriptionChange("designWeight", e.target.value)}
              />
              
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="keyboard-rating">Keyboard</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="keyboard-rating"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.keyboard}
                    onChange={(e) => handleRatingChange("keyboard", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.keyboard}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("keyboard", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the keyboard..."
                className="min-h-[100px]"
                value={descriptions.keyboard}
                onChange={(e) => handleDescriptionChange("keyboard", e.target.value)}
              />
              
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="speaker-rating">Speaker</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="speaker-rating"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.speaker}
                    onChange={(e) => handleRatingChange("speaker", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.speaker}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("speaker", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the speaker..."
                className="min-h-[100px]"
                value={descriptions.speaker}
                onChange={(e) => handleDescriptionChange("speaker", e.target.value)}
              />
              
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="ports-rating">Ports</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ports-rating"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.ports}
                    onChange={(e) => handleRatingChange("ports", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.ports}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("ports", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the ports..."
                className="min-h-[100px]"
                value={descriptions.ports}
                onChange={(e) => handleDescriptionChange("ports", e.target.value)}
              />
              
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="monitor-rating">Monitor</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="monitor-rating"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.monitor}
                    onChange={(e) => handleRatingChange("monitor", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.monitor}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("monitor", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the monitor..."
                className="min-h-[100px]"
                value={descriptions.monitor}
                onChange={(e) => handleDescriptionChange("monitor", e.target.value)}
              />
              
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="touchpad-rating">Touch Pad</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="touchpad-rating"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.touchPad}
                    onChange={(e) => handleRatingChange("touchPad", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.touchPad}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("touchPad", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the touch pad..."
                className="min-h-[100px]"
                value={descriptions.touchPad}
                onChange={(e) => handleDescriptionChange("touchPad", e.target.value)}
              />
              
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="webcam-rating">Webcam</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="webcam-rating"
                    type="number"
                    className="w-16 text-center"
                    min={1}
                    max={10}
                    value={ratings.webcam}
                    onChange={(e) => handleRatingChange("webcam", Number.parseInt(e.target.value))}
                  />
                  <StarRating
                    rating={ratings.webcam}
                    maxRating={10}
                    onRatingChange={(value) => handleRatingChange("webcam", value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe the webcam..."
                className="min-h-[100px]"
                value={descriptions.webcam}
                onChange={(e) => handleDescriptionChange("webcam", e.target.value)}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
