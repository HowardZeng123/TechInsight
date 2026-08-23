import React from 'react';

type AnalysisSectionProps = {
  title: string;
  score?: number;
  children: React.ReactNode;
};

export default function AnalysisSection({ title, score, children }: AnalysisSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        {score && (
          <div className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full font-bold">
            {score.toFixed(1)}/10
          </div>
        )}
      </div>
      
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}