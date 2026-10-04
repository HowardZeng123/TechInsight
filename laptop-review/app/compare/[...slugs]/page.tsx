// laptop-review/app/compare/[...slugs]/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { laptopService, smartphoneService } from "@/services/firebaseServices"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import RatingBar from "@/components/common/rating-bar"
import ComparisonOverview from "@/components/comparison/ComparisonOverview"
import ImportanceAdjuster from "@/components/comparison/ImportanceAdjuster"
import KeyDifferences from "@/components/comparison/KeyDifferences"
import ComparisonTable from "@/components/comparison/ComparisonTable"
import { getKeyDifferences } from "@/utils/compareUtils"
import BatteryComparisonChart from "@/components/comparison/BatteryComparisonChart"
import PerformanceComparisonChart from "@/components/comparison/PerformanceComparisonChart"

interface ComparisonWeights {
  performance: number
  gaming: number
  display: number
  battery: number
  connectivity: number
  portability: number
}

export default function ComparisonPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [weights, setWeights] = useState<ComparisonWeights>({
    performance: 1, gaming: 1, display: 1, battery: 1, connectivity: 1, portability: 1,
  })

  // Determine if category is phone
  const isPhone = useMemo(() => {
    if (categoryParam === 'phone') return true;
    if (items.length > 0 && (items[0].specs?.soc || items[0].specs?.operatingSystem)) return true;
    return false;
  }, [categoryParam, items]);

  const activeCategory = isPhone ? 'phone' : 'laptop';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (params.slugs) {
          const compareString = params.slugs[params.slugs.length - 1]
          const ids = compareString.split("-vs-")
          
          if (ids.length === 2) {
            let dataPromises;
            if (categoryParam === 'phone') {
              dataPromises = ids.map(id => smartphoneService.getById(id));
            } else {
              // Try laptop first, if null try smartphone
              dataPromises = ids.map(async id => {
                const lap = await laptopService.getById(id);
                if (lap) return lap;
                return await smartphoneService.getById(id);
              });
            }
            
            const fetchedData = await Promise.all(dataPromises);
            const validItems = fetchedData.filter(item => item !== null);
            
            if (validItems.length === 2) {
              setItems(validItems);
            } else {
              setError("Không thể tìm thấy một hoặc cả hai thiết bị để so sánh");
            }
          } else {
            setError("URL không đúng định dạng");
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [params, categoryParam]);

  const keyDifferences = useMemo(() => {
    if (items.length < 2) return { laptop1: [], laptop2: [] };
    return getKeyDifferences(items);
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl font-medium dark:text-white">Đang tải dữ liệu so sánh...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || items.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Không thể so sánh thiết bị</h1>
            <p className="mb-4 dark:text-gray-300">Vui lòng kiểm tra lại đường dẫn so sánh:</p>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mb-4 dark:text-gray-300">/compare/id-1-vs-id-2</code>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Link href="/compare-select" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
              Quay lại chọn thiết bị
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // --- LAPTOP SPEC TABLES ---
  const laptopCaseSpecs = [
    { label: "Trọng lượng", path: "detailedSpecs.case.weight", isHigherBetter: false },
    { label: "Tỷ lệ màn hình / Thân máy", path: "detailedSpecs.case.screenToBodyRatio" },
  ];

  const laptopDisplaySpecs = [
    { label: "Độ phân giải", path: "detailedSpecs.display.resolution" },
    { label: "Tần số quét", path: "detailedSpecs.display.refreshRate" },
    { label: "Độ sáng", path: "detailedSpecs.display.brightness" },
    { label: "Dải màu (sRGB)", path: "detailedSpecs.display.colorGamut.sRGB" },
  ];

  const laptopPerformanceSpecs = [
    { label: "Geekbench 6 (Single)", path: "detailedSpecs.cpu.benchmarks.geekbench6Single" },
    { label: "Geekbench 6 (Multi)", path: "detailedSpecs.cpu.benchmarks.geekbench6Multi" },
    { label: "3D Mark Wildlife Extreme", path: "detailedSpecs.gpu.benchmarks.wildlifeExtreme" },
  ];

  const laptopBatterySpecs = [
    { label: "Dung lượng pin", path: "detailedSpecs.battery.capacity" },
    { label: "Sạc nhanh", path: "detailedSpecs.battery.fastCharging" },
  ];

  const laptopConnectivitySpecs = [
    { label: "Wi-Fi", path: "detailedSpecs.connectivity.wifi" },
    { label: "Bluetooth", path: "detailedSpecs.connectivity.bluetooth" },
    { label: "Cổng USB-A", path: "detailedSpecs.connectivity.ports.usba" },
    { label: "Cổng USB-C", path: "detailedSpecs.connectivity.ports.usbc" },
    { label: "Thunderbolt", path: "detailedSpecs.connectivity.ports.thunderbolt" },
    { label: "Cổng HDMI", path: "detailedSpecs.connectivity.ports.hdmi" },
    { label: "Đầu đọc thẻ SD", path: "detailedSpecs.connectivity.ports.sdCard" },
    { label: "Webcam", path: "detailedSpecs.connectivity.webcam" },
  ];

  const laptopInputSpecs = [
    { label: "Bàn phím", path: "detailedSpecs.input.keyboard" },
    { label: "Numpad", path: "detailedSpecs.input.numpad" },
    { label: "Hành trình phím", path: "detailedSpecs.input.keyTravel" },
    { label: "Kích thước Touchpad", path: "detailedSpecs.input.touchpad.size" },
    { label: "Bề mặt Touchpad", path: "detailedSpecs.input.touchpad.surface" },
  ];

  // --- PHONE SPEC TABLES ---
  const phoneCaseSpecs = [
    { label: "Trọng lượng", path: "specs.weight", isHigherBetter: false },
    { label: "Kháng nước & bụi", path: "specs.waterResistance" },
  ];

  const phoneDisplaySpecs = [
    { label: "Màn hình & Tần số quét", path: "specs.display" },
  ];

  const phonePerformanceSpecs = [
    { label: "Vi xử lý (SoC)", path: "specs.soc" },
    { label: "RAM", path: "specs.ram" },
    { label: "Bộ nhớ trong", path: "specs.storage" },
    { label: "Hệ điều hành", path: "specs.operatingSystem" },
    { label: "Điểm AnTuTu Benchmark", path: "benchmarks.antutu" },
    { label: "Geekbench 6 (Multi-core)", path: "benchmarks.geekbenchMulti" },
    { label: "Geekbench 6 (Single-core)", path: "benchmarks.geekbenchSingle" },
  ];

  const phoneCameraSpecs = [
    { label: "Camera sau", path: "specs.rearCamera" },
    { label: "Camera trước", path: "specs.frontCamera" },
    { label: "Đánh giá chất lượng Camera", path: "benchmarks.cameraScore" },
  ];

  const phoneBatterySpecs = [
    { label: "Dung lượng pin", path: "specs.battery" },
    { label: "Công suất sạc", path: "specs.charging" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href={`/compare-select?category=${activeCategory}`} 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trở về chọn {isPhone ? "điện thoại" : "laptop"}
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
          So sánh {isPhone ? "Điện thoại" : "Laptop"}
        </h1>

        {/* Overview Section */}
        <ComparisonOverview laptops={items} category={activeCategory} />

        {/* Key Differences / Advantages */}
        <KeyDifferences laptops={items} keyDifferences={keyDifferences} />

        {/* Battery Comparison Chart */}
        <div className="mb-8">
          {isPhone ? (
            <BatteryComparisonChart 
              title="So sánh dung lượng & sử dụng pin"
              unit=" mAh"
              capacityLabel="Dung lượng pin (mAh)"
              maxCapacity={6000}
              items={items.map(phone => {
                const mah = parseInt(phone.specs?.battery?.replace(/[^0-9]/g, '') || '5000');
                const score = Number(phone.benchmarks?.batteryScore || 8.5);
                const hours = Math.floor(score * 1.5);
                const minutes = Math.round(((score * 1.5) % 1) * 60);

                return {
                  id: phone.id,
                  name: phone.name,
                  subtitle: phone.specs?.soc || '',
                  batteryCapacity: mah,
                  batteryLife: {
                    hours: hours,
                    minutes: minutes
                  }
                };
              })}
            />
          ) : (
            <BatteryComparisonChart 
              items={items.map(laptop => ({
                id: laptop.id,
                name: laptop.name,
                subtitle: laptop.detailedSpecs?.cpu?.name || '',
                batteryCapacity: Number.parseInt(laptop.detailedSpecs?.battery?.capacity || '0'),
                batteryLife: {
                  hours: Math.floor(laptop.benchmarks?.battery || 0),
                  minutes: Math.round(((laptop.benchmarks?.battery || 0) % 1) * 60)
                }
              }))}
            />
          )}
        </div>

        {/* Performance Comparison Chart */}
        <div className="mb-8">
          {isPhone ? (
            <PerformanceComparisonChart 
              title="So sánh hiệu năng & Điểm Benchmark"
              cpuLabel="Điểm Geekbench 6 Multi-core"
              gpuLabel="Điểm AnTuTu / Đồ họa (x100)"
              maxCpuScore={10000}
              maxGpuScore={25000}
              items={items.map(phone => {
                const cpu = parseInt(phone.benchmarks?.geekbenchMulti) || Math.round((phone.benchmarks?.performanceScore || 8.5) * 850);
                const antutu = parseInt(phone.benchmarks?.antutu) || Math.round((phone.benchmarks?.overall || 8.5) * 200000);

                return {
                  id: phone.id,
                  name: phone.name,
                  subtitle: phone.specs?.soc || '',
                  cpuScore: cpu,
                  gpuScore: Math.round(antutu / 100)
                };
              })}
            />
          ) : (
            <PerformanceComparisonChart 
              items={items.map(laptop => ({
                id: laptop.id,
                name: laptop.name,
                subtitle: laptop.detailedSpecs?.cpu?.name || '',
                cpuScore: laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Multi || 0,
                gpuScore: laptop.detailedSpecs?.gpu?.benchmarks?.wildlifeExtreme || 0
              }))}
            />
          )}
        </div>

        {/* Interactive Importance Adjuster & Total Weighted Score */}
        <ImportanceAdjuster laptops={items} weights={weights} setWeights={setWeights} category={activeCategory} />

        {/* Price & Rating Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Giá tiền & Đánh giá tổng quan</h2>
          <div className="grid grid-cols-2 gap-8">
            {items.map((device) => {
              const valScore = device.benchmarks?.value || device.benchmarks?.overall || 8.5;
              return (
                <div key={device.id} className="text-center">
                  <div className="text-2xl font-bold mb-2 dark:text-white">{device.price || 'Chưa có giá chính thức'}</div>
                  <RatingBar score={valScore} label="Đánh giá tổng hợp" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Spec Comparison Tables */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">So sánh chi tiết thông số</h2>
          {isPhone ? (
            <>
              <ComparisonTable laptops={items} title="Thiết kế & Kháng nước" specs={phoneCaseSpecs} />
              <ComparisonTable laptops={items} title="Màn hình hiển thị" specs={phoneDisplaySpecs} />
              <ComparisonTable laptops={items} title="Vi xử lý & Hiệu năng" specs={phonePerformanceSpecs} />
              <ComparisonTable laptops={items} title="Hệ thống Camera" specs={phoneCameraSpecs} />
              <ComparisonTable laptops={items} title="Thời lượng Pin & Công nghệ Sạc" specs={phoneBatterySpecs} />
            </>
          ) : (
            <>
              <ComparisonTable laptops={items} title="Vỏ" specs={laptopCaseSpecs} />
              <ComparisonTable laptops={items} title="Màn hình" specs={laptopDisplaySpecs} />
              <ComparisonTable laptops={items} title="Cấu hình" specs={laptopPerformanceSpecs} />
              <ComparisonTable laptops={items} title="Pin" specs={laptopBatterySpecs} />
              <ComparisonTable laptops={items} title="Tùy chọn kết nối" specs={laptopConnectivitySpecs} />
              <ComparisonTable laptops={items} title="Input" specs={laptopInputSpecs} />
            </>
          )}
        </div>

      </main>
      <Footer />
    </div>
  )
}