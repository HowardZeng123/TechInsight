import ComparisonBarChart, { type ComparisonItem } from "./ComparisonBarChart"
import { useTheme } from "next-themes"

export interface BatteryComparisonItem {
  id: string
  name: string
  subtitle?: string
  batteryCapacity: number
  batteryLife: {
    hours: number
    minutes: number
  }
}

interface BatteryComparisonChartProps {
  title?: string
  items: BatteryComparisonItem[]
  enableSorting?: boolean
}

export default function BatteryComparisonChart({
  title = "So sánh thời gian dùng pin",
  items,
  enableSorting = true,
}: BatteryComparisonChartProps) {
  const { resolvedTheme } = useTheme()
  
  // Transform the data for the generic comparison chart
  const transformedItems: ComparisonItem[] = items.map((item) => {
    const totalMinutes = item.batteryLife.hours * 60 + item.batteryLife.minutes

    return {
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      metrics: {
        batteryLife: {
          value: totalMinutes,
          displayValue: `${item.batteryLife.hours}g ${item.batteryLife.minutes}p`,
          // Assuming the max battery life is 12 hours (720 minutes)
          percentage: Math.min((totalMinutes / 720) * 100, 100),
          color: "#f43f5e", // Changed to a more suitable color for white background
        },
        batteryCapacity: {
          value: item.batteryCapacity,
          unit: " Wh",
          // Assuming the max battery capacity is 100 Wh
          percentage: Math.min((item.batteryCapacity / 100) * 100, 100),
          color: "#8b5cf6", // Kept purple but slightly adjusted
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
          id: "batteryLife",
          label: "Thời gian test ứng dụng văn phòng",
          color: "#f43f5e",
          maxValue: 720, // 12 hours in minutes
        },
        {
          id: "batteryCapacity",
          label: "Dung lượng pin (Wh)",
          color: "#8b5cf6",
          unit: " Wh",
          maxValue: 100,
        },
      ]}
      sortOptions={{
        enabled: enableSorting,
        defaultMetric: "batteryLife",
        defaultOrder: "desc",
      }}
      theme={resolvedTheme as "dark" | "light"}
    />
  )
}
