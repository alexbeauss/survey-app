"use client";
import { useState, useEffect } from 'react';
import PublicNavbar from '@/app/components/PublicNavbar';
import Questionnaire from '@/app/components/Questionnaire';
import questionnairesData from '../data/questionnaires.json';
import OccProfilePage from '../components/OccProfilePage';

type QuestionnaireId = keyof typeof questionnairesData;

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const [currentQuestionnaireId, setCurrentQuestionnaireId] = useState<QuestionnaireId>('6');
  const questionnaireData = questionnairesData[currentQuestionnaireId];

  useEffect(() => {
    console.log('Questionnaire actuel:', currentQuestionnaireId);
    console.log('Données du questionnaire:', questionnaireData);
    console.log('État isQuestionnaireCompleted:', isQuestionnaireCompleted);
  }, [currentQuestionnaireId, questionnaireData, isQuestionnaireCompleted]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionnaireId]);

  const handleProfileSave = (newUserId: string) => {
    setUserId(newUserId);
  };

  const handleQuestionnaireSave = () => {
    console.log('Sauvegarde du questionnaire', currentQuestionnaireId);
    if (currentQuestionnaireId === '6') {
      console.log('Passage au questionnaire 9');
      setCurrentQuestionnaireId('9');
      setIsQuestionnaireCompleted(false);
    } else if (currentQuestionnaireId === '9') {
      console.log('Passage au questionnaire 10');
      setCurrentQuestionnaireId('10');
      setIsQuestionnaireCompleted(false);
    } else {
      console.log('Questionnaire terminé');
      setIsQuestionnaireCompleted(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="container mx-auto mt-8 flex-grow flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg">
          <OccProfilePage 
            onClose={() => {}}
            onQuestionnaireOpen={() => {}}
            onProfileSave={handleProfileSave}
          />
        </div>

        {userId && !isQuestionnaireCompleted && questionnaireData && (
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg">
            <p className="mb-4 text-lg dark:text-white text-gray-600">{questionnaireData.description}</p>
            <p className="mb-4 dark:text-white text-black font-bold italic">{questionnaireData.consigne}</p>
            <Questionnaire 
              initialMood={0}
              onMoodChange={() => {}}
              userId={userId}
              questionnaireId={currentQuestionnaireId}
              isAnswered={false}
              onClose={() => {}}
              onSave={handleQuestionnaireSave}
              questions={questionnaireData.questions}
              labels={questionnaireData.labels}
            />
          </div>
        )}

        {isQuestionnaireCompleted && (
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Merci !</h2>
            <p className="text-lg">Vos réponses ont été enregistrées avec succès.</p>
          </div>
        )}
      </main>
      <footer className="container text-xs mx-auto py-4 text-center text-gray-600 dark:text-gray-400">
        <p>Une question ? Un problème ? Écrivez à <a href="mailto:support@taline.app" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">support@taline.app</a></p>
      </footer>
    </div>
  );
}
