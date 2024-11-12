"use client";
import React, { useState, useEffect } from 'react'; // Ajout de l'importation de React
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import DynamicProfilePage from './DynamicProfilePage';

interface NavbarProps {
  user: UserProfile | null; // Assurez-vous que user peut être null
}

export default function Navbar({ user }: NavbarProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier le montage

  useEffect(() => {
    setIsMounted(true); // Mettez à jour l'état une fois que le composant est monté
  }, []);

  // Vérifiez si le composant est monté avant de rendre le contenu
  if (!isMounted) {
    return null; // Ne pas rendre le contenu tant que le composant n'est pas monté
  }

  return (
    <nav className="bg-gradient-to-r from-yellow-400 to-black dark:from-yellow-500 dark:to-black p-4">
      <div className="w-full mx-auto flex justify-between items-center">
        <Link href="/" className="font-mono text-white text-2xl font-bold">
          survey
        </Link>
        <div className="flex items-center">
          {user ? (
            <>
              <div className="flex items-center ml-6 mr-6 relative">
                <button onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} className="flex items-center">
                  <Image
                    src={user.picture || '/default-avatar.png'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                </button>
              </div>
              <LogoutButton />
            </>
          ) : (
            <Link href="/api/auth/login" className="text-white hover:text-yellow-200 transition-colors">
              Se connecter
            </Link>
          )}
        </div>
      </div>

      {isProfileModalOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer text-3xl"
              aria-label="Fermer la modale"
            >
              &times;
            </button>
            <DynamicProfilePage user={user} />
          </div>
        </div>
      )}
    </nav>
  );
}
