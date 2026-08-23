"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { articleService } from "@/services/firebaseServices"
import NewsModal from "@/components/news-modal"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

interface Article {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  createdAt?: any;
}

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
  category?: string;
}

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const articleToNewsItem = (article: Article): NewsItem => {
    return {
      id: article.id,
      title: article.title,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      author: "Đội ngũ TechInsight",
      date: article.date,
      readTime: `5 phút đọc`, 
      createdAt: article.createdAt,
      category: article.category
    };
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await articleService.getAll();
        setArticles(fetchedArticles);
        
        const adaptedArticles = fetchedArticles.map(articleToNewsItem);
        setNewsItems(adaptedArticles);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const openArticleModal = (article: Article) => {
    setSelectedArticle(articleToNewsItem(article));
    setIsModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedArticle(null);
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
          <h1 className="mt-4 text-3xl font-bold dark:text-white">Tất cả Bài Viết</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Khám phá các bài viết chuyên sâu về công nghệ.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div 
                key={article.id} 
                className="group cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                onClick={() => openArticleModal(article)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {article.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{article.date}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button className="text-blue-600 font-medium text-sm flex items-center group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
                      Đọc Bài Viết →
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
        onClose={closeArticleModal} 
        newsItem={selectedArticle}
        relatedNews={newsItems} 
        onSelectRelatedNews={(item) => setSelectedArticle(item)}
      />
    </div>
  )
}
