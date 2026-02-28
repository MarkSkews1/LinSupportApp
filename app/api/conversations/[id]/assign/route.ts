import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ChatService } from '@/services/chatService';
import { hasRole } from '@/lib/roles';

// POST /api/conversations/[id]/assign - Assign conversation to agent
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only agents, managers, and admins can assign conversations
    if (!hasRole(['agent', 'manager', 'admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = getTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const body = await request.json();
    const { agentId, agentName } = body;

    if (!agentId || !agentName) {
      return NextResponse.json(
        { error: 'Agent ID and name required' },
        { status: 400 }
      );
    }

    const conversation = await ChatService.assignConversation({
      conversationId: params.id,
      agentId,
      agentName,
      tenantId,
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error assigning conversation:', error);
    return NextResponse.json(
      { error: 'Failed to assign conversation' },
      { status: 500 }
    );
  }
}

