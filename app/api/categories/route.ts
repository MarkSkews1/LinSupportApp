import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Category from '@/models/Category';
import { getCurrentUser, getTenantId } from '@/lib/auth';

/**
 * GET /api/categories - List all categories
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

    const categories = await Category.find({ tenantId })
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories - Create new category
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

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      ...body,
      tenantId,
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

