import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import ClientHome from '@/app/components/ClientHome'; // Importation du nouveau composant

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const userId = session.user.sub; 
  
  const questionnaires = [
    { id: 1, title: 'Apprenance', icon: '/img/apprenance.jpeg', content: 'Contenu du questionnaire 1' },
    { id: 2, title: 'Test 2', icon: '/img/quest2.jpeg', content: 'Contenu du questionnaire 2' },
    { id: 3, title: 'Questionnaire 3', icon: '/img/quest3.jpeg', content: 'Contenu du questionnaire 3' },
  ];

  // Récupération des réponses pour chaque questionnaire
  const answersPromises = questionnaires.map(async (questionnaire) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/answers?userId=${userId}&questionnaireId=${questionnaire.id}`);
    const answer = await response.json();
    return { ...questionnaire, isAnswered: answer.isAnswered || false }; // Ajout de isAnswered
  });

  const questionnairesWithAnswers = await Promise.all(answersPromises); // Attendre que toutes les promesses soient résolues

  
  return (
    <div>
      <Navbar user={session.user} />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold">Bienvenue, {session.user.name} !</h1>
        <p className="mt-4">Voici votre page d&apos;accueil des questionnaires.</p>
        
         <ClientHome questionnaires={questionnairesWithAnswers} userId={userId} />
        
      </main>
    </div>
  );
}
