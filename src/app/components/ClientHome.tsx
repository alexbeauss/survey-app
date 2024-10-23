"use client"
import { useState } from 'react';
import Questionnaire from './Questionnaire';
import Image from 'next/image'; // Assurez-vous d'importer le composant Image

interface QuestionnaireType {
  id: number;
  icon: string;
  title: string;
  content: string;
  isAnswered: boolean;
  mood?: number; // Ajout de mood pour stocker la valeur de l'humeur
}

interface ClientHomeProps {
  questionnaires: QuestionnaireType[];
  userId: string; // Ajout de userId ici
}

const ClientHome: React.FC<ClientHomeProps> = ({ questionnaires, userId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireType | null>(null);
  const [updatedQuestionnaires, setUpdatedQuestionnaires] = useState<QuestionnaireType[]>(questionnaires); // État pour les questionnaires

  const openModal = (questionnaire: QuestionnaireType) => {
    setSelectedQuestionnaire(questionnaire);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuestionnaire(null);
  };

  const handleMoodChange = (id: number, mood: number) => {
    // Utiliser l'identifiant pour mettre à jour l'humeur dans l'état
    setUpdatedQuestionnaires((prev) =>
      prev.map((q) => (q.id === id ? { ...q, mood } : q)) // Mettre à jour l'humeur du questionnaire correspondant
    );
  };

  const handleSave = (mood: number) => {
    if (selectedQuestionnaire) {
      setUpdatedQuestionnaires((prev) =>
        prev.map((q) => (q.id === selectedQuestionnaire.id ? { ...q, isAnswered: true, mood } : q)) // Mettre à jour l'état des questionnaires
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"> {/* Ajustement des colonnes pour différents écrans */}
        {updatedQuestionnaires.map((q) => (
          <div key={q.id} className="relative w-full aspect-square"> {/* Utilisation de aspect-square pour garder les éléments carrés */}
            <div 
              className="p-2 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer relative" 
              onClick={() => openModal(q)} // Ajout de l'événement de clic ici
            >
              <div className="relative w-full h-72"> {/* Ajustement de la hauteur pour garder les images en entier */}
                <Image 
                  src={q.icon} 
                  alt={q.title} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  className="rounded-lg" 
                />
              </div>
              <h2 className="text-lg mt-1 font-semibold text-center">{q.title}</h2> {/* Réduction de la taille du texte */}
              {q.isAnswered && ( // Afficher l'indicateur si l'utilisateur a répondu
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Répondu</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"> {/* Styles pour le mode clair et sombre */}
            <span 
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer text-3xl z-10" // Augmenter la taille de la croix et s'assurer qu'elle est au-dessus
              onClick={closeModal}
              aria-label="Fermer la modale"
            >
              &times; {/* Icône de fermeture */}
            </span>
            {selectedQuestionnaire && ( // Vérification si selectedQuestionnaire n'est pas null
              <>
                <Questionnaire 
                  initialMood={selectedQuestionnaire.mood || 0} // Passer la valeur initiale de mood
                  onMoodChange={(mood: number) => handleMoodChange(selectedQuestionnaire.id, mood)} // Mettre à jour l'humeur
                  userId={userId} // Ajout de userId ici
                  questionnaireId={String(selectedQuestionnaire.id)} // Convertir l'identifiant en chaîne
                  isAnswered={selectedQuestionnaire.isAnswered} // Passer la propriété isAnswered
                  onClose={closeModal} // Passer la fonction de fermeture
                  onSave={handleSave} // Passer la fonction de sauvegarde
                /> {/* Intégration du composant Questionnaire */}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClientHome;
