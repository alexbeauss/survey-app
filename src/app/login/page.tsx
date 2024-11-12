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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenue !</h1>
        <h2 className="text-xl text-gray-800 dark:text-gray-200">
          Vous êtes sur cette page afin de participer à l&apos;étude d&apos;impact du projet d&apos;innovation pédagogique du CCCA-BTP.
        </h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
          <p className="mt-4 italic text-gray-600 dark:text-gray-400">S&apos;il s&apos;agit de votre première visite</p>
          <a href="/api/auth/signup" className="bg-black dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded mt-2 transition duration-200">
            Créer un compte
          </a>
          <p className="mt-4 italic text-gray-600 dark:text-gray-400">Si vous avez déjà un compte</p>
          <a href="/api/auth/login" className="bg-yellow-500 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-2 transition duration-200">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}
