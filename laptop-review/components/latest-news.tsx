"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Calendar, User, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { newsService } from "../services/firebaseServices"
import NewsModal from "./news-modal"

// Define the FirestoreNewsItem interface
interface FirestoreNewsItem {
  id: string;
  title?: string;
  image?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  date?: string;
  readTime?: string;
  createdAt?: any; // Firestore timestamp
}

// Define the NewsItem interface
interface NewsItem {
  id?: string;
  title: string;
  image: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  createdAt?: any; // Firestore timestamp
}

export default function LatestNews() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideStartTime = useRef<number | null>(null);

  // Fetch news items from Firestore
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchedNews = await newsService.getLatest(3) as FirestoreNewsItem[];
        
        // Add a default content if none exists
        const processedNews = fetchedNews.map(news => ({
          id: news.id,
          title: news.title || '',
          image: news.image || '',
          excerpt: news.excerpt || '',
          content: news.content || `<p>${news.excerpt || ''}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec nisl. Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec nisl.</p><p>Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec nisl. Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec nisl.</p>`,
          author: news.author || 'Unknown Author',
          date: news.date || new Date().toLocaleDateString(),
          readTime: news.readTime || '5 min read',
          createdAt: news.createdAt
        }));
        
        setNewsItems(processedNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const openNewsModal = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsModalOpen(false);
    // Keep a small delay before clearing the selected news
    // to avoid flickering during modal close animation
    setTimeout(() => {
      setSelectedNews(null);
    }, 300);
  };

  const handleSelectRelatedNews = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    // No need to open modal as it's already open
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1));
  };

  // Handle drag events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    slideStartTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const threshold = containerWidth * 0.2;
    
    const maxTranslate = containerWidth * 0.25;
    const clampedDelta = Math.max(Math.min(deltaX, maxTranslate), -maxTranslate);
    
    setTranslateX(clampedDelta);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const threshold = containerWidth * 0.2;
    const clickDuration = Date.now() - (slideStartTime.current || 0);
    
    // If it's a short click (less than 200ms) and minimal movement, treat as a click not a drag
    if (clickDuration < 200 && Math.abs(deltaX) < 10) {
      // Find which slide was clicked
      const currentNewsItem = newsItems[currentSlide];
      openNewsModal(currentNewsItem);
    } else {
      // Handle as a drag
      if (deltaX > threshold) {
        prevSlide();
      } else if (deltaX < -threshold) {
        nextSlide();
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTranslateX(0);
    }
    setShowControls(false);
  };
  
  const handleMouseEnter = () => {
    setShowControls(true);
  };

  // Auto-rotating slides
  useEffect(() => {
    if (newsItems.length === 0 || isModalOpen) return; // Don't rotate when modal is open
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentSlide, newsItems.length, isModalOpen]);

  useEffect(() => {
    const preventDefault = (e: Event) => {
      if (isDragging) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('dragstart', preventDefault);
    return () => {
      document.removeEventListener('dragstart', preventDefault);
    };
  }, [isDragging]);

  // Add entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
        <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">Không có tin tức nào.</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`relative transition-opacity duration-700 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left arrow navigation */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-opacity duration-300 ${
            showControls ? 'opacity-80' : 'opacity-0'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Right arrow navigation */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-opacity duration-300 ${
            showControls ? 'opacity-80' : 'opacity-0'
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>

        <div 
          className="overflow-hidden rounded-xl"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
              transitionProperty: isDragging ? 'none' : 'transform'
            }}
          >
            {newsItems.map((item) => (
              <div 
                key={item.id} 
                className="relative w-full flex-shrink-0 cursor-pointer"
              >
                <div className="relative h-[400px] w-full bg-gray-200 dark:bg-gray-700">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent dark:from-black/80" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                    <p className="mb-4 text-gray-200 line-clamp-2 max-w-3xl">{item.excerpt}</p>
                    
                    <div className="flex items-center mb-4 text-gray-300 text-sm">
                      <div className="flex items-center mr-4">
                        <User className="w-4 h-4 mr-1" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openNewsModal(item);
                      }}
                      className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                    >
                      Đọc Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? "bg-white scale-125" 
                  : "bg-white/50 scale-100"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* News modal */}
      <NewsModal 
        isOpen={isModalOpen} 
        onClose={closeNewsModal} 
        newsItem={selectedNews}
        relatedNews={newsItems} 
        onSelectRelatedNews={handleSelectRelatedNews}
      />
    </>
  );
}