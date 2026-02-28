'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { Loading } from '@/components/ui/Loading';
import { ArrowLeft, Clock, User, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  _id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  isInternal: boolean;
  createdAt: Date;
}

export default function TicketDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ticketId = params?.id as string;
  const email = searchParams?.get('email') || '';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId && email) {
      fetchTicketDetails();
    }
  }, [ticketId, email]);

  const fetchTicketDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/portal/tickets/${ticketId}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }

      const data = await response.json();
      setTicket(data.ticket);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError('Failed to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading ticket..." />
        </div>
      </PortalLayout>
    );
  }

  if (error || !ticket) {
    return (
      <PortalLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'Ticket not found'}
            </p>
            <Link href="/portal/tickets">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Tickets
              </Button>
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const createdDate =
    ticket.createdAt instanceof Date ? ticket.createdAt : new Date(ticket.createdAt);

  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href={`/portal/tickets?email=${encodeURIComponent(email)}`}>
            <Button variant="outline" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Tickets
            </Button>
          </Link>

          {/* Ticket Header */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {ticket.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Ticket ID: {ticket._id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(createdDate, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </h3>
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>Submitted by: {ticket.customerName}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Comments */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Updates & Comments ({comments.length})
                </h2>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No updates yet. We'll notify you when there are any updates to your ticket.
                </div>
              ) : (
                <div className="space-y-4">
                  {comments
                    .filter((comment) => !comment.isInternal)
                    .map((comment) => {
                      const commentDate =
                        comment.createdAt instanceof Date
                          ? comment.createdAt
                          : new Date(comment.createdAt);

                      return (
                        <div
                          key={comment._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-2">
                                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {comment.createdByName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDistanceToNow(commentDate, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </Card>

          {/* Help Text */}
          <Card className="mt-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Our support team is reviewing your ticket and will respond soon. You'll receive
                updates via email at <strong>{ticket.customerEmail}</strong>.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

