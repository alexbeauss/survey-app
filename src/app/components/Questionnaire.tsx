"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assurez-vous d'importer axios

// Définir un type pour questionnaires
type QuestionnairesType = {
  [key: string]: { questions: string[]; labels: string[] };
};

import questionnairesData from '../data/questionnaires.json'; // Importer le fichier JSON avec le type défini

const questionnaires: QuestionnairesType = questionnairesData; // Utiliser l'importation

interface QuestionnaireProps {
  initialMood: number;
  onMoodChange: (mood: number) => void;
  userId: string;
  questionnaireId: string;
  isAnswered: boolean;
  onClose: () => void;
  onSave: (data: number[]) => void; // Spécifiez le type de données
  questions: string[]; // Remplacez any par string[]
  labels: string[]; // Remplacez any par string[]
}

export default function Questionnaire({ 
  onMoodChange, 
  userId, 
  questionnaireId, 
  isAnswered, 
  onClose, 
  onSave 
}: QuestionnaireProps) {
  const { questions, labels } = questionnaires[questionnaireId] || { questions: [], labels: [] }; // Récupérer les questions et les étiquettes

  // Initialiser le tableau moods avec une longueur égale au nombre de questions, en commençant par null
  const [moods, setMoods] = useState<number[]>(Array(questions.length).fill(null)); // Initialiser avec null
  const [hasMoved, setHasMoved] = useState<boolean[]>(Array(questions.length).fill(false)); // Suivre si chaque curseur a été déplacé
  const sliderRef = useRef<HTMLDivElement[]>(Array(questions.length).fill(null)); // Référencer chaque slider
  const [currentlyDraggingIndex, setCurrentlyDraggingIndex] = useState<number | null>(null); // État pour suivre l'index du curseur en cours de déplacement

  // Initialiser les humeurs à la position médiane (5) lors du premier rendu
  useEffect(() => {
    const initialMoods = Array(questions.length).fill(5); // Position médiane
    setMoods(initialMoods);
  }, [questions.length]); // Dépendance sur la longueur des questions

  const handleMoodChange = useCallback((index: number, clientX: number) => {
    const newMoods = [...moods];
    if (!sliderRef.current[index]) return;
    const rect = sliderRef.current[index].getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    newMoods[index] = parseFloat((percentage * 10).toFixed(2)); // Mettre à jour la valeur de mood
    setMoods(newMoods);
    setHasMoved(prev => {
      const updated = [...prev];
      updated[index] = true; // Marquer que le curseur a été déplacé
      return updated;
    });
    onMoodChange(newMoods[index]); // Passer le tableau des humeurs
  }, [moods, onMoodChange]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (currentlyDraggingIndex === null) return; // Vérifier si un curseur est en cours de déplacement
    handleMoodChange(currentlyDraggingIndex, e.type.includes('mouse') ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX);
  }, [handleMoodChange, currentlyDraggingIndex]);

  const handleStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, index: number) => {
    setCurrentlyDraggingIndex(index); // Enregistrer l'index du curseur en cours de déplacement
    handleMoodChange(index, e.type.includes('mouse') ? (e as React.MouseEvent<HTMLDivElement>).clientX : (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX);
  }, [handleMoodChange]);

  const handleEnd = useCallback(() => {
    setCurrentlyDraggingIndex(null); // Réinitialiser l'index lorsque le déplacement est terminé
  }, []);

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      handleMove(e);
    };

    const handleGlobalEnd = () => {
      handleEnd();
    };

    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchmove', handleGlobalMove);
    document.addEventListener('touchend', handleGlobalEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [handleMove, handleEnd]);

  const getMoodText = useCallback((mood: number) => {
    const index = Math.floor(((mood) / 10) * (labels.length - 1)); // Calculer l'index en fonction du nombre de labels
    return labels[Math.min(index, labels.length - 1)]; // S'assurer que l'index ne dépasse pas la longueur des labels
  }, [labels]); // Ajouter labels comme dépendance

  const handleSave = async () => {
    // Vérifier si tous les curseurs ont été déplacés
    if (hasMoved.some(moved => !moved)) {
      alert("Veuillez répondre à toutes les questions avant de sauvegarder."); // Alerte si des réponses sont manquantes
      return;
    }

    try {
      await axios.post('/api/answers', { moods, userId, questionnaireId, isAnswered }); // Enregistrer le tableau des humeurs
      onSave(moods); // Passer le tableau moods au lieu d'un seul nombre
      onClose(); // Fermer la modale après la sauvegarde
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg">
      {isAnswered ? (
        <p className="text-center text-xl font-semibold">
          Vous avez répondu à toutes les questions de ce questionnaire.
        </p>
      ) : (
        questions.map((question, index) => (
          <div key={index} className="mb-4 w-full max-w-3xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
            <p className="text-center text-xl font-semibold mb-4">{question}</p>
            
            <p className="text-center text-l font-semibold mt-4 italic">{getMoodText(moods[index] ?? 0)}</p>
            
            <div className="relative pt-6 pb-6">
              <div 
                ref={(el) => { sliderRef.current[index] = el as HTMLDivElement; }}
                className="w-full bg-gray-400 rounded-full cursor-pointer"
                style={{ height: '10px' }}
                onMouseDown={(e) => handleStart(e, index)}
                onTouchStart={(e) => handleStart(e, index)}
              ></div>
              <div
                className="absolute top-1/2 w-8 h-8 bg-blue-500 border-2 border-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-pointer shadow-md"
                style={{ left: `${(moods[index] ?? 0) * 10}%`, top: '50%' }}
                onMouseDown={(e) => handleStart(e, index)}
                onTouchStart={(e) => handleStart(e, index)}
              ></div>
              <div className="flex justify-between text-xs text-gray-400 absolute w-full" style={{top: '80%'}}>
                <span className="absolute left-0 transform -translate-x-5">{labels[0]}</span> 
                <span className="absolute right-0 transform translate-x-5">{labels[labels.length - 1]}</span> 
              </div>
            </div>
          </div>
        ))
      )}
      {!isAnswered && (
        <div className="flex justify-center">
          <button 
            onClick={handleSave} 
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
          >
            Sauvegarder les réponses
          </button>
        </div>
      )}
    </div>
  );
}
