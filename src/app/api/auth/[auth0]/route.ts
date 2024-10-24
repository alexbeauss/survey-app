import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';


export const GET = async (request: Request) => {
  // Vérifiez si context est défini avant de déstructurer params
  // const params = context?.params || {}; // Supprimé car non utilisé

  // Call handleAuth to manage authentication
  return handleAuth({
    signup: handleLogin({
      authorizationParams: {
        screen_hint: 'signup',
      },
    }),
  })(request); // Pass the request to the handler
};
