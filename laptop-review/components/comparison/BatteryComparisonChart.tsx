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
  unit?: string
  capacityLabel?: string
  maxCapacity?: number
}

export default function BatteryComparisonChart({
  title = "So sánh thời gian dùng pin",
  items,
  enableSorting = true,
  unit = " Wh",
  capacityLabel = "Dung lượng pin (Wh)",
  maxCapacity = 100
}: BatteryComparisonChartProps) {
  const { resolvedTheme } = useTheme()
  
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
          percentage: Math.min((totalMinutes / 720) * 100, 100),
          color: "#f43f5e",
        },
        batteryCapacity: {
          value: item.batteryCapacity,
          unit: unit,
          percentage: Math.min((item.batteryCapacity / maxCapacity) * 100, 100),
          color: "#8b5cf6",
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
          label: "Thời gian test ứng dụng / dùng thực tế",
          color: "#f43f5e",
          maxValue: 720,
        },
        {
          id: "batteryCapacity",
          label: capacityLabel,
          color: "#8b5cf6",
          unit: unit,
          maxValue: maxCapacity,
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
