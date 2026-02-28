import { NextRequest, NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import TicketComment from '@/models/TicketComment';
import connectDB from '@/lib/db/mongodb';

// GET /api/portal/tickets/[id] - Get ticket details (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find ticket and verify it belongs to the email
    const ticket = await Ticket.findOne({
      _id: params.id,
      customerEmail: email,
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Get comments
    const comments = await TicketComment.find({
      ticketId: params.id,
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      ticket,
      comments,
    });
  } catch (error) {
    console.error('Error fetching portal ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

