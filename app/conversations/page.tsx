'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Conversation {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: 'active' | 'waiting' | 'closed';
  assignedAgentId?: string;
  assignedAgentName?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  messages: Array<{
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'agent' | 'manager' | 'admin';
    content: string;
    timestamp: Date;
    read: boolean;
  }>;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchConversations();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // This would typically come from your auth context
      // For now, we'll set placeholder values
      setUserId('current-user-id');
      setUserName('Current User');
      setTenantId('tenant-id');
      setRole('agent');
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/conversations');

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Conversations
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage live chat conversations with customers
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Active Conversations
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-4">
              <ConversationList
                conversations={conversations}
                currentUserId={userId}
                onSelectConversation={handleSelectConversation}
                isLoading={isLoading}
                selectedConversationId={selectedConversation?._id}
              />
            </div>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <ChatWindow
              conversationId={selectedConversation._id}
              userId={userId}
              userName={userName}
              tenantId={tenantId}
              role={role}
              initialMessages={selectedConversation.messages}
              className="h-full"
            />
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No conversation selected</p>
                <p className="text-sm">
                  Select a conversation from the list to start chatting
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


