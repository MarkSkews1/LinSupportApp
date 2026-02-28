'use client';

import { useState } from 'react';
import { Users, Search, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  status: string;
}

export default function CRMPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [crmStatus, setCrmStatus] = useState<boolean | null>(null);

  const handleSearch = async () => {
    if (!searchEmail) return;

    try {
      setIsSearching(true);
      const response = await fetch(
        `/api/crm/search?email=${encodeURIComponent(searchEmail)}`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.customers || []);
      }
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const checkCRMStatus = async () => {
    try {
      const response = await fetch('/api/crm/status');
      if (response.ok) {
        const data = await response.json();
        setCrmStatus(data.connected);
      } else {
        setCrmStatus(false);
      }
    } catch (error) {
      console.error('Error checking CRM status:', error);
      setCrmStatus(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              CRM Integration
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Search and view customer data from LinCRM
            </p>
          </div>
        </div>
        <Button onClick={checkCRMStatus} variant="outline">
          <LinkIcon className="h-4 w-4 mr-2" />
          Check Connection
        </Button>
      </div>

      {/* Connection Status */}
      {crmStatus !== null && (
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  crmStatus
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LinCRM {crmStatus ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Customers
          </h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Search by email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchEmail}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Search Results ({searchResults.length})
            </h3>
            <div className="space-y-3">
              {searchResults.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/crm/customers/${customer.id}`}
                  className="block"
                >
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.firstName} {customer.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {customer.email}
                        </p>
                        {customer.company && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {customer.company}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                          {customer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchEmail && !isSearching && (
        <Card>
          <div className="p-6">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No customers found for "{searchEmail}"
            </div>
          </div>
        </Card>
      )}

      {/* Info Card */}
      {searchResults.length === 0 && !searchEmail && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              About CRM Integration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This integration connects LinSupport with LinCRM to provide a unified view of
              customer data. You can:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Search for customers by email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>View customer profiles with contact information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>See open deals and opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Track interaction history across both systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>View support metrics (tickets and active chats)</span>
              </li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}

