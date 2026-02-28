import { Loading } from '@/components/ui/Loading';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    </div>
  );
}

