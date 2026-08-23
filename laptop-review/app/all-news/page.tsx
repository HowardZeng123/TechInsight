"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, User, Clock } from "lucide-react"
import { newsService } from "@/services/firebaseServices"
import NewsModal from "@/components/news-modal"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

interface NewsItem {
  id?: string;
  title: string;
  image: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  createdAt?: any;
}

export default function AllNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchedNews = await newsService.getAll();
        setNews(fetchedNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const openNewsModal = (item: NewsItem) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedNews(null);
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container flex-grow px-4 py-8 mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Về Trang Chủ
          </Link>
          <h1 className="mt-4 text-3xl font-bold dark:text-white">Tất cả Tin Tức</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cập nhật tin tức công nghệ mới nhất.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">Không tìm thấy tin tức nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <div 
                key={item.id} 
                className="group cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                onClick={() => openNewsModal(item)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-4">
                    <div className="flex items-center mr-3">
                      <User className="w-3 h-3 mr-1" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center mr-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button className="text-blue-600 font-medium text-sm flex items-center group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
                      Đọc Thêm →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      
      <NewsModal 
        isOpen={isModalOpen} 
        onClose={closeNewsModal} 
        newsItem={selectedNews}
        relatedNews={news} 
        onSelectRelatedNews={(item) => setSelectedNews(item)}
      />
    </div>
  )
}
