"use client";
import React from 'react';
import Image from 'next/image';
import questionnairesData from '../data/questionnaires.json';

interface QuestionnaireType {
  id: number;
  icon: string;
  title: string;
  description: string;
  questions: string[];
}

interface PublicHomeProps {
  onQuestionnaireClick: () => void;
}

const PublicHome: React.FC<PublicHomeProps> = ({ onQuestionnaireClick }) => {
  const questionnaire = Object.entries(questionnairesData)
    .filter(([id]) => id === '1')
    .map(([id, questionnaire]) => ({
      ...questionnaire,
      id: Number(id),
    }))[0] as QuestionnaireType;

  if (!questionnaire) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">Questionnaire non trouvé</h1>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bienvenue sur CCCA-BTP</h1>
        <p className="mt-4">Découvrez notre questionnaire et connectez-vous pour y participer.</p>
      </div>
      <div className="flex justify-center mt-8">
        <div className="relative w-full max-w-md aspect-square">
          <div 
            className="p-2 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={onQuestionnaireClick}
          >
            <div className="relative w-full h-96">
              <Image 
                src={questionnaire.icon} 
                alt={questionnaire.title} 
                fill 
                style={{ objectFit: 'cover' }} 
                className="rounded-lg" 
              />
            </div>
            <h2 className="text-lg mt-1 font-semibold text-center">{questionnaire.title}</h2>
            <p className="text-center text-sm text-gray-600">{questionnaire.questions.length} questions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicHome; 