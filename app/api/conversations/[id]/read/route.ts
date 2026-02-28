import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ChatService } from '@/services/chatService';

// POST /api/conversations/[id]/read - Mark messages as read
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

    const conversation = await ChatService.markAsRead(
      params.id,
      user.id,
      tenantId
    );

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}

