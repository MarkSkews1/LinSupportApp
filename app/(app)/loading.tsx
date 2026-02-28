import { Loading } from '@/components/ui/Loading';

export default function AppLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

