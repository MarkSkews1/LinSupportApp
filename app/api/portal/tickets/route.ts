import { NextRequest, NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import connectDB from '@/lib/db/mongodb';

// POST /api/portal/tickets - Submit a ticket (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      categoryId,
      customerEmail,
      customerName,
    } = body;

    // Validation
    if (!title || !description || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      status: 'open',
      categoryId,
      customerEmail,
      customerName,
      createdBy: customerEmail, // Use email as creator ID for portal submissions
      createdByName: customerName,
      tenantId: 'public', // Default tenant for public portal
      source: 'portal',
    });

    return NextResponse.json(
      {
        success: true,
        ticket: {
          id: ticket._id.toString(),
          title: ticket.title,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating portal ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

// GET /api/portal/tickets - Get tickets by email (public endpoint)
export async function GET(request: NextRequest) {
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

    const tickets = await Ticket.find({
      customerEmail: email,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching portal tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

