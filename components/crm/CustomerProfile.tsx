'use client';

import { formatDistanceToNow } from 'date-fns';
import { User, Mail, Phone, Building, Tag, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CustomerProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags?: string[];
  createdAt: Date;
  supportTickets?: number;
  activeConversations?: number;
  lastInteraction?: Date;
}

export function CustomerProfile({
  firstName,
  lastName,
  email,
  phone,
  company,
  status,
  tags,
  createdAt,
  supportTickets = 0,
  activeConversations = 0,
  lastInteraction,
}: CustomerProfileProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'customer':
        return <Badge variant="success">Customer</Badge>;
      case 'prospect':
        return <Badge variant="default">Prospect</Badge>;
      case 'lead':
        return <Badge variant="secondary">Lead</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return null;
    }
  };

  const createdDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const lastInteractionDate = lastInteraction
    ? (lastInteraction instanceof Date ? lastInteraction : new Date(lastInteraction))
    : null;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-4">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {firstName} {lastName}
              </h2>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {email}
              </div>
            </div>
          </div>

          {phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {phone}
                </div>
              </div>
            </div>
          )}

          {company && (
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Company</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {company}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Customer Since</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDistanceToNow(createdDate, { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Support Metrics */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Support Activity
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {supportTickets}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total Tickets
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeConversations}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Active Chats
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {lastInteractionDate
                  ? formatDistanceToNow(lastInteractionDate, { addSuffix: true })
                  : 'Never'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Last Contact
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

