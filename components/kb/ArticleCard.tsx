'use client';

import { formatDistanceToNow } from 'date-fns';
import { Eye, ThumbsUp, ThumbsDown, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArticleStatus } from '@/types';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  status: ArticleStatus;
  categoryName?: string;
  tags?: string[];
  viewCount?: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  createdByName: string;
  createdAt: Date;
  onClick?: () => void;
}

export function ArticleCard({
  title,
  excerpt,
  status,
  categoryName,
  tags,
  viewCount = 0,
  helpfulCount = 0,
  notHelpfulCount = 0,
  createdByName,
  createdAt,
  onClick,
}: ArticleCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case ArticleStatus.PUBLISHED:
        return <Badge variant="success">Published</Badge>;
      case ArticleStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case ArticleStatus.ARCHIVED:
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };

  const createdDate = createdAt instanceof Date ? createdAt : new Date(createdAt);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
              {title}
            </h3>
            {categoryName && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                {categoryName}
              </p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {excerpt}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {helpfulCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsDown className="h-3 w-3" />
              {notHelpfulCount}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span>{createdByName}</span>
            <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

