"use client"

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { X, Calendar, User, Clock, Share2, Bookmark, ThumbsUp } from "lucide-react";

interface NewsItem {
  id?: string;
  title: string;
  image: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category?: string; // Add category to determine the type of content
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: NewsItem | null;
  relatedNews: NewsItem[];
  onSelectRelatedNews: (newsItem: NewsItem) => void;
}

export default function NewsModal({ 
  isOpen, 
  onClose, 
  newsItem, 
  relatedNews,
  onSelectRelatedNews
}: NewsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [hasLiked, setHasLiked] = useState<{ [key: string]: boolean }>({});

  // Generate consistent likes based on item ID
  useEffect(() => {
    if (newsItem?.id && !likes[newsItem.id]) {
      // Use a deterministic method to generate consistent likes based on the ID
      // This creates a hash-like number from the string ID
      let hashValue = 0;
      const id = newsItem.id.toString();
      for (let i = 0; i < id.length; i++) {
        hashValue = ((hashValue << 5) - hashValue) + id.charCodeAt(i);
        hashValue = hashValue & hashValue; // Convert to 32bit integer
      }
      
      // Use the hash to generate a number between 12 and 230
      const consistentLikes = Math.abs(hashValue % 219) + 12;
      
      setLikes(prev => ({
        ...prev,
        [newsItem.id as string]: consistentLikes
      }));
    }
  }, [newsItem, likes]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle scroll locking when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLike = () => {
    if (!newsItem?.id) return;
    
    const newsId = newsItem.id;
    
    if (hasLiked[newsId]) {
      // Unlike
      setLikes(prev => ({
        ...prev,
        [newsId]: prev[newsId] - 1
      }));
      setHasLiked(prev => ({
        ...prev,
        [newsId]: false
      }));
    } else {
      // Like
      setLikes(prev => ({
        ...prev,
        [newsId]: prev[newsId] + 1
      }));
      setHasLiked(prev => ({
        ...prev,
        [newsId]: true
      }));
    }
  };

  if (!isOpen || !newsItem) return null;

  // Filter out the current news item from related news
  const filteredRelatedNews = relatedNews.filter(item => item.id !== newsItem.id).slice(0, 2);

  // Determine the content type based on the category or a default
  const getContentLabel = () => {
    // Check if the item has a category that indicates it's an article
    if (newsItem.category) {
      return "BÀI VIẾT MỚI NHẤT";
    }
    // Default to news if no category is specified
    return "TIN TỨC MỚI NHẤT";
  };

  // Determine the related content section label
  const getRelatedContentLabel = () => {
    if (newsItem.category) {
      return "Bài Viết Liên Quan";
    }
    return "Tin Tức Liên Quan";
  };

  const formatContent = (content: string) => {
    // First, split content into lines to handle block elements
    const lines = content.split('\n');
    let formattedLines = [];
    let inList = false;
    let listItems = [];
    let listType = '';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        if (inList && listItems.length > 0) {
          // End the current list if we were building one
          const listHtml = listType === 'ol' 
            ? `<ol class="list-decimal pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ol>`
            : `<ul class="list-disc pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ul>`;
          formattedLines.push(listHtml);
          listItems = [];
          inList = false;
        }
        continue;
      }

      // Handle blockquotes
      if (line.startsWith('"') && (line.includes("said") || line.length > 40) && line.endsWith('"')) {
        // Full line is a quote
        formattedLines.push(`<blockquote class="border-l-4 border-blue-500 pl-4 py-3 my-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 italic rounded">${line}</blockquote>`);
        continue;
      }

      // Handle numbered lists (1. Item)
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        if (!inList || listType !== 'ol') {
          // End previous list if we were in one
          if (inList && listItems.length > 0) {
            const listHtml = listType === 'ol' 
              ? `<ol class="list-decimal pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ol>`
              : `<ul class="list-disc pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ul>`;
            formattedLines.push(listHtml);
            listItems = [];
          }
          inList = true;
          listType = 'ol';
        }
        listItems.push(`<li class="mb-1">${numberedListMatch[2]}</li>`);
        continue;
      }

      // Handle bulleted lists (- Item or * Item)
      const bulletListMatch = line.match(/^[-*]\s+(.+)$/);
      if (bulletListMatch) {
        if (!inList || listType !== 'ul') {
          // End previous list if we were in one
          if (inList && listItems.length > 0) {
            const listHtml = listType === 'ol' 
              ? `<ol class="list-decimal pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ol>`
              : `<ul class="list-disc pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ul>`;
            formattedLines.push(listHtml);
            listItems = [];
          }
          inList = true;
          listType = 'ul';
        }
        listItems.push(`<li class="mb-1">${bulletListMatch[1]}</li>`);
        continue;
      }

      // End list if we're not on a list item anymore
      if (inList && listItems.length > 0) {
        const listHtml = listType === 'ol' 
          ? `<ol class="list-decimal pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ol>`
          : `<ul class="list-disc pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ul>`;
        formattedLines.push(listHtml);
        listItems = [];
        inList = false;
      }

      // Format inline content
      
      // Format quotes within text (keep short quotes inline)
      line = line.replace(/"([^"]+)"/g, (match, quote) => {
        // For short quotes or quotes not at the beginning of a line, keep them inline
        if (quote.length < 40 && !line.startsWith('"')) {
          return `<span class="text-gray-700 dark:text-gray-300">"${quote}"</span>`;
        }
        return match; // Leave longer quotes for blockquote handling
      });
      
      // Handle bold text
      line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
      
      // Handle headings
      if (line.startsWith('#')) {
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          const headingClass = level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg';
          formattedLines.push(`<h${level} class="${headingClass} font-bold my-4 text-gray-800 dark:text-gray-200">${text}</h${level}>`);
          continue;
        }
      }

      // Add as paragraph
      formattedLines.push(`<p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">${line}</p>`);
    }
    
    // Close any remaining list
    if (inList && listItems.length > 0) {
      const listHtml = listType === 'ol' 
        ? `<ol class="list-decimal pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ol>`
        : `<ul class="list-disc pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300">${listItems.join('')}</ul>`;
      formattedLines.push(listHtml);
    }
    
    return formattedLines.join('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-auto animate-scale-in"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 z-10 transition-all duration-200 shadow-md"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        
        {/* Header image */}
        <div className="relative h-80 w-full bg-gray-100 dark:bg-gray-700">
          <Image
            src={newsItem.image}
            alt={newsItem.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent dark:from-black/80" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
              {getContentLabel()}
            </div>
            <h2 className="text-3xl font-bold mb-2 leading-tight">{newsItem.title}</h2>
            
            <div className="flex items-center text-gray-300 text-sm mt-4">
              <div className="flex items-center mr-6">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{newsItem.author}</span>
              </div>
              <div className="flex items-center mr-6">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{newsItem.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{newsItem.readTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social sharing and actions */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Share2 className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Chia Sẻ</span>
            </button>
            <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Bookmark className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Lưu</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`flex items-center transition-colors ${hasLiked[newsItem.id || ''] ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
              onClick={handleLike}
            >
              <ThumbsUp className={`w-5 h-5 mr-1 ${hasLiked[newsItem.id || ''] ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
              <span className="text-sm font-medium">{likes[newsItem.id || ''] || 0}</span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-8 py-6">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
            {newsItem.excerpt}
          </p>
          
          <div 
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none news-content"
            dangerouslySetInnerHTML={{ 
              __html: newsItem.content ? formatContent(newsItem.content) : `<p>${newsItem.excerpt}</p>` 
            }}
          />
          
          {/* Related Content */}
          {filteredRelatedNews.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 dark:text-white">{getRelatedContentLabel()}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRelatedNews.map((item) => (
                  <div 
                    key={item.id} 
                    className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-800"
                    onClick={() => onSelectRelatedNews(item)}
                  >
                    <div className="relative w-24 h-20">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-6 rounded-b-lg">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
              <Image
                src="/authors/author-placeholder.jpg"
                alt={newsItem.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold dark:text-white">{newsItem.author}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phóng Viên Công Nghệ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
