import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { AnalyticsService } from '@/services/analyticsService';

// GET /api/analytics/chat - Get chat analytics
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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const analytics = await AnalyticsService.getChatAnalytics(
      tenantId,
      startDate,
      endDate
    );

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching chat analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat analytics' },
      { status: 500 }
    );
  }
}

