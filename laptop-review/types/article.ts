export interface Article {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  views?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  categories?: string[];
} 