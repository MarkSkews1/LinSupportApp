import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { ChatService } from '@/services/chatService';

// GET /api/conversations - Get all conversations
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
    const status = searchParams.get('status') || undefined;
    const agentId = searchParams.get('agentId') || undefined;
    const customerId = searchParams.get('customerId') || undefined;

    const conversations = await ChatService.getConversations(tenantId, {
      status,
      agentId,
      customerId,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
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
    const { customerId, customerName, customerEmail, subject, ticketId } = body;

    if (!customerId || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Customer details required' },
        { status: 400 }
      );
    }

    const conversation = await ChatService.createConversation({
      tenantId,
      customerId,
      customerName,
      customerEmail,
      subject,
      ticketId,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

