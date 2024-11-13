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

  const userId = session.user.sub; // Retrieve user ID

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={session.user} />
      <main className="container mx-auto mt-8 flex-grow">
        <ClientHome userId={userId} />
      </main>
      <footer className="container text-xs mx-auto py-4 text-center text-gray-600 dark:text-gray-400">
        <p>Une question ? Un problème ? Écrivez à <a href="mailto:support@taline.app" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">support@taline.app</a></p>
      </footer>
    </div>
  );
}
