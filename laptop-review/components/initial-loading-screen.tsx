"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface InitialLoadingScreenProps {
  onLoadingComplete?: () => void
}

export default function InitialLoadingScreen({ onLoadingComplete }: InitialLoadingScreenProps) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10
        return newProgress > 100 ? 100 : newProgress
      })
    }, 200)

    // Minimum load time of 1.5 seconds
    const timer = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      
      // Small delay after reaching 100% before hiding
      setTimeout(() => {
        setLoading(false)
        if (onLoadingComplete) onLoadingComplete()
      }, 300)
    }, 1500)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [onLoadingComplete])

  if (!loading) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-500 ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src="/TechInsight_Logo.png" 
              alt="TechInsight Logo" 
              width={80}
              height={80}
              className="z-10" 
            />
          </div>
          
          {/* Circular progress indicator */}
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#f3f4f6" 
              strokeWidth="8" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#111827" 
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="transition-all duration-300 ease-out"
            />
          </svg>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold">TechInsight</h1>
        <p className="text-sm text-gray-500 mb-4">Loading your tech experience...</p>
        
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gray-800 dark:bg-gray-200 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">{Math.round(progress)}%</div>
      </div>
      
      <style jsx global>{`
        body {
          overflow: ${loading ? 'hidden' : 'auto'};
        }
      `}</style>
    </div>
  )
}