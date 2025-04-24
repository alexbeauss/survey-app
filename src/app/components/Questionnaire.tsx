"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

interface QuestionnaireProps {
  initialMood: number;
  onMoodChange: (mood: number) => void;
  userId: string;
  questionnaireId: string;
  isAnswered: boolean;
  onClose: () => void;
  onSave: (data: number[]) => void;
  questions: string[];
  labels: string[];
}

export default function Questionnaire({ 
  onMoodChange, 
  userId, 
  questionnaireId, 
  isAnswered, 
  onClose, 
  onSave,
  questions,
  labels
}: QuestionnaireProps) {
  const [moods, setMoods] = useState<number[]>(Array(questions.length).fill(null));
  const [hasMoved, setHasMoved] = useState<boolean[]>(Array(questions.length).fill(false));
  const sliderRef = useRef<HTMLDivElement[]>(Array(questions.length).fill(null));
  const [currentlyDraggingIndex, setCurrentlyDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log('Questionnaire ID:', questionnaireId);
    console.log('Questions reçues:', questions);
    console.log('Labels reçus:', labels);
    const initialMoods = Array(questions.length).fill(5);
    setMoods(initialMoods);
  }, [questions.length, questionnaireId, questions, labels]);

  const handleMoodChange = useCallback((index: number, clientX: number) => {
    const newMoods = [...moods];
    if (!sliderRef.current[index]) return;
    const rect = sliderRef.current[index].getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    newMoods[index] = parseFloat((percentage * 10).toFixed(2));
    setMoods(newMoods);
    setHasMoved(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    onMoodChange(newMoods[index]);
  }, [moods, onMoodChange]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (currentlyDraggingIndex === null) return;
    handleMoodChange(currentlyDraggingIndex, e.type.includes('mouse') ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX);
  }, [handleMoodChange, currentlyDraggingIndex]);

  const handleStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, index: number) => {
    setCurrentlyDraggingIndex(index);
    handleMoodChange(index, e.type.includes('mouse') ? (e as React.MouseEvent<HTMLDivElement>).clientX : (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX);
  }, [handleMoodChange]);

  const handleEnd = useCallback(() => {
    setCurrentlyDraggingIndex(null);
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
    const index = Math.floor(((mood) / 10) * (labels.length - 1));
    return labels[Math.min(index, labels.length - 1)];
  }, [labels]);

  const handleSave = async () => {
    if (hasMoved.some(moved => !moved)) {
      alert("Veuillez répondre à toutes les questions avant de sauvegarder.");
      return;
    }

    try {
      await axios.post('/api/public-answers', { moods, userId, questionnaireId, isAnswered });
      onSave(moods);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
      alert('Erreur lors de la sauvegarde des réponses. Veuillez réessayer.');
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
