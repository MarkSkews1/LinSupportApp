'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TicketList } from '@/components/tickets/TicketList';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { ITicket, TicketStatus, TicketPriority } from '@/types';
import { Plus, Search } from 'lucide-react';

export default function TicketsPageClient() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, searchQuery]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/tickets?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = () => {
    // TODO: Open create ticket modal
    alert('Create ticket modal - to be implemented');
  };

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600">Manage and track customer support requests</p>
          </div>
          <Button onClick={handleCreateTicket}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.PENDING}>Pending</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.RESOLVED}>Resolved</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value={TicketPriority.LOW}>Low</option>
                <option value={TicketPriority.MEDIUM}>Medium</option>
                <option value={TicketPriority.HIGH}>High</option>
                <option value={TicketPriority.URGENT}>Urgent</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          onCreateTicket={handleCreateTicket}
        />
      </div>
    </AppShell>
  );
}

