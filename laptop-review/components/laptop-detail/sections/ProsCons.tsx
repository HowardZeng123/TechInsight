import React from "react";
import { Check, X } from "lucide-react";

type ProsConsProps = {
  laptop: any;
};

export default function ProsCons({ laptop }: ProsConsProps) {
  if (!laptop.pros?.length && !laptop.cons?.length) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {laptop.pros && laptop.pros.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">Ưu điểm</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {laptop.pros.map((pro: string, index: number) => (
              <li key={`pro-${index}`} className="flex items-start">
                <Check className="text-green-500 dark:text-green-400 w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {laptop.pros?.length === 0 && laptop.cons && laptop.cons.length > 0 && <div></div>}
      
      {laptop.cons && laptop.cons.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">Nhược điểm</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {laptop.cons.map((con: string, index: number) => (
              <li key={`con-${index}`} className="flex items-start">
                <X className="text-red-500 dark:text-red-400 w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}