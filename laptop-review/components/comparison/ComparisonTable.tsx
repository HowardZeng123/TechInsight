// laptop-review/components/comparison/ComparisonTable.tsx
import { compareSpecs } from "@/utils/compareUtils";

type ComparisonTableProps = {
  laptops: any[];
  title: string;
  specs: {
    label: string;
    path: string;
    isHigherBetter?: boolean;
  }[];
};

export default function ComparisonTable({ laptops, title, specs }: ComparisonTableProps) {
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 dark:text-white">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Feature
              </th>
              {laptops.map((laptop) => (
                <th
                  key={laptop.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {laptop.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {specs.map((spec, index) => (
              <tr key={index} className="dark:border-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{spec.label}</td>
                {laptops.map((laptop, idx) => {
                  const value = getNestedValue(laptop, spec.path);
                  const otherValue = getNestedValue(laptops[1 - idx], spec.path);
                  const [isBetter, isWorse] = compareSpecs(
                    value,
                    otherValue,
                    spec.isHigherBetter !== false
                  );
                  
                  return (
                    <td
                      key={laptop.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isBetter 
                          ? 'text-green-600 dark:text-green-400 font-medium' 
                          : isWorse 
                            ? 'text-gray-500 dark:text-gray-400'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {typeof value === 'boolean' ? (value ? "Yes" : "No") : (value !== null && value !== undefined && value !== '' ? value : (typeof value === 'number' ? value : "N/A"))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}