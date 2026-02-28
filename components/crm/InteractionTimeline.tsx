'use client';

import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, MessageSquare, FileText, Calendar, StickyNote } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface Interaction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'ticket' | 'chat';
  subject: string;
  description?: string;
  userName: string;
  createdAt: Date;
}

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export function InteractionTimeline({ interactions }: InteractionTimelineProps) {
  if (interactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Interaction History
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
          No interactions found
        </div>
      </Card>
    );
  }

  const getIcon = (type: Interaction['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'email':
        return <Mail className={iconClass} />;
      case 'call':
        return <Phone className={iconClass} />;
      case 'meeting':
        return <Calendar className={iconClass} />;
      case 'note':
        return <StickyNote className={iconClass} />;
      case 'ticket':
        return <FileText className={iconClass} />;
      case 'chat':
        return <MessageSquare className={iconClass} />;
      default:
        return <StickyNote className={iconClass} />;
    }
  };

  const getIconColor = (type: Interaction['type']) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'call':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'meeting':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      case 'note':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'ticket':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      case 'chat':
        return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Interaction History ({interactions.length})
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Interactions */}
        <div className="space-y-6">
          {interactions.map((interaction, index) => {
            const createdDate =
              interaction.createdAt instanceof Date
                ? interaction.createdAt
                : new Date(interaction.createdAt);

            return (
              <div key={interaction.id} className="relative pl-14">
                {/* Icon */}
                <div
                  className={`absolute left-0 top-0 rounded-full p-2 ${getIconColor(
                    interaction.type
                  )}`}
                >
                  {getIcon(interaction.type)}
                </div>

                {/* Content */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {interaction.subject}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {interaction.type.charAt(0).toUpperCase() +
                          interaction.type.slice(1)}{' '}
                        by {interaction.userName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(createdDate, { addSuffix: true })}
                    </span>
                  </div>

                  {interaction.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                      {interaction.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

