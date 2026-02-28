'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Eye, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ArticleStatus } from '@/types';

interface ArticleViewerProps {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: ArticleStatus;
  categoryName?: string;
  tags?: string[];
  viewCount?: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  onBack?: () => void;
  onMarkHelpful?: () => void;
  onMarkNotHelpful?: () => void;
}

export function ArticleViewer({
  title,
  content,
  status,
  categoryName,
  tags,
  viewCount = 0,
  helpfulCount = 0,
  notHelpfulCount = 0,
  createdByName,
  createdAt,
  updatedAt,
  onBack,
  onMarkHelpful,
  onMarkNotHelpful,
}: ArticleViewerProps) {
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted && onMarkHelpful) {
      onMarkHelpful();
      setHasVoted(true);
    }
  };

  const handleNotHelpful = () => {
    if (!hasVoted && onMarkNotHelpful) {
      onMarkNotHelpful();
      setHasVoted(true);
    }
  };

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
  const updatedDate = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
      )}

      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h1>
              {categoryName && (
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {categoryName}
                </p>
              )}
            </div>
            {getStatusBadge()}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {helpfulCount} helpful
            </span>
            <span className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" />
              {notHelpfulCount} not helpful
            </span>
            <span>•</span>
            <span>By {createdByName}</span>
            <span>•</span>
            <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
            {updatedDate > createdDate && (
              <>
                <span>•</span>
                <span>Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Feedback Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Was this article helpful?
            </h3>
            <div className="flex gap-3">
              <Button
                variant={hasVoted ? 'secondary' : 'default'}
                onClick={handleHelpful}
                disabled={hasVoted}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes, helpful
              </Button>
              <Button
                variant={hasVoted ? 'secondary' : 'outline'}
                onClick={handleNotHelpful}
                disabled={hasVoted}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Not helpful
              </Button>
            </div>
            {hasVoted && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                Thank you for your feedback!
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

