'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { TicketSubmissionForm } from '@/components/portal/TicketSubmissionForm';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function SubmitTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    ticketId?: string;
  } | null>(null);

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    priority: string;
    categoryId?: string;
    customerEmail: string;
    customerName: string;
  }) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      const response = await fetch('/api/portal/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Your ticket has been submitted successfully!',
        ticketId: data.ticket.id,
      });

      // Redirect to tickets page after 3 seconds
      setTimeout(() => {
        router.push(`/portal/tickets?email=${encodeURIComponent(formData.customerEmail)}`);
      }, 3000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit ticket',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Submit a Support Ticket
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          {/* Success/Error Message */}
          {submitStatus && (
            <Card className="mb-6">
              <div
                className={`p-4 flex items-start gap-3 ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      submitStatus.type === 'success'
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-red-900 dark:text-red-100'
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                  {submitStatus.type === 'success' && submitStatus.ticketId && (
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Ticket ID: {submitStatus.ticketId}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Form */}
          <TicketSubmissionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

          {/* Help Text */}
          <Card className="mt-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Need immediate assistance?</strong> For urgent issues, please use our{' '}
                <a href="/portal/chat" className="underline hover:text-blue-700">
                  live chat
                </a>{' '}
                feature.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

