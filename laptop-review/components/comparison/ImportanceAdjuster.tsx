// laptop-review/components/comparison/ImportanceAdjuster.tsx
import { calculateWeightedScore } from "@/utils/compareUtils";

type ImportanceAdjusterProps = {
  laptops: any[];
  weights: any;
  setWeights: (weights: any) => void;
};

export default function ImportanceAdjuster({
  laptops,
  weights,
  setWeights,
}: ImportanceAdjusterProps) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4 dark:text-white">Dựa theo nhu cầu của bạn</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
      Điều chỉnh mức độ quan trọng của từng tiêu chí theo nhu cầu của bạn để tìm ra chiếc laptop phù hợp nhất.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium dark:text-white">Cấu hình</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">Mức độ: {weights.performance}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.performance}
              onChange={(e) => setWeights({ ...weights, performance: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Không quan trọng</span>
              <span>Rất quan trọng</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium dark:text-white">Gaming</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">Mức độ: {weights.gaming}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.gaming}
              onChange={(e) => setWeights({ ...weights, gaming: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Không quan trọng</span>
              <span>Rất quan trọng</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium dark:text-white">Màn hình</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">Mức độ {weights.display}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.display}
              onChange={(e) => setWeights({ ...weights, display: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Không quan trọng</span>
              <span>Rất quan trọng</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium dark:text-white">Thời lượng pin</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">Mức độ: {weights.battery}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.battery}
              onChange={(e) => setWeights({ ...weights, battery: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Không quan trọng</span>
              <span>Rất quan trọng</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium dark:text-white">Tùy chọn kết nối</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">Mức độ: {weights.connectivity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.connectivity}
              onChange={(e) => setWeights({ ...weights, connectivity: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Không quan trọng</span>
              <span>Rất quan trọng</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium dark:text-white">Tính di động</label>
              <span className="text-sm text-gray-500 dark:text-gray-400">Mức độ: {weights.portability}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.portability}
              onChange={(e) => setWeights({ ...weights, portability: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Không quan trọng</span>
              <span>Rất quan trọng</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Tính toán mức độ quan trọng</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Điểm số được tính toán giúp bạn tìm ra chiếc laptop phù hợp nhất dựa trên mức độ quan trọng của bạn. Mỗi tiêu chí được nhân với trọng số quan trọng của nó, sau đó được chuẩn hóa thành thang điểm 10.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        {laptops.map((laptop) => (
          <div key={laptop.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{calculateWeightedScore(laptop, weights)}</div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Điểm tổng</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium dark:text-white">Cấu hình</span>
                  <span className="dark:text-gray-300">{laptop.benchmarks.productivity}/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${laptop.benchmarks.productivity * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium dark:text-white">Gaming</span>
                  <span className="dark:text-gray-300">{laptop.benchmarks.gaming}/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${laptop.benchmarks.gaming * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium dark:text-white">Màn hình</span>
                  <span className="dark:text-gray-300">{laptop.benchmarks.display}/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${laptop.benchmarks.display * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium dark:text-white">Thời lượng pin</span>
                  <span className="dark:text-gray-300">{laptop.benchmarks.battery}/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${laptop.benchmarks.battery * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium dark:text-white">Chất lượng build</span>
                  <span className="dark:text-gray-300">{laptop.benchmarks.build}/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${laptop.benchmarks.build * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}