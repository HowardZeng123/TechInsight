"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronRight, Save } from "lucide-react"

export interface BenchmarkScores {
  battery: number
  build: number
  content: number
  display: number
  gaming: number
  overall: number
  productivity: number
  value: number
}

export default function Benchmark({ scores,handleSliderChange}) {


  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChevronRight className="h-5 w-5 mr-2" />
          <span>benchmarks</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form  className="space-y-6">
          {Object.entries(scores).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-blue-500">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>{key}</span>
                </div>
                <span className="font-medium">{value.toFixed(1)}/10</span>
              </div>
              <Slider
                defaultValue={[value]}
                max={10}
                step={0.1}
                onValueChange={(val) => handleSliderChange(key as keyof BenchmarkScores, val)}
                className="py-2"
              />
            </div>
          ))}
          
        </form>
      </CardContent>
    </Card>
  )
}
