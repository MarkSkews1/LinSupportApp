import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { CRMSyncService } from '@/services/crmSyncService';

// GET /api/crm/customers/[id]/deals - Get customer deals
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deals = await CRMSyncService.getCustomerDeals(params.id);

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Error fetching customer deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer deals' },
      { status: 500 }
    );
  }
}

