# AllTech Laptop News Section

This document explains the structure and functionality of the news section in the AllTech laptop review website.

## Overview

The news section provides a organized and visually appealing platform for users to read laptop-related news articles, reviews, guides, and trends. It consists of a main news page that displays a variety of articles categorized by topic and individual article detail pages.

## Components Structure

The news section is built with the following components:

1. **NewsHeader** (`components/news/news-header.tsx`)
   - Contains the section title, search functionality, and category links.
   - Allows users to search for specific articles.

2. **FeaturedArticle** (`components/news/featured-article.tsx`)
   - Displays the most prominent article with a large image and excerpt.
   - Links to the full article detail page.

3. **ArticleGrid** (`components/news/article-grid.tsx`)
   - Shows a responsive grid of articles, filterable by category.
   - Each article card displays an image, title, excerpt, and metadata.

4. **NewsCategories** (`components/news/news-categories.tsx`)
   - Provides a sidebar with clickable category filters.
   - Allows users to filter articles by topic (Tech, Reviews, Guides, etc.).

5. **TrendingArticles** (`components/news/trending-articles.tsx`)
   - Displays a list of the most popular articles based on view count.
   - Compact design for sidebar placement.

6. **NewsletterSignup** (`components/news/newsletter-signup.tsx`)
   - Enables users to subscribe to the news newsletter.
   - Includes form validation and success feedback.

## Data Management

Article data is managed centrally in `data/articles.ts` with the following structure:

- **Article Interface** - Defines the standard format for article data
- **Articles Array** - Contains all article data
- **Helper Functions**:
  - `getFeaturedArticle()` - Returns the featured article
  - `getTrendingArticles()` - Returns trending articles
  - `getArticlesByCategory()` - Filters articles by category
  - `getArticleById()` - Retrieves a specific article by ID

## Pages

1. **Main News Page** (`app/news/page.tsx`)
   - Serves as the entry point to the news section
   - Combines all components in a responsive layout

2. **Article Detail Page** (`app/news/[id]/page.tsx`)
   - Dynamically renders individual article content
   - Includes full article text, images, and metadata
   - Provides navigation back to the main news page

## Features

- **Category Filtering** - Users can filter articles by topic
- **Search Functionality** - Users can search for specific content
- **Responsive Design** - Optimized for all device sizes
- **Newsletter Subscription** - Users can subscribe for updates
- **Article Sharing** - Share articles via social media

## Future Enhancements

- Add comments section for article discussion
- Implement article rating system
- Add author profile pages
- Integrate with backend API for dynamic content
- Add pagination for larger article collections 