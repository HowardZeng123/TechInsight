import React from "react";

type ProgressBarProps = {
  value?: number | string;
  max: number;
  color?: string;
};

export default function ProgressBar({ value, max, color = "bg-blue-600" }: ProgressBarProps) {
  const numericValue =
    typeof value === "string" ? parseFloat(value.split("/")[0]) : value;
    
  if (numericValue === undefined || numericValue === null || isNaN(numericValue) || max <= 0)
    return null;
    
  const percentage = Math.min(100, Math.max(0, (numericValue / max) * 100));
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}