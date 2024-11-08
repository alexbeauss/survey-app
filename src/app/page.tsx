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
      <main className="container mx-auto mt-8 text-center">
        <h1 className="text-xl font-bold">Merci de compléter ou vérifier votre profil avant de continuer.</h1>
      </main>

        <div className="container mx-auto w-1/2 rounded-lg bg-gray-50 shadow-md mt-4">
          <DynamicProfilePage user={session.user} />
        </div>
        
     
    </div>
  );
}
