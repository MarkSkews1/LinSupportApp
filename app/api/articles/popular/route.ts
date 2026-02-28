import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ArticleService } from '@/services/articleService';

// GET /api/articles/popular - Get popular articles
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
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const articles = await ArticleService.getPopularArticles(tenantId, limit);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular articles' },
      { status: 500 }
    );
  }
}

