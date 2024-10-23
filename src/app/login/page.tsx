import { getSession, Session } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default async function LoginPage() {
  const session: Session | null | undefined = await getSession(); // Inclure 'undefined' dans le type
  // Ajout d'une vérification pour s'assurer que 'session' a un type correct
  const user = session?.user || null; // Assurez-vous que 'user' est de type correct
  
  if (session) {
    redirect('/');
  }

  return (
    <div>
      <Navbar user={user} /> 
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <a href="/api/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Se connecter
        </a>
        <a href="/api/auth/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Créer un compte
        </a>
      </div>
    </div>
  );
}
