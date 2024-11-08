"use client";
import { useEffect, useState, useCallback } from 'react';
import Questionnaire from './Questionnaire';
import Image from 'next/image'; // Assurez-vous d'importer le composant Image
import questionnairesData from '../data/questionnaires.json'; // Ensure this imports the object

// Définir les types pour les données de questionnaire
interface QuestionnaireType {
  id: number;
  icon: string;
  title: string;
  roles: string[];
  isAnswered: boolean;
  mood?: number; // Ajout de mood pour stocker la valeur de l'humeur
  questions: string[]; // Assurez-vous que questions est toujours un tableau de string
  labels: string[]; // Assurez-vous que labels est toujours un tableau de string
  description: string; // Ajout de description
  consigne: string; // Ajout de consigne
  startDate: string; // Ajout
  endDate: string;   // Ajout
}

// Définir les types pour les données de profil utilisateur
interface UserProfile {
  profile: string;
  centre: string;
  role: string;
  isCompleted: boolean;
  firstName: string;
  lastName: string;
}

const ClientHome: React.FC<{ userId: string }> = ({ userId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireType | null>(null);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireType[]>([]); // État pour les questionnaires
  const [loading, setLoading] = useState(true); // Loading state
  const [displayName, setDisplayName] = useState('Utilisateur'); // Ajout de l'état displayName

  // Fonction pour ouvrir la modale
  const openModal = (questionnaire: QuestionnaireType) => {
    setSelectedQuestionnaire(questionnaire);
    setModalOpen(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuestionnaire(null);
    fetchData(); // Recharge les données lorsque la modale est fermée
  };

  // Enveloppez fetchData dans useCallback pour éviter les changements de dépendance
  const fetchData = useCallback(async () => {
    try {
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-profile?userId=${userId}`);
      const profileData: UserProfile = await profileResponse.json();

      if (profileResponse.ok) {
        setDisplayName(profileData.firstName && profileData.lastName 
          ? `${profileData.firstName} ${profileData.lastName}`
          : 'Utilisateur');
        const userRole = profileData.role;
        const currentDate = new Date();

        const answersPromises = Object.entries(questionnairesData).map(async ([id, questionnaire]) => {
          if (id) {
            const answerResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/answers?userId=${userId}&questionnaireId=${id}`);
            const answerData = await answerResponse.json();
            return { ...questionnaire, id: Number(id), isAnswered: answerData.isAnswered || false };
          }
          return null;
        });

        const answers = await Promise.all(answersPromises);

        const filteredQuestionnaires = answers.filter((q): q is QuestionnaireType => {
          if (!q) return false;
          
          const startDate = new Date(q.startDate);
          const endDate = new Date(q.endDate);
          
          return q.roles.includes(userRole) && 
                 Array.isArray(q.questions) && 
                 Array.isArray(q.labels) &&
                 currentDate >= startDate && 
                 currentDate <= endDate;
        });

        setQuestionnaires(filteredQuestionnaires as QuestionnaireType[]);
      } else {
        console.error('Erreur lors de la récupération du profil utilisateur:', profileResponse.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Ajoutez userId comme dépendance

  // Appel initial pour charger les données
  useEffect(() => {
    fetchData();
  }, [userId, fetchData]);

  // Log pour vérifier le contenu des questionnaires
  console.log('Questionnaires:', questionnaires);

  if (loading) return <div>Loading...</div>;

  const handleMoodChange = (id: number, mood: number) => {
    // Logique pour gérer le changement d'humeur
    console.log(`Questionnaire ID: ${id}, New Mood: ${mood}`);
  };

  // Modifiez le type de handleSave pour éviter l'erreur sur le type vide
  const handleSave = (data: object) => { // Remplacez {} par object
    console.log('Données sauvegardées:', data);
  };

  // Assurez-vous que les titres s'affichent correctement
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bienvenue, {displayName} !</h1>
        <p className="mt-4">Voici les questionnaires qui vous sont proposés. Vous pouvez les compléter dans l'ordre que vous le souhaitez, cliquez sur le questionnaire pour le lancer et laissez-vous guider par les consignes.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {questionnaires.map((q) => (
          <div key={q.id} className="relative w-full aspect-square">
            <div 
              className="p-2 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer relative" 
              onClick={() => openModal(q)}
            >
              <div className="relative w-full h-96">
                <Image 
                  src={q.icon} 
                  alt={q.title} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  className="rounded-lg" 
                />
              </div>
              <h2 className="text-lg mt-1 font-semibold text-center">{q.title}</h2>
              <p className="text-center text-sm text-gray-600">{q.questions.length} questions</p>
              {q.isAnswered && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Répondu</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedQuestionnaire && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <span className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer text-3xl z-10" onClick={closeModal} aria-label="Fermer la modale">&times;</span>
            <p className="mb-4 text-lg dark:text-white text-gray-600">{selectedQuestionnaire.description}</p>
            <p className="mb-4 dark:text-white text-black font-bold italic">{selectedQuestionnaire.consigne}</p>
            <Questionnaire 
              initialMood={selectedQuestionnaire.mood || 0}
              onMoodChange={(mood: number) => handleMoodChange(selectedQuestionnaire.id, mood)}
              userId={userId}
              questionnaireId={String(selectedQuestionnaire.id)}
              isAnswered={selectedQuestionnaire.isAnswered}
              onClose={closeModal}
              onSave={handleSave}
              questions={selectedQuestionnaire.questions}
              labels={selectedQuestionnaire.labels}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ClientHome;
