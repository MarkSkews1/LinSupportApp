import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ArticleService } from '@/services/articleService';

// POST /api/articles/[id]/helpful - Mark article as helpful
export async function POST(
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

    const article = await ArticleService.markHelpful(params.id, tenantId);

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error marking article helpful:', error);
    return NextResponse.json(
      { error: 'Failed to mark article as helpful' },
      { status: 500 }
    );
  }
}

