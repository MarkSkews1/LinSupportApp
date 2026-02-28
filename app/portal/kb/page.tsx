'use client';

import { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { SearchBar } from '@/components/kb/SearchBar';
import { Card } from '@/components/ui/Card';
import { BookOpen, TrendingUp, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  viewCount?: number;
}

export default function PortalKBPage() {
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPopularArticles();
  }, []);

  const fetchPopularArticles = async () => {
    try {
      const response = await fetch('/api/articles/popular?limit=5');
      if (response.ok) {
        const data = await response.json();
        setPopularArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching popular articles:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `/api/articles?q=${encodeURIComponent(query)}&status=published`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.articles || []);
      }
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Knowledge Base
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to common questions and learn how to use our services
            </p>
          </div>

          {/* Search */}
          <Card className="mb-12">
            <div className="p-6">
              <SearchBar onSearch={handleSearch} placeholder="Search for help articles..." />
            </div>
          </Card>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Search Results
              </h2>
              {isSearching ? (
                <Card>
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <SearchIcon className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                    Searching...
                  </div>
                </Card>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((article) => (
                    <Link key={article._id} href={`/portal/kb/${article.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {article.excerpt}
                          </p>
                          {article.viewCount !== undefined && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {article.viewCount} views
                            </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No articles found for "{searchQuery}"
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Popular Articles */}
          {!searchQuery && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Popular Articles
                </h2>
              </div>
              {popularArticles.length > 0 ? (
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <Link key={article._id} href={`/portal/kb/${article.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 w-10 h-10 flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 dark:text-blue-400 font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {article.excerpt}
                              </p>
                              {article.viewCount !== undefined && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {article.viewCount} views
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No articles available yet
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

