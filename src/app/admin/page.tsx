import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import AnalyticsCharts from '@/app/components/AnalyticsCharts';

export default async function AdminPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div>
      <Navbar user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne pour le rôle "apprenant" */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Données pour Apprenant</h2>
            <AnalyticsCharts roleFilter="apprenant" />
          </div>

          {/* Colonne pour les rôles "formateur" et "pilote projet" */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Données pour Formateur et Pilote Projet</h2>
            <AnalyticsCharts roleFilter={["formateur", "pilote projet"]} />
          </div>
        </div>
      </main>
    </div>
  );
} 