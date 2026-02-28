import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { CRMSyncService } from '@/services/crmSyncService';

// GET /api/crm/status - Check CRM connection status
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isConnected = await CRMSyncService.checkCRMStatus();

    return NextResponse.json({
      connected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking CRM status:', error);
    return NextResponse.json(
      { connected: false, error: 'Failed to check CRM status' },
      { status: 500 }
    );
  }
}

