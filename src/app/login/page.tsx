import { getSession, Session } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Image from 'next/image';

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
        <h1 className="pb-6 text-4xl font-bold text-gray-900 dark:text-white">Bienvenue !</h1>
        <h2 className="text-xl text-center text-gray-800 dark:text-gray-200 pb-10">
          <p>Vous allez participer à l&apos;étude d&apos;impact du projet d&apos;innovation pédagogique mené par le CCCA-BTP.</p>
          <p>En créant un compte, vous aurez accès à des questionnaires qui nous permettront d&apos;évaluer l&apos;impact du projet.</p>
          <p>Vos réponses seront <strong>anonymes</strong> et <strong>confidentielles</strong>.</p>
          <p><i>Vous aurez besoin de 15 minutes pour répondre à l&apos;ensemble des questionnaires.</i></p>
        </h2>
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
          <p className="mt-4 italic text-gray-600 dark:text-gray-400">S&apos;il s&apos;agit de votre première visite</p>
          <a href="/api/auth/signup" className="bg-yellow-500 text-white font-bold py-2 px-4 rounded mt-2 transition duration-200">
            Créer un compte
          </a>
          <p className="mt-4 italic text-gray-600 dark:text-gray-400">Si vous avez déjà un compte</p>
          <a href="/api/auth/login" className="bg-black text-white font-bold py-2 px-4 rounded mt-2 transition duration-200">
            Se connecter
          </a>
        </div>
        <Image 
          src="/img/logo3ca.jpg" 
          alt="Description de l'image" 
          width={200} 
          height={300} 
          className="mt-8 pt-18"
        />
      </div>
      <footer className="container text-xs mx-auto py-4 text-center text-gray-600 dark:text-gray-400">
        <p>Une question ? Un problème ? Écrivez à <a href="mailto:support@taline.app" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">support@taline.app</a></p>
      </footer>
    </div>
  );
}
