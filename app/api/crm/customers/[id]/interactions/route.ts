import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { CRMSyncService } from '@/services/crmSyncService';

// GET /api/crm/customers/[id]/interactions - Get customer interactions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = getTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const interactions = await CRMSyncService.getCustomerInteractions(
      params.id,
      tenantId
    );

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error('Error fetching customer interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer interactions' },
      { status: 500 }
    );
  }
}

