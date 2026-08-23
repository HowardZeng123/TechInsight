import ComparisonBarChart, { type ComparisonItem } from "./ComparisonBarChart"
import { useTheme } from "next-themes"

export interface PerformanceComparisonItem {
  id: string
  name: string
  subtitle?: string
  cpuScore: number
  gpuScore: number
}

interface PerformanceComparisonChartProps {
  title?: string
  items: PerformanceComparisonItem[]
  enableSorting?: boolean
  maxCpuScore?: number
  maxGpuScore?: number
}

export default function PerformanceComparisonChart({
  title = "So sánh hiệu năng",
  items,
  enableSorting = true,
  maxCpuScore = 20000,
  maxGpuScore = 15000,
}: PerformanceComparisonChartProps) {
  const { resolvedTheme } = useTheme()

  // Transform the data for the generic comparison chart
  const transformedItems: ComparisonItem[] = items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      metrics: {
        cpuScore: {
          value: item.cpuScore,
          unit: " điểm",
          percentage: Math.min((item.cpuScore / maxCpuScore) * 100, 100),
          color: "#0ea5e9", // Changed to a more suitable blue for white background
        },
        gpuScore: {
          value: item.gpuScore,
          unit: " điểm",
          percentage: Math.min((item.gpuScore / maxGpuScore) * 100, 100),
          color: "#10b981", // Changed to a more suitable green for white background
        },
      },
    }
  })

  return (
    <ComparisonBarChart
      title={title}
      items={transformedItems}
      metrics={[
        {
          id: "cpuScore",
          label: "Điểm CPU (Geekbench Multi-core)",
          color: "#0ea5e9",
          unit: " điểm",
          maxValue: maxCpuScore,
        },
        {
          id: "gpuScore",
          label: "Điểm GPU (3DMark)",
          color: "#10b981",
          unit: " điểm",
          maxValue: maxGpuScore,
        },
      ]}
      sortOptions={{
        enabled: enableSorting,
        defaultMetric: "cpuScore",
        defaultOrder: "desc",
      }}
      theme={resolvedTheme as "dark" | "light"}
    />
  )
}
