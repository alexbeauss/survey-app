// /middleware.ts

import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/home', '/profile', '/api/(.*)'], // Protéger les routes API et certaines pages spécifiques
};