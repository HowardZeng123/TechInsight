import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import AnalysisSection from "./AnalysisSection";

type DetailedAnalysisProps = {
  laptop: any;
};

export default function DetailedAnalysis({ laptop }: DetailedAnalysisProps) {
  const getScoreBadge = (score: number) => {
    return (
      <div className={`text-white text-xs px-2.5 py-1 rounded-full font-bold bg-blue-600 dark:bg-blue-500`}>
        {score.toFixed(1)}/10
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Detailed Analysis</h2>

      {/* 1. Hiệu năng */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">1. Hiệu năng</h3>
          {laptop.benchmarks?.gaming && getScoreBadge(laptop.benchmarks.gaming)}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* CPU Benchmarks */}
          <div>
            <h4 className="font-medium mb-3 dark:text-white">CPU Benchmarks</h4>
            {laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Single && (
              <div className="flex items-center justify-between mb-2">
                <span className="dark:text-gray-300">Geekbench v6 (Single)</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs.cpu.benchmarks.geekbench6Single}</span>
              </div>
            )}
            {laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Single && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((laptop.detailedSpecs.cpu.benchmarks.geekbench6Single / 30), 100)}%` }}></div>
              </div>
            )}

            {laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Multi && (
              <div className="flex items-center justify-between mb-2">
                <span className="dark:text-gray-300">Geekbench v6 (Multi)</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs.cpu.benchmarks.geekbench6Multi}</span>
              </div>
            )}
            {laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Multi && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((laptop.detailedSpecs.cpu.benchmarks.geekbench6Multi / 150), 100)}%` }}></div>
              </div>
            )}

            {laptop.detailedSpecs?.cpu?.benchmarks?.cinebenchR23Single && (
              <div className="flex items-center justify-between mb-2">
                <span className="dark:text-gray-300">Cinebench R23 (Single)</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs.cpu.benchmarks.cinebenchR23Single}</span>
              </div>
            )}
            {laptop.detailedSpecs?.cpu?.benchmarks?.cinebenchR23Single && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((laptop.detailedSpecs.cpu.benchmarks.cinebenchR23Single / 18), 100)}%` }}></div>
              </div>
            )}

            {laptop.detailedSpecs?.cpu?.benchmarks?.cinebenchR23Multi && (
              <div className="flex items-center justify-between mb-2">
                <span className="dark:text-gray-300">Cinebench R23 (Multi)</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs.cpu.benchmarks.cinebenchR23Multi}</span>
              </div>
            )}
            {laptop.detailedSpecs?.cpu?.benchmarks?.cinebenchR23Multi && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((laptop.detailedSpecs.cpu.benchmarks.cinebenchR23Multi / 150), 100)}%` }}></div>
              </div>
            )}
          </div>

          {/* GPU Benchmarks */}
          <div>
            <h4 className="font-medium mb-3 dark:text-white">GPU Benchmarks</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="dark:text-gray-300">3DMark Time Spy (Graphics)</span>
              <span className="font-bold dark:text-white">5876</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: "58%" }}></div>
            </div>

            {laptop.detailedSpecs?.gpu?.benchmarks?.wildlifeExtreme && (
              <div className="flex items-center justify-between mb-2">
                <span className="dark:text-gray-300">3DMark Wildlife Extreme</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs.gpu.benchmarks.wildlifeExtreme}</span>
              </div>
            )}
            {laptop.detailedSpecs?.gpu?.benchmarks?.wildlifeExtreme && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: `${Math.min((laptop.detailedSpecs.gpu.benchmarks.wildlifeExtreme / 100), 100)}%` }}></div>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="dark:text-gray-300">Geekbench Compute</span>
              <span className="font-bold dark:text-white">21345</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: "71%" }}></div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 dark:text-white">So sánh hiệu năng: Cắm sạc (AC Power) vs Không cắm sạc (Pin)</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium mb-2 dark:text-gray-300">Cắm sạc (AC Power)</h5>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">GB6 Single</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Single || 2345}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">GB6 Multi</span>
                <span className="font-bold dark:text-white">{laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Multi || 11876}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">Cinebench R23 (Single)</span>
                <span className="font-bold dark:text-white">1,532</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">Cinebench R23 (Multi)</span>
                <span className="font-bold dark:text-white">12,456</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full" style={{ width: "82%" }}></div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2 dark:text-gray-300">Không cắm sạc (Pin)</h5>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">GB6 Single</span>
                <span className="font-bold dark:text-white">2123</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">GB6 Multi</span>
                <span className="font-bold dark:text-white">9654</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={{ width: "61%" }}></div>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">Cinebench R23 (Single)</span>
                <span className="font-bold dark:text-white">1,387</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={{ width: "76%" }}></div>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="dark:text-gray-300">Cinebench R23 (Multi)</span>
                <span className="font-bold dark:text-white">10,212</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={{ width: "67%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.performance ||
          `The ${laptop.detailedSpecs?.cpu?.name} handles multitasking and demanding tasks well. 
          The ${laptop.detailedSpecs?.gpu?.name} allows for enjoyable 1080p gaming and boosts creative apps. 
          Performance on battery sees a noticeable drop in multi-core tasks (~19%) but remains adequate for lighter workloads.`}
        </p>
      </div>

      {/* 2. Battery */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold dark:text-white">2. Pin</h3>
          <div className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full font-bold">
            {laptop.benchmarks?.battery ? laptop.benchmarks.battery.toFixed(1) : "8.7"}/10
          </div>
        </div>

        <div className="space-y-6 mb-6">
          {laptop.benchmarks?.batteryLifeCasual ? (
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium dark:text-white">Tác vụ thông thường</span>
                <span className="font-medium dark:text-white">{laptop.benchmarks.batteryLifeCasual}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-end px-2"
                  style={{ width: `${Math.min(parseFloat(laptop.benchmarks.batteryLifeCasual.replace(' hours', '').replace(' hour', '')) / 20 * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {laptop.benchmarks.batteryLifeCasual.replace(' hours', 'h').replace(' hour', 'h')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>

            </div>
          )}

          {laptop.benchmarks?.batteryLifeVideo ? (
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium dark:text-white">Xem video trực tuyến</span>
                <span className="font-medium dark:text-white">{laptop.benchmarks.batteryLifeVideo}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-end px-2"
                  style={{ width: `${Math.min(parseFloat(laptop.benchmarks.batteryLifeVideo.replace(' hours', '').replace(' hour', '')) / 25 * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {laptop.benchmarks.batteryLifeVideo.replace(' hours', 'h').replace(' hour', 'h')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              
            </div>
          )}

          {laptop.benchmarks?.batteryLifeHeavy ? (
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium dark:text-white">Tác vụ nặng (Gaming/Rendering)</span>
                <span className="font-medium dark:text-white">{laptop.benchmarks.batteryLifeHeavy}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-yellow-500 dark:bg-yellow-400 flex items-center justify-end px-2"
                  style={{ width: `${Math.min(parseFloat(laptop.benchmarks.batteryLifeHeavy.replace(' hours', '').replace(' hour', '')) / 7 * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {laptop.benchmarks.batteryLifeHeavy.replace(' hours', 'h').replace(' hour', 'h')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>

            </div>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.battery ||
          `The ${laptop.detailedSpecs?.battery?.capacity}Wh battery delivers impressive runtime for a laptop with these specs. 
          In our testing, it lasted about ${laptop.benchmarks?.batteryLifeCasual ? laptop.benchmarks.batteryLifeCasual.replace(' hours', '').replace(' hour', '') : '8'} hours of general productivity work and web browsing at 150 nits brightness. 
          Video playback extends to around ${laptop.benchmarks?.batteryLifeVideo ? laptop.benchmarks.batteryLifeVideo.replace(' hours', '').replace(' hour', '') : '10'} hours, while gaming will drain it in under ${laptop.benchmarks?.batteryLifeHeavy ? laptop.benchmarks.batteryLifeHeavy.replace(' hours', '').replace(' hour', '') : '2'} hours. 
          The ${laptop.detailedSpecs?.battery?.chargerWattage} ${laptop.detailedSpecs?.battery?.fastCharging ? "fast charger" : "charger"} can replenish to 60% in just 45 minutes, which is convenient for quick top-ups.`}
        </p>
      </div>

      {/* 3. Design & Build */}
      <AnalysisSection 
        title="3. Thiết kế" 
        score={laptop.benchmarks?.build}
      >
        <div className="mb-4">
          <p className="mb-2 dark:text-gray-300">Cấu trúc: {laptop.detailedSpecs?.case?.dimensions}</p>
          <p className="dark:text-gray-300">Độ nặng: {laptop.detailedSpecs?.case?.weight}</p>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.design ||
          `The ${laptop.detailedSpecs?.case?.material || "aluminum"} chassis gives a premium feel and solid build. 
          It's reasonably portable for a ${laptop.detailedSpecs?.display?.size || "16"}-inch device. 
          The minimalist ${laptop.detailedSpecs?.case?.color || "Storm Grey"} finish resists fingerprints well.`}
        </p>
      </AnalysisSection>

      {/* 4. Display */}
      <AnalysisSection 
        title="4. Màn hình" 
        score={laptop.benchmarks?.display}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="mb-1 dark:text-gray-300">Kích thước: {laptop.detailedSpecs?.display?.size}</p>
            <p className="mb-1 dark:text-gray-300">Tấm nền: {laptop.detailedSpecs?.display?.type}</p>
            <p className="mb-1 dark:text-gray-300">Độ sáng: {laptop.detailedSpecs?.display?.brightness}</p>
          </div>
          <div>
            <p className="mb-1 dark:text-gray-300">Độ phân giải: {laptop.detailedSpecs?.display?.resolution}</p>
            <p className="mb-1 dark:text-gray-300">Tốc độ làm mới: {laptop.detailedSpecs?.display?.refreshRate}</p>
            <p className="mb-1 dark:text-gray-300">Độ chuẩn màu: {laptop.detailedSpecs?.display?.colorGamut?.sRGB}% sRGB</p>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.display ||
          `The high-resolution ${laptop.detailedSpecs?.display?.aspectRatio || "16:10"} display with a ${laptop.detailedSpecs?.display?.refreshRate} refresh rate is a standout feature, 
          offering sharp text and smooth motion. Brightness is sufficient for indoors, and sRGB coverage is excellent for general use, 
          though professionals might need wider gamuts.`}
        </p>
      </AnalysisSection>

      {/* 5. Keyboard */}
      <AnalysisSection 
        title="5. Keyboard"
      >
        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.keyboard ||
          `Features a comfortable keyboard with good travel and tactile feedback, plus a numpad. 
          Backlighting is functional with ${laptop.detailedSpecs?.input?.keyboard?.includes("RGB") ? "RGB lighting" : "two levels"}.`}
        </p>
      </AnalysisSection>

      {/* 6. Trackpad */}
      <AnalysisSection 
        title="6. Trackpad" 
        score={7.8}
      >
        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.trackpad ||
          `Large and responsive Microsoft Precision trackpad supports gestures well. Clicking is satisfactory. 
          Slightly off-center placement due to numpad.`}
        </p>
      </AnalysisSection>

      {/* 7. Speakers */}
      <AnalysisSection 
        title="7. Speakers" 
        score={7.5}
      >
        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.speakers ||
          `Downward-firing speakers with ${laptop.detailedSpecs?.sound?.dolbyAtmos ? "Dolby Atmos" : "good audio"} provide clear audio, 
          suitable for calls and casual media consumption. Bass is lacking.`}
        </p>
      </AnalysisSection>

      {/* 8. Webcam */}
      <AnalysisSection 
        title="8. Webcam" 
        score={7.0}
      >
        <div>
          <p className="mb-3 dark:text-gray-300">Resolution: {laptop.detailedSpecs?.connectivity?.webcam?.includes("1080p") ? "1080p FHD + IR with Privacy Shutter" : laptop.detailedSpecs?.connectivity?.webcam}</p>
          <p className="text-gray-700 dark:text-gray-300">
            {laptop.descriptions?.webcam ||
            `The ${laptop.detailedSpecs?.connectivity?.webcam?.includes("1080p") ? "1080p" : "720p"} webcam offers better detail than 720p cameras in good light. 
            Includes a privacy shutter and IR for Windows Hello.`}
          </p>
        </div>
      </AnalysisSection>

      {/* 9. Ports */}
      <AnalysisSection 
        title="9. Ports" 
        score={8.3}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Left Side:</h4>
            <ul className="list-disc list-inside space-y-1 dark:text-gray-300">
              <li>1x USB-C 3.2 Gen 2 (DP 1.4, PD 3.0)</li>
              <li>1x USB-A 3.2 Gen 1</li>
              <li>HDMI 2.0</li>
              <li>SD Card Reader</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Right Side:</h4>
            <ul className="list-disc list-inside space-y-1 dark:text-gray-300">
              <li>1x USB-A 3.2 Gen 1</li>
              <li>1x USB-C 3.2 Gen 2 (PD 3.0, Data)</li>
              <li>3.5mm Combo Audio Jack</li>
            </ul>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300">
          {laptop.descriptions?.ports ||
          `A comprehensive port selection covers most needs, including versatile USB-C ports and an SD reader. Well-distributed on both sides.`}
        </p>
      </AnalysisSection>

      {/* Best Prices & Deals */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6"></h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            
          </div>
          
          <div>
            
          </div>
          
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
}