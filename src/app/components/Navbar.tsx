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

  // Si l'utilisateur n'est pas disponible, ne pas rendre la navbar
  if (!user) {
    return null; // Ou un message d'erreur ou un chargement
  }

  // Assurez-vous que user.picture a une valeur par défaut
  const profilePicture = user.picture || '/default-avatar.png';
  
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-900 dark:from-blue-600 dark:to-blue-800 p-4">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-mono text-white text-2xl font-bold">
          Survey
        </Link>
        <div className="flex items-center">
          <div className="flex items-center ml-6 mr-6 relative">
            <button onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} className="flex items-center">
              <Image
                src={profilePicture}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
            </button>
          </div>
          <LogoutButton />
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer text-3xl"
              aria-label="Fermer la modale"
            >
              &times; {/* Icône de fermeture */}
            </button>
            <DynamicProfilePage user={user} />
          </div>
        </div>
      )}
    </nav>
  );
}
