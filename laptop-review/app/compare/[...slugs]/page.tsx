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
import Image from "next/image"

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
  const category = searchParams.get('category') || 'laptop'

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [weights, setWeights] = useState<ComparisonWeights>({
    performance: 1, gaming: 1, display: 1, battery: 1, connectivity: 1, portability: 1,
  })

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (params.slugs) {
          const compareString = params.slugs[params.slugs.length - 1]
          const ids = compareString.split("-vs-")
          
          if (ids.length === 2) {
            let dataPromises;
            if (category === 'phone') {
              dataPromises = ids.map(id => smartphoneService.getById(id));
            } else {
              dataPromises = ids.map(id => laptopService.getById(id));
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
  }, [params, category]);

  const keyDifferences = useMemo(() => {
    if (items.length < 2 || category === 'phone') return { laptop1: [], laptop2: [] };
    return getKeyDifferences(items);
  }, [items, category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl font-medium dark:text-white">Đang tải dữ liệu...</p>
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
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Unable to Compare Devices</h1>
            <p className="mb-4 dark:text-gray-300">Please make sure you're using the correct URL format:</p>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mb-4 dark:text-gray-300">/compare/id-1-vs-id-2</code>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
              Return to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // --- PHONE COMPARISON UI ---
  if (category === 'phone') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/compare-select?category=phone" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trở về chọn thiết bị
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">So sánh Điện thoại</h1>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {items.map(phone => (
              <div key={phone.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center">
                <div className="relative w-48 h-64 mb-4">
                  {phone.image ? (
                    <Image src={phone.image} alt={phone.name} fill style={{objectFit: 'contain'}} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-center dark:text-white mb-2">{phone.name}</h2>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{phone.price}</div>
                <Link href={`/phones/${phone.id}`} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors">
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>

          {/* Specs Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 dark:text-white">Thông số kỹ thuật</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {[
                    { label: "Vi xử lý (SoC)", key: "soc" },
                    { label: "RAM", key: "ram" },
                    { label: "Bộ nhớ", key: "storage" },
                    { label: "Màn hình", key: "display" },
                    { label: "Pin", key: "battery" },
                    { label: "Camera sau", key: "rearCamera" },
                    { label: "Camera trước", key: "frontCamera" },
                    { label: "Hệ điều hành", key: "operatingSystem" },
                    { label: "Sạc", key: "charging" }
                  ].map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 w-1/3">{spec.label}</th>
                      <td className="p-4 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 w-1/3">{items[0].specs?.[spec.key] || 'N/A'}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 w-1/3">{items[1].specs?.[spec.key] || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benchmarks Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 dark:text-white">Điểm Benchmarks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {[
                    { label: "Điểm tổng quan", key: "overall" },
                    { label: "Hiệu năng", key: "performanceScore" },
                    { label: "Camera", key: "cameraScore" },
                    { label: "Pin", key: "batteryScore" },
                    { label: "AnTuTu", key: "antutu" },
                    { label: "Geekbench Multi", key: "geekbenchMulti" }
                  ].map((spec, index) => {
                    const val1 = items[0].benchmarks?.[spec.key];
                    const val2 = items[1].benchmarks?.[spec.key];
                    const num1 = Number(val1) || 0;
                    const num2 = Number(val2) || 0;
                    const isVal1Better = num1 > num2;
                    const isVal2Better = num2 > num1;

                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                        <th className="p-4 font-medium text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 w-1/3">{spec.label}</th>
                        <td className={`p-4 font-medium border-r border-gray-200 dark:border-gray-700 w-1/3 ${isVal1Better ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {val1 || 'N/A'}
                        </td>
                        <td className={`p-4 font-medium w-1/3 ${isVal2Better ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {val2 || 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
        <Footer />
      </div>
    );
  }

  // --- LAPTOP COMPARISON UI ---
  const caseSpecs = [
    { label: "Weight", path: "detailedSpecs.case.weight", isHigherBetter: false },
    { label: "Screen-to-Body Ratio", path: "detailedSpecs.case.screenToBodyRatio" },
  ];

  const displaySpecs = [
    { label: "Resolution", path: "detailedSpecs.display.resolution" },
    { label: "Refresh Rate", path: "detailedSpecs.display.refreshRate" },
    { label: "Brightness", path: "detailedSpecs.display.brightness" },
    { label: "Color Gamut (sRGB)", path: "detailedSpecs.display.colorGamut.sRGB" },
  ];

  const performanceSpecs = [
    { label: "Geekbench 6 (Single)", path: "detailedSpecs.cpu.benchmarks.geekbench6Single" },
    { label: "Geekbench 6 (Multi)", path: "detailedSpecs.cpu.benchmarks.geekbench6Multi" },
    { label: "3D Mark Wildlife Extreme", path: "detailedSpecs.gpu.benchmarks.wildlifeExtreme" },
  ];

  const batterySpecs = [
    { label: "Capacity", path: "detailedSpecs.battery.capacity" },
    { label: "Fast Charging", path: "detailedSpecs.battery.fastCharging" },
  ];

  const connectivitySpecs = [
    { label: "Wi-Fi", path: "detailedSpecs.connectivity.wifi" },
    { label: "Bluetooth", path: "detailedSpecs.connectivity.bluetooth" },
    { label: "USB-A Ports", path: "detailedSpecs.connectivity.ports.usba" },
    { label: "USB-C Ports", path: "detailedSpecs.connectivity.ports.usbc" },
    { label: "Thunderbolt", path: "detailedSpecs.connectivity.ports.thunderbolt" },
    { label: "HDMI", path: "detailedSpecs.connectivity.ports.hdmi" },
    { label: "SD Card Reader", path: "detailedSpecs.connectivity.ports.sdCard" },
    { label: "Webcam", path: "detailedSpecs.connectivity.webcam" },
  ];

  const inputSpecs = [
    { label: "Keyboard", path: "detailedSpecs.input.keyboard" },
    { label: "Numpad", path: "detailedSpecs.input.numpad" },
    { label: "Key Travel", path: "detailedSpecs.input.keyTravel" },
    { label: "Touchpad Size", path: "detailedSpecs.input.touchpad.size" },
    { label: "Touchpad Surface", path: "detailedSpecs.input.touchpad.surface" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/compare-select?category=laptop" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trở về chọn thiết bị
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">So sánh laptop</h1>

        <ComparisonOverview laptops={items} />
        <KeyDifferences laptops={items} keyDifferences={keyDifferences} />

        <div className="mb-8">
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
        </div>

        <div className="mb-8">
          <PerformanceComparisonChart 
            items={items.map(laptop => ({
              id: laptop.id,
              name: laptop.name,
              subtitle: laptop.detailedSpecs?.cpu?.name || '',
              cpuScore: laptop.detailedSpecs?.cpu?.benchmarks?.geekbench6Multi || 0,
              gpuScore: laptop.detailedSpecs?.gpu?.benchmarks?.wildlifeExtreme || 0
            }))}
          />
        </div>

        <ImportanceAdjuster laptops={items} weights={weights} setWeights={setWeights} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Giá tiền</h2>
          <div className="grid grid-cols-2 gap-8">
            {items.map((laptop) => (
              <div key={laptop.id} className="text-center">
                <div className="text-2xl font-bold mb-2 dark:text-white">{laptop.price || 'Không có thông tin'}</div>
                <RatingBar score={laptop.benchmarks?.value || 0} label="Đánh giá" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">So sánh chi tiết</h2>
          <ComparisonTable laptops={items} title="Vỏ" specs={caseSpecs} />
          <ComparisonTable laptops={items} title="Màn hình" specs={displaySpecs} />
          <ComparisonTable laptops={items} title="Cấu hình" specs={performanceSpecs} />
          <ComparisonTable laptops={items} title="Pin" specs={batterySpecs} />
          <ComparisonTable laptops={items} title="Tùy chọn kết nối" specs={connectivitySpecs} />
          <ComparisonTable laptops={items} title="Input" specs={inputSpecs} />
        </div>

      </main>
      <Footer />
    </div>
  )
}