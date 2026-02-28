'use client';

import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ticket, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PortalHomePage() {
  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get support, track your tickets, or browse our knowledge base
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/portal/submit">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-4 mb-4">
                  <Ticket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Submit a Ticket
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Report an issue or request support
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/portal/tickets">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4 mb-4">
                  <HelpCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  My Tickets
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and track your support tickets
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/portal/kb">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-4 mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Knowledge Base
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find answers and helpful articles
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/portal/chat">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-4 mb-4">
                  <MessageSquare className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Live Chat
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chat with our support team
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* FAQ Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                How do I submit a support ticket?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click on "Submit a Ticket" above, fill out the form with your issue details,
                and our team will get back to you as soon as possible.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                How can I track my existing tickets?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Go to "My Tickets" and enter your email address to view all your support
                tickets and their current status.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What is the expected response time?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We aim to respond to all tickets within 24 hours. Urgent issues are
                prioritized and typically receive a response within 4 hours.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I chat with support directly?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Click on "Live Chat" to start a conversation with our support team
                during business hours.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}

