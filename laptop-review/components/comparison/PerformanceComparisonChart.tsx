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
  cpuLabel?: string
  gpuLabel?: string
}

export default function PerformanceComparisonChart({
  title = "So sánh hiệu năng",
  items,
  enableSorting = true,
  maxCpuScore = 20000,
  maxGpuScore = 15000,
  cpuLabel = "Điểm CPU (Geekbench Multi-core)",
  gpuLabel = "Điểm GPU / Đồ họa (3DMark)"
}: PerformanceComparisonChartProps) {
  const { resolvedTheme } = useTheme()

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
          color: "#0ea5e9",
        },
        gpuScore: {
          value: item.gpuScore,
          unit: " điểm",
          percentage: Math.min((item.gpuScore / maxGpuScore) * 100, 100),
          color: "#10b981",
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
          label: cpuLabel,
          color: "#0ea5e9",
          unit: " điểm",
          maxValue: maxCpuScore,
        },
        {
          id: "gpuScore",
          label: gpuLabel,
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
