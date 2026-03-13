import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth({
  loginPage: '/api/auth/login',
  isReturnToCurrentPage: true,
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};

