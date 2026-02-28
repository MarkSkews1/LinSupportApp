import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ticket from '@/models/Ticket';
import { getCurrentUser, getTenantId } from '@/lib/auth';
import { TicketStatus, TicketPriority, CreateTicketRequest, ApiResponse } from '@/types';

/**
 * GET /api/tickets - List tickets with filters
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assigneeId = searchParams.get('assigneeId');
    const customerId = searchParams.get('customerId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const query: any = { tenantId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assigneeId) query.assigneeId = assigneeId;
    if (customerId) query.customerId = customerId;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Ticket.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tickets - Create new ticket
 */
export async function POST(request: NextRequest) {
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

    const body: CreateTicketRequest = await request.json();

    // Validate required fields
    if (!body.subject || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Subject and description are required' },
        { status: 400 }
      );
    }

    // Create ticket
    const ticket = await Ticket.create({
      subject: body.subject,
      description: body.description,
      priority: body.priority || TicketPriority.MEDIUM,
      category: body.category,
      tags: body.tags || [],
      customerId: user.id,
      customerName: user.name || 'Unknown',
      customerEmail: body.customerEmail || user.email || '',
      tenantId,
      status: TicketStatus.OPEN,
    });

    return NextResponse.json(
      {
        success: true,
        data: ticket,
        message: 'Ticket created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

