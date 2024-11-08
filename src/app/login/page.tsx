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
        <h1 className="text-3xl font-bold">Bienvenue !</h1>
        <h2 className="text-xl">Vous êtes sur cette page afin de participer à l'étude d'impact du projet d'innovation pédagogique du CCCA-BTP.</h2>
        <div className="bg-gray-100 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
          <p className="mt-4 italic">S'il s'agit de votre première visite</p>
          <a href="/api/auth/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
            Créer un compte
          </a>
          <p className="mt-4 italic">Si vous avez déjà un compte</p>
          <a href="/api/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}
