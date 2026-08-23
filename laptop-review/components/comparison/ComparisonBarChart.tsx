"use client"

import { useState } from "react"

export interface ComparisonMetric {
  value: number
  displayValue?: string
  unit?: string
  percentage: number
  color: string
}

export interface ComparisonItem {
  id: string
  name: string
  subtitle?: string
  metrics: {
    [key: string]: ComparisonMetric
  }
}

interface MetricDefinition {
  id: string
  label: string
  color: string
  unit?: string
  maxValue?: number
}

interface SortOptions {
  enabled: boolean
  defaultMetric: string
  defaultOrder: "asc" | "desc"
}

interface ComparisonBarChartProps {
  title: string
  items: ComparisonItem[]
  metrics: MetricDefinition[]
  sortOptions: SortOptions
  theme?: "dark" | "light"
}

export default function ComparisonBarChart({
  title,
  items,
  metrics,
  sortOptions,
  theme = "dark",
}: ComparisonBarChartProps) {
  const [sortMetric, setSortMetric] = useState(sortOptions.defaultMetric)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(sortOptions.defaultOrder)

  // Sort items based on current sort settings
  const sortedItems = [...items].sort((a, b) => {
    const valueA = a.metrics[sortMetric]?.value || 0
    const valueB = b.metrics[sortMetric]?.value || 0
    return sortOrder === "asc" ? valueA - valueB : valueB - valueA
  })

  // Removed helper functions in favor of direct Tailwind classes

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

        {sortOptions.enabled && (
          <div className="flex items-center mt-4 md:mt-0">
            <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">Sắp xếp theo</span>
            <div className="flex">
              <button
                onClick={() => setSortOrder("asc")}
                className={`px-3 py-1 text-sm rounded-l ${
                  sortOrder === "asc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Tăng dần
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                className={`px-3 py-1 text-sm rounded-r ${
                  sortOrder === "desc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Giảm dần
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: metric.color }}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {sortedItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="font-medium text-gray-900 dark:text-white">
              {item.name}
              {item.subtitle && (
                <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-300">{item.subtitle}</span>
              )}
            </div>

            {metrics.map((metric) => {
              const metricData = item.metrics[metric.id]
              if (!metricData) return null

              return (
                <div key={metric.id} className="space-y-1">
                  <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end px-3"
                      style={{
                        width: `${metricData.percentage}%`,
                        backgroundColor: metricData.color,
                      }}
                    >
                      <span className="text-xs text-white font-medium">
                        {metricData.displayValue || metricData.value}
                        {!metricData.displayValue && metricData.unit}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
