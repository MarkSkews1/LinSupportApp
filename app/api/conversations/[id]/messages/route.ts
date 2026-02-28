import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ChatService } from '@/services/chatService';

// POST /api/conversations/[id]/messages - Send a message
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

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    // Determine sender role from user data
    const senderRole = user.roles?.[0] || 'customer';

    const result = await ChatService.sendMessage({
      conversationId: params.id,
      senderId: user.id,
      senderName: user.given_name && user.family_name
        ? `${user.given_name} ${user.family_name}`
        : user.email || 'Unknown',
      senderRole: senderRole as 'customer' | 'agent' | 'manager' | 'admin',
      content: content.trim(),
      tenantId,
    });

    return NextResponse.json({
      message: result.message,
      conversation: result.conversation
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

