"use client";
import { useState, useEffect } from 'react';

export default function DynamicProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [ofA, setOfA] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
 
  const profiles = ['Apprenant', 'Formateur', 'Pilote projet'];
  const ofAOptions = ['BTP CFA AURA', 'Bâtiment CFA BOURGOGNE F.-COMTE', 'BTP CFA GRAND EST', 'BTP CFA NORMANDIE', 'BTP CFA NOUVELLE AQUITAINE', 'BTP CFA OCCITANIE', 'BTP CFA PACA', 'BTP CFA PICARDIE', 'BTP CFA POITOU CHARENTES', 'MFR ST ANDRE DU GAZ - Le VILLAGE (AURA)', 'MFR CLOS DU BAZ (AURA)', 'MFR ST GILLE CROIX DE VIE (Pays de la Loire)', 'CFA IFFEN (Ile-de-France)', 'CFA DUCRETET', 'GIP FTLV CAFOC de DIJON', 'CMAR PACA', 'CRMA OCCITANIE', 'AOCDTF'];
  const genres = ['Homme', 'Femme', 'Autre'];

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const response = await fetch('/api/user-profile');
        if (response.ok) {
          const data = await response.json();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          if (data.role) {
            setRole(data.role);
          }
          setOfA(data.ofA || '');
          setGender(data.gender || '');
          setAge(data.age || '');
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
    if (!firstName || !lastName || !role || !ofA || !gender || age === '') {
      setModalOpen(true);
      return;
    }
    
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, role, ofA, gender, age, isCompleted: true }),
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
            Rôle
            {role && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          {role ? (
            <input
              type="text"
              value={role}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none cursor-not-allowed bg-gray-100"
              disabled
            />
          ) : (
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Sélectionnez un profil</option>
              {profiles.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="ofA" className="block mb-2 text-lg font-semibold flex items-center">
            Organisme de formation
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

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200">
            Sauvegarder le profil
          </button>
        </div>
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
