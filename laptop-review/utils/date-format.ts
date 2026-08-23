/**
 * Formats a date string into a relative time format (e.g., "2 days ago")
 * 
 * @param dateString - Date string in MM/DD/YYYY format or any format accepted by Date constructor
 * @returns Formatted relative date string
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Formats a date string into a long format (e.g., "May 15, 2024")
 * 
 * @param dateString - Date string in MM/DD/YYYY format or any format accepted by Date constructor
 * @returns Formatted long date string
 */
export function formatLongDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Calculates read time based on word count
 * 
 * @param content - Article content
 * @param wordsPerMinute - Reading speed in words per minute (default: 200)
 * @returns Formatted read time string (e.g., "5 min read")
 */
export function calculateReadTime(content: string, wordsPerMinute = 200): string {
  // Remove HTML tags and count words
  const strippedContent = content.replace(/<[^>]*>/g, '');
  const wordCount = strippedContent.split(/\s+/).length;
  
  // Calculate minutes
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
} 