"use client";
import { useState } from 'react';

interface OccProfilePageProps {
  onClose?: () => void;
  onQuestionnaireOpen?: () => void;
  onProfileSave?: (userId: string) => void;
}

export default function OccProfilePage({ onClose, onQuestionnaireOpen, onProfileSave }: OccProfilePageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [campus, setCampus] = useState('');
  const [metier, setMetier] = useState('');
 
  const genres = ['Homme', 'Femme', 'Autre'];
  const role = 'Apprenant';
  const ofA = 'BTP CFA Occitanie';
  const campusList = ['Lézignan-Corbières', 'Méjanne-Lès-Alès'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !gender || age === '' || !campus || !metier) {
      setModalOpen(true);
      return;
    }
    
    try {
      const requestData = {
        firstName,
        lastName,
        role,
        ofA,
        gender,
        age,
        campus,
        metier,
        isCompleted: true,
        userId
      };
      
      console.log('Données envoyées:', requestData);

      const response = await fetch('/api/public-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      console.log('Réponse reçue:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde du profil');
      }

      setSaveStatus('Profil sauvegardé avec succès !');
      if (data.userId) {
        setUserId(data.userId);
        if (onProfileSave) {
          onProfileSave(data.userId);
        }
      }
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
      if (onQuestionnaireOpen) {
        onQuestionnaireOpen();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde du profil.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!isVisible) {
    return null;
  }

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

        <div className="flex flex-col mb-4">
          <label htmlFor="campus" className="block mb-2 text-lg font-semibold flex items-center">
            Campus
            {campus && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <select
            id="campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Sélectionnez un campus</option>
            {campusList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="metier" className="block mb-2 text-lg font-semibold flex items-center">
            Métier
            {metier && 
              <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>}
          </label>
          <input
            id="metier"
            type="text"
            value={metier}
            onChange={(e) => setMetier(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200">
            Démarrer le questionnaire
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