import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/sso/lin-suite-sso';

/**
 * SSO Callback Endpoint
 * Receives SSO tokens from lin-suite-app and creates authenticated sessions
 *
 * URL: /api/sso/lin-suite/callback?token={token}&returnTo={path}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const returnTo = searchParams.get('returnTo') || '/dashboard';

    if (!token) {
      return NextResponse.json(
        { error: 'Missing SSO token' },
        { status: 400 }
      );
    }

    // Validate token with Kinde
    const user = await validateToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired SSO token' },
        { status: 401 }
      );
    }

    // TODO: Sync user with local database (Phase 3)
    // await syncUser(user);

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL(returnTo, request.url)
    );

    // Set SSO cookies
    response.cookies.set('kinde_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    response.cookies.set('sso_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    response.cookies.set('sso_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('SSO callback error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}


