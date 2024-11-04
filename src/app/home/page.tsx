// /src/app/home/page.tsx

import { getSession as originalGetSession } from '@auth0/nextjs-auth0'; // Import the original getSession
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import ClientHome from '@/app/components/ClientHome';

// Custom function to get session
async function getSession() {
  return originalGetSession(); // Retirer la gestion des cookies
}

export default async function Home() {
  const session = await getSession(); // Await the custom getSession to retrieve the session

  // Check session and redirect if absent
  if (!session || !session.user) {
    redirect('/api/auth/login'); // Redirect to login if not authenticated
    return;
  }

  const userName = session.user.name || 'Utilisateur'; // Use the user's name from the session
  const userId = session.user.sub; // Retrieve user ID

  return (
    <div>
      <Navbar user={session.user} /> {/* Display the user's name */}
      <main className="container mx-auto mt-8">
        <ClientHome userId={userId} />
      </main>
    </div>
  );
}
