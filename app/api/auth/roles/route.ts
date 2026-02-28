import { NextResponse } from 'next/server';
import { getUserRoles } from '@/lib/auth';

/**
 * GET /api/auth/roles
 * Returns the current user's roles
 */
export async function GET() {
  try {
    const roles = await getUserRoles();

    return NextResponse.json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user roles',
        roles: [],
      },
      { status: 500 }
    );
  }
}

