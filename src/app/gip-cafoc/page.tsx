// /src/app/gip-cafoc/page.tsx

"use client";
import { useState } from 'react';
import PublicNavbar from '@/app/components/PublicNavbar';
import GipProfilePage from '@/app/components/GipProfilePage';
import Questionnaire from '@/app/components/Questionnaire';
import questionnairesData from '../data/questionnaires.json';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const questionnaireData = questionnairesData['8'];

  const handleProfileSave = (newUserId: string) => {
    setUserId(newUserId);
  };

  const handleQuestionnaireSave = () => {
    setIsQuestionnaireCompleted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="container mx-auto mt-8 flex-grow flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg">
          <GipProfilePage 
            onClose={() => {}}
            onQuestionnaireOpen={() => {}}
            onProfileSave={handleProfileSave}
          />
        </div>

        {userId && !isQuestionnaireCompleted && (
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg">
            <p className="mb-4 text-lg dark:text-white text-gray-600">{questionnaireData.description}</p>
            <p className="mb-4 dark:text-white text-black font-bold italic">{questionnaireData.consigne}</p>
            <Questionnaire 
              initialMood={0}
              onMoodChange={() => {}}
              userId={userId}
              questionnaireId="8"
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
