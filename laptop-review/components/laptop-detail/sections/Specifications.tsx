// laptop-review/components/laptop-detail/sections/Specifications.tsx
import React from "react";

type SpecificationsProps = {
  laptop: any;
};

export default function Specifications({ laptop }: SpecificationsProps) {
  return (
    <div className="pt-4">
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-white">Hệ thống</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Vi xử lý</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.cpu?.name || laptop.specs.cpu}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Card đồ họa</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.gpu?.name || laptop.specs.gpu}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Ram</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.ram?.capacity || laptop.specs.ram}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Bộ nhớ</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.storage?.capacity || laptop.specs.storage}</td>
              </tr>
              <tr>
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Sạc</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.battery?.chargerWattage} USB-C PD 3.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-white">Màn hình và pin</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Màn hình</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">
                  {laptop.detailedSpecs?.display?.size} {laptop.detailedSpecs?.display?.resolution} {laptop.detailedSpecs?.display?.type} Anti-Glare
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Độ sáng</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.display?.brightness}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Độ chuẩn màu</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.display?.colorGamut?.sRGB}% sRGB</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">Thời lượng pin</td>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{laptop.detailedSpecs?.battery?.capacity} Li-Polymer</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}