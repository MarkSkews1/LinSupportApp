'use client';

import { ArticleCard } from './ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { BookOpen } from 'lucide-react';
import { ArticleStatus } from '@/types';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
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
}

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  onArticleClick?: (article: Article) => void;
}

export function ArticleList({
  articles,
  isLoading = false,
  onArticleClick,
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Loading articles..." />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No articles found"
        description="Create your first knowledge base article"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          id={article._id}
          title={article.title}
          excerpt={article.excerpt}
          slug={article.slug}
          status={article.status}
          categoryName={article.categoryName}
          tags={article.tags}
          viewCount={article.viewCount}
          helpfulCount={article.helpfulCount}
          notHelpfulCount={article.notHelpfulCount}
          createdByName={article.createdByName}
          createdAt={article.createdAt}
          onClick={() => onArticleClick?.(article)}
        />
      ))}
    </div>
  );
}

