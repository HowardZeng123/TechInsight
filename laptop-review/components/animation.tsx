"use client"

import React, { useEffect, useRef } from 'react'

interface AnimatedElementProps {
  children: React.ReactNode
  animation: 'fade-in' | 'fade-up' | 'fade-left' | 'fade-right' | 'scale'
  delay?: 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 'delay-500'
  className?: string
}

export function AnimatedElement({ 
  children, 
  animation, 
  delay, 
  className = ''
}: AnimatedElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          element.classList.add(`animate-${animation}`)
          if (delay) {
            element.classList.add(delay)
          }
          observer.unobserve(element)
        }
      })
    }, { threshold: 0.1 })

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [animation, delay])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

export function HoverLift({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`hover-lift ${className}`}>
      {children}
    </div>
  )
}

export function PulseAnimation({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`pulse ${className}`}>
      {children}
    </div>
  )
}

export function ShimmerEffect({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`shimmer ${className}`}>
      {children}
    </div>
  )
}