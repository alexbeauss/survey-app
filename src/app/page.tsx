import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import DynamicProfilePage from '@/app/components/DynamicProfilePage'; // Importation du composant DynamicProfilePage

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  
  
  return (
    <div>
      <Navbar user={session.user} />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold">Bienvenue, {session.user.name} !</h1>
        <p className="mt-4">Complétez votre profil avant de continuer.</p>
      </main>

        <div className="container mx-auto w-2/3 rounded-lg bg-gray-50 shadow-md mt-4">
          <DynamicProfilePage user={session.user} />
        </div>
        
     
    </div>
  );
}
