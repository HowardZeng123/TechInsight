import type { ReactNode } from "react"

interface SpecItemProps {
  icon: ReactNode
  label: string
  value: string
}

export default function SpecItem({ icon, label, value }: SpecItemProps) {
  return (
    <div className="flex items-start mb-4">
      <div className="text-gray-500 dark:text-gray-400 mr-3 mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium dark:text-white">{value}</p>
      </div>
    </div>
  )
}
