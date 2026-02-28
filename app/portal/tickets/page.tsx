'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { Loading } from '@/components/ui/Loading';
import { Search, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MyTicketsPage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams?.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [searchEmail, setSearchEmail] = useState(emailFromUrl);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (emailFromUrl) {
      fetchTickets(emailFromUrl);
    }
  }, [emailFromUrl]);

  const fetchTickets = async (emailToSearch: string) => {
    if (!emailToSearch) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/portal/tickets?email=${encodeURIComponent(emailToSearch)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets || []);
      setSearchEmail(emailToSearch);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets(email);
  };

  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              My Support Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and track all your support requests
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <div className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </div>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loading size="lg" text="Loading your tickets..." />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Card>
              <div className="p-6 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </Card>
          )}

          {/* Tickets List */}
          {!isLoading && !error && searchEmail && (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing tickets for: <strong>{searchEmail}</strong>
                </p>
              </div>

              {tickets.length === 0 ? (
                <Card>
                  <div className="p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No tickets found for this email address
                    </p>
                    <Link href="/portal/submit">
                      <Button>Submit Your First Ticket</Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => {
                    const createdDate =
                      ticket.createdAt instanceof Date
                        ? ticket.createdAt
                        : new Date(ticket.createdAt);

                    return (
                      <Link
                        key={ticket._id}
                        href={`/portal/tickets/${ticket._id}?email=${encodeURIComponent(
                          searchEmail
                        )}`}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                  {ticket.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {ticket.description}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <StatusBadge status={ticket.status} />
                                <PriorityBadge priority={ticket.priority} />
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Created {formatDistanceToNow(createdDate, { addSuffix: true })}
                              </span>
                              <span>•</span>
                              <span>ID: {ticket._id}</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* No Search Yet */}
          {!isLoading && !error && !searchEmail && (
            <Card>
              <div className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Enter your email address above to view your support tickets
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

