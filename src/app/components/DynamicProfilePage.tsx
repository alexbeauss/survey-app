"use client";
import { useState, useEffect } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface DynamicProfilePageProps {
  user: UserProfile;
}

export default function DynamicProfilePage({ user }: DynamicProfilePageProps) {
  console.log(user); // Utilisation de 'user' pour éviter l'erreur
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profile, setProfile] = useState('');
  const [ofA, setOfA] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>(''); // Typeage pour l'âge
  const [saveStatus, setSaveStatus] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
 
  const profiles = ['Profil 1', 'Profil 2', 'Profil 3']; // Remplacez par vos options réelles
  const ofAOptions = ['OF-A 1', 'OF-A 2', 'OF-A 3']; // Remplacez par vos options réelles
  const genres = ['Homme', 'Femme', 'Autre']; // Remplacez par vos options réelles

  useEffect(() => {
    async function loadUserProfile() {
      console.log("Début de la récupération du profil utilisateur");
      try {
        const response = await fetch('/api/user-profile');
        if (response.ok) {
          const data = await response.json();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setProfile(data.profile || '');
          setOfA(data.ofA || ''); // Récupération de 'ofA'
          setGender(data.gender || ''); // Récupération de 'gender'
          setAge(data.age || ''); // Récupération de 'age'
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
    // Vérification des champs
    if (!firstName || !lastName || !profile || !ofA || !gender || age === '') {
      setModalOpen(true);
      return;
    }
    
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, profile, ofA, gender, age, isCompleted: true }),
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
          <label htmlFor="firstName" className="block mb-2 text-lg font-semibold flex items-center">
            Prénom
            {firstName && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="lastName" className="block mb-2 text-lg font-semibold flex items-center">
            Nom
            {lastName && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="profile" className="block mb-2 text-lg font-semibold flex items-center">
            Profil
            {profile && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <select
            id="profile"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Sélectionnez un profil</option>
            {profiles.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="ofA" className="block mb-2 text-lg font-semibold flex items-center">
            OF-A
            {ofA && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <select
            id="ofA"
            value={ofA}
            onChange={(e) => setOfA(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Sélectionnez OF-A</option>
            {ofAOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="gender" className="block mb-2 text-lg font-semibold flex items-center">
            Genre
            {gender && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Sélectionnez un genre</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="age" className="block mb-2 text-lg font-semibold flex items-center">
            Âge
            {age && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
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
