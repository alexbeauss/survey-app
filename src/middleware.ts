import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/api/user-profile', '/api/answers'], // Assurez-vous que toutes les routes nécessaires sont ici
};