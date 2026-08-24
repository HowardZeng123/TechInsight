"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { articleService } from "../services/firebaseServices"
import ArticleModal from "./article-modal"

// Define the Article interface
interface Article {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  createdAt?: any; // Firestore timestamp
}

// Define the NewsItem interface to match what the modal expects
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
  category?: string; // Optional for NewsItem
}

export default function ArticleHighlights() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const articlesRef = useRef<HTMLDivElement>(null);

  // Convert Article to NewsItem for the modal
  const articleToNewsItem = (article: Article): NewsItem => {
    return {
      id: article.id,
      title: article.title,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      author: "Đội ngũ TechInsight", // Default author for articles
      date: article.date,
      readTime: `5 phút đọc`, 
      createdAt: article.createdAt,
      category: article.category
    };
  };

  // Fetch articles from Firestore
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await articleService.getLatest(3);
        setArticles(fetchedArticles);
        
        // Convert articles to newsItems for the modal
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

  // Functions to handle modal
  const openArticleModal = (article: Article) => {
    setSelectedArticle(articleToNewsItem(article));
    setIsModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    // Keep a small delay before clearing the selected news
    // to avoid flickering during modal close animation
    setTimeout(() => {
      setSelectedArticle(null);
    }, 300);
  };

  const handleSelectRelatedArticle = (newsItem: NewsItem) => {
    setSelectedArticle(newsItem);
  };

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && articlesRef.current) {
            const articleElements = articlesRef.current.querySelectorAll('.article-card')
            articleElements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add('animate-fade-up')
              }, index * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (articlesRef.current) {
      observer.observe(articlesRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [articles]); // Re-run when articles are loaded

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">No articles available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3" ref={articlesRef}>
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="group article-card opacity-0 cursor-pointer"
            onClick={() => openArticleModal(article)}
          >
            <div className="overflow-hidden transition-all duration-200 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm group-hover:shadow-md hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-0 right-0 px-3 py-1 m-2 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-full">
                  {article.category}
                </div>
              </div>
              <div className="p-4">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{article.date}</p>
                <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{article.excerpt}</p>
                <button className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  Đọc Bài Viết →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Article modal */}
      {selectedArticle && (
        <ArticleModal
          isOpen={isModalOpen}
          onClose={closeArticleModal}
          newsItem={selectedArticle}
          relatedNews={newsItems}
          onSelectRelatedNews={handleSelectRelatedArticle}
        />
      )}
    </>
  );
}