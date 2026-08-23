import React from "react";

type ScoreBadgeProps = {
  score?: number;
};

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === undefined || score === null) return null;
  
  let bgColor = "bg-gray-500";
  if (score >= 8.5) bgColor = "bg-green-600";
  else if (score >= 7.0) bgColor = "bg-blue-600";
  else if (score >= 5.0) bgColor = "bg-yellow-500";
  else bgColor = "bg-red-600";
  
  return (
    <div className={`${bgColor} text-white text-xs px-2.5 py-1 rounded-full font-bold`}>
      {score.toFixed(1)}/10
    </div>
  );
}