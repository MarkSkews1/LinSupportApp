/**
 * LinSupport Middleware
 * Standard LinTech middleware — delegates auth + app-access to @lintech/user-service
 */

import { createLinTechMiddleware } from '@lintech/user-service/server';

export const middleware = createLinTechMiddleware({
  appId: 'linsupport',
  publicPaths: ['/api/sso/lin-suite/callback', '/api/webhooks'],
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
