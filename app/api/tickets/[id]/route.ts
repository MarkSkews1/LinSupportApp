import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ticket from '@/models/Ticket';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { UpdateTicketRequest } from '@/types';

/**
 * GET /api/tickets/[id] - Get single ticket
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const tenantId = await getTenantId();

    if (!user || !tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const ticket = await Ticket.findOne({
      _id: params.id,
      tenantId,
    }).lean();

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tickets/[id] - Update ticket
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const tenantId = await getTenantId();

    if (!user || !tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: UpdateTicketRequest = await request.json();

    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: params.id,
        tenantId,
      },
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket updated successfully',
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tickets/[id] - Delete ticket (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const tenantId = await getTenantId();

    if (!user || !tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const ticket = await Ticket.findOneAndDelete({
      _id: id,
      tenantId,
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}


