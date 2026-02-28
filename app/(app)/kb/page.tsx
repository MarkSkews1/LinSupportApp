'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Filter } from 'lucide-react';
import { ArticleList } from '@/components/kb/ArticleList';
import { ArticleViewer } from '@/components/kb/ArticleViewer';
import { SearchBar } from '@/components/kb/SearchBar';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ArticleStatus } from '@/types';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  status: ArticleStatus;
  categoryId?: string;
  categoryName?: string;
  tags?: string[];
  viewCount?: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('published');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, statusFilter]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append('q', searchQuery);
      }

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const handleMarkHelpful = async () => {
    if (!selectedArticle) return;

    try {
      const response = await fetch(`/api/articles/${selectedArticle._id}/helpful`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedArticle({
          ...selectedArticle,
          helpfulCount: data.article.helpfulCount,
        });
      }
    } catch (error) {
      console.error('Error marking article helpful:', error);
    }
  };

  const handleMarkNotHelpful = async () => {
    if (!selectedArticle) return;

    try {
      const response = await fetch(`/api/articles/${selectedArticle._id}/not-helpful`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedArticle({
          ...selectedArticle,
          notHelpfulCount: data.article.notHelpfulCount,
        });
      }
    } catch (error) {
      console.error('Error marking article not helpful:', error);
    }
  };

  if (selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ArticleViewer
          id={selectedArticle._id}
          title={selectedArticle.title}
          content={selectedArticle.content}
          excerpt={selectedArticle.excerpt}
          status={selectedArticle.status}
          categoryName={selectedArticle.categoryName}
          tags={selectedArticle.tags}
          viewCount={selectedArticle.viewCount}
          helpfulCount={selectedArticle.helpfulCount}
          notHelpfulCount={selectedArticle.notHelpfulCount}
          createdByName={selectedArticle.createdByName}
          createdAt={selectedArticle.createdAt}
          updatedAt={selectedArticle.updatedAt}
          onBack={handleBack}
          onMarkHelpful={handleMarkHelpful}
          onMarkNotHelpful={handleMarkNotHelpful}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Knowledge Base
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse and search help articles
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? 'Loading...' : `${articles.length} article${articles.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Article List */}
      <ArticleList
        articles={articles}
        isLoading={isLoading}
        onArticleClick={handleArticleClick}
      />
    </div>
  );
}

