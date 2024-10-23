"use client";
import { useState, useEffect } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface DynamicProfilePageProps {
  user: UserProfile;
}

export default function DynamicProfilePage({ user }: DynamicProfilePageProps) {
  console.log(user); // Utilisation de 'user' pour éviter l'erreur
  const [profile, setProfile] = useState('');
  const [centre, setCentre] = useState('');
  const [role, setRole] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const centres = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'];
  const roles = ['formateur', 'apprenant'];

  useEffect(() => {
    async function loadUserProfile() {
      console.log("Début de la récupération du profil utilisateur");
      try {
        const response = await fetch('/api/user-profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile || '');
          setCentre(data.centre || '');
          setRole(data.role || '');
          console.log("Profil utilisateur chargé avec succès", data);
        } else if (response.status === 404) {
          console.log('Aucun profil trouvé pour cet utilisateur.');
        } else {
          throw new Error('Erreur lors de la récupération du profil');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setSaveStatus('Erreur lors du chargement du profil.');
      }
    }
    loadUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!centre || !role) {
      setModalOpen(true);
      return;
    }
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, centre, role, isCompleted: true }),
      });
      if (response.ok) {
        setSaveStatus('Profil sauvegardé avec succès !');
        window.location.href = '/home';
      } else {
        throw new Error('Erreur lors de la sauvegarde du profil');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSaveStatus('Erreur lors de la sauvegarde du profil.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 dark:bg-gray-900 dark:text-white">
      
      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        

        <div className="flex flex-col mb-4">
          <label htmlFor="centre" className="block mb-2 text-lg font-semibold">
            Centre
            {centre && <span className="ml-2 bg-green-500 text-white rounded-full p-1 flex items-center justify-center w-6 h-6">✔️</span>}
          </label>
          <select
            id="centre"
            value={centre}
            onChange={(e) => setCentre(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Sélectionnez un centre</option>
            {centres.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="role" className="block mb-2 text-lg font-semibold">
            Rôle
            {role && <span className="ml-2 bg-green-500 text-white rounded-full p-1 flex items-center justify-center w-6 h-6">✔️</span>}
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Sélectionnez un rôle</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200">
          Sauvegarder le profil
        </button>
      </form>
      {saveStatus && <p className="mt-4 text-center font-bold dark:text-white">{saveStatus}</p>}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold">Profil incomplet</h2>
            <p>Veuillez compléter votre profil avant de passer à l&apos;étape suivante.</p>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700">
              D&apos;accord
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
