import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ticket from '@/models/Ticket';
import Agent from '@/models/Agent';
import { getCurrentUser, getTenantId, isAgent } from '@/lib/auth';

/**
 * POST /api/tickets/[id]/assign - Assign ticket to agent
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const tenantId = await getTenantId();
    const hasAgentRole = await isAgent();

    if (!user || !tenantId || !hasAgentRole) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { assigneeId } = await request.json();

    if (!assigneeId) {
      return NextResponse.json(
        { success: false, error: 'Assignee ID is required' },
        { status: 400 }
      );
    }

    // Verify agent exists
    const agent = await Agent.findOne({
      userId: assigneeId,
      tenantId,
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    const { id } = await params;
    // Update ticket
    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: id,
        tenantId,
      },
      {
        $set: {
          assigneeId: agent.userId,
          assigneeName: agent.name,
        },
      },
      {
        new: true,
      }
    );

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update agent ticket count
    await Agent.findOneAndUpdate(
      { userId: agent.userId, tenantId },
      { $inc: { currentTicketCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket assigned successfully',
    });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign ticket' },
      { status: 500 }
    );
  }
}


