import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { AnalyticsService } from '@/services/analyticsService';

// GET /api/analytics/kb - Get knowledge base analytics
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = getTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const analytics = await AnalyticsService.getKBAnalytics(tenantId);

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching KB analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KB analytics' },
      { status: 500 }
    );
  }
}

