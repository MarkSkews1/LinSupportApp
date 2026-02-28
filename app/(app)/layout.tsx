import { AppShell } from '@/components/layout/AppShell';
import { getCurrentUser, getUserRoles } from '@/lib/auth';
import { getNavigationForRoles } from '@/lib/navigation-config';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  // Get user roles for permission-based features
  const roles = await getUserRoles();

  // Get filtered navigation based on user roles
  const navigationItems = getNavigationForRoles(roles);

  return (
    <AppShell
      userName={user.name || undefined}
      userEmail={user.email || undefined}
      navigationItems={navigationItems}
    >
      {children}
    </AppShell>
  );
}


