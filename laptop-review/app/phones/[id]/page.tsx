"use client";

import { useParams } from "next/navigation";
import { usePhoneData } from "@/hooks/usePhoneData";
import { useState, useEffect } from "react";
import { smartphoneService } from "@/services/firebaseServices";
import { SimilarSmartphone, Smartphone } from "@/types/smartphone";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Image from "next/image";
import Link from "next/link";
import PhoneCard from "@/components/phone-card";
import { Heart, ChevronRight, Check } from "lucide-react";

export default function PhoneDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { phone, loading, error } = usePhoneData(id || '');
  const [similarPhones, setSimilarPhones] = useState<Smartphone[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    if (!phone) return;

    const similarIds = phone.similarPhoneIds || [];
    if (similarIds.length === 0) return;

    async function fetchSimilarPhones() {
      try {
        setLoadingSimilar(true);
        const promises = similarIds.map(
          (similarId: string) => smartphoneService.getById(similarId)
        );

        const results = await Promise.all(promises);
        const validResults = results.filter((item: any) => item !== null) as Smartphone[];
        setSimilarPhones(validResults);
      } catch (error) {
        console.error("Error fetching similar phones:", error);
      } finally {
        setLoadingSimilar(false);
      }
    }

    fetchSimilarPhones();
  }, [phone]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !phone) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Phone not found</h1>
            <p className="text-gray-600 dark:text-gray-400">
              The smartphone you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/all-phones" className="mt-4 inline-block text-blue-600 hover:underline">
              Return to all phones
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/all-phones" className="hover:text-gray-900 dark:hover:text-white">Điện thoại</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{phone.name}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-80 md:h-full min-h-[300px] bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              {phone.image ? (
                <Image src={phone.image} alt={phone.name} fill style={{objectFit: 'contain'}} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{phone.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{phone.price}</span>
                {phone.originalPrice && phone.originalPrice !== phone.price && (
                  <span className="text-lg text-gray-500 line-through">{phone.originalPrice}</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{phone.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Vi xử lý</span>
                  <span className="font-semibold dark:text-white">{phone.specs.soc}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Màn hình</span>
                  <span className="font-semibold dark:text-white">{phone.specs.display}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">RAM & Bộ nhớ</span>
                  <span className="font-semibold dark:text-white">{phone.specs.ram} / {phone.specs.storage}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Pin & Sạc</span>
                  <span className="font-semibold dark:text-white">{phone.specs.battery}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                {phone.purchaseLink && (
                  <a href={phone.purchaseLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors">
                    Mua ngay
                  </a>
                )}
                <Link href={`/compare-select?category=phone&current=${phone.id}`} className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors">
                  So sánh
                </Link>
                <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông số kỹ thuật chi tiết</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {Object.entries({
                    "Vi xử lý (SoC)": phone.specs.soc,
                    "RAM": phone.specs.ram,
                    "Bộ nhớ trong": phone.specs.storage,
                    "Màn hình": phone.specs.display,
                    "Pin": phone.specs.battery,
                    "Camera sau": phone.specs.rearCamera || "Đang cập nhật",
                    "Camera trước": phone.specs.frontCamera || "Đang cập nhật",
                    "Hệ điều hành": phone.specs.operatingSystem || "Đang cập nhật",
                    "Sạc": phone.specs.charging || "Đang cập nhật",
                    "Kháng nước": phone.specs.waterResistance || "Đang cập nhật",
                  }).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                      <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200 w-1/3 border-t border-gray-200 dark:border-gray-700">{key}</th>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {phone.longDescription && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Đánh giá chi tiết</h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  {phone.longDescription}
                </div>
              </div>
            )}
            
            {phone.pros && phone.pros.length > 0 && (
               <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-900/30">
                   <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4">Ưu điểm</h3>
                   <ul className="space-y-2 text-green-700 dark:text-green-300">
                     {phone.pros.map((pro, idx) => (
                       <li key={idx} className="flex items-start">
                         <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                         <span>{pro}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 {phone.cons && phone.cons.length > 0 && (
                   <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
                     <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4">Nhược điểm</h3>
                     <ul className="space-y-2 text-red-700 dark:text-red-300">
                       {phone.cons.map((con, idx) => (
                         <li key={idx} className="flex items-start">
                           <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold">-</span>
                           <span>{con}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Điểm Benchmarks</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {phone.benchmarks ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium dark:text-gray-300">Hiệu năng</span>
                      <span className="text-sm font-bold dark:text-white">{phone.benchmarks.performanceScore || "N/A"}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(phone.benchmarks.performanceScore || 0) * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium dark:text-gray-300">Camera</span>
                      <span className="text-sm font-bold dark:text-white">{phone.benchmarks.cameraScore || "N/A"}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(phone.benchmarks.cameraScore || 0) * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium dark:text-gray-300">Pin</span>
                      <span className="text-sm font-bold dark:text-white">{phone.benchmarks.batteryScore || "N/A"}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(phone.benchmarks.batteryScore || 0) * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium dark:text-gray-300">Tổng quan</span>
                      <span className="text-sm font-bold dark:text-white">{phone.benchmarks.overall || "N/A"}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(phone.benchmarks.overall || 0) * 10}%` }}></div>
                    </div>
                  </div>
                  
                  {(phone.benchmarks.antutu || phone.benchmarks.geekbenchMulti) && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Điểm số chi tiết</h4>
                      {phone.benchmarks.antutu && (
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">AnTuTu</span>
                          <span className="font-medium dark:text-white">{phone.benchmarks.antutu}</span>
                        </div>
                      )}
                      {phone.benchmarks.geekbenchMulti && (
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Geekbench Multi</span>
                          <span className="font-medium dark:text-white">{phone.benchmarks.geekbenchMulti}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Chưa có thông tin điểm số cho sản phẩm này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Phones */}
        {similarPhones.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPhones.map((similarPhone) => (
                <PhoneCard key={similarPhone.id} phone={similarPhone} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
