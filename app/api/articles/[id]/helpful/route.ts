import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ArticleService } from '@/services/articleService';

// POST /api/articles/[id]/helpful - Mark article as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = await getTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const article = await ArticleService.markHelpful(id, tenantId);

    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    process.stdout.write(`[helpful route] ERROR: ${message}\n${stack ?? ''}\n`);
    return NextResponse.json(
      { error: 'Failed to mark article as helpful', detail: message },
      { status: 500 }
    );
  }
}

