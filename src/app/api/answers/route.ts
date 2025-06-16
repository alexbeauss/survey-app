import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Méthode POST pour enregistrer les réponses
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("questionnaires");
    
    const { moods, userId, questionnaireId } = await request.json(); // Récupération des données du corps de la requête

    // Vérifiez d'abord si une réponse existe déjà
    const existingAnswer = await db.collection("answers").findOne({ userId, questionnaireId });
    if (existingAnswer) {
      // Si une réponse existe, mettez à jour l'entrée existante
      await db.collection("answers").updateOne(
        { userId, questionnaireId },
        { $set: { moods, isAnswered: true, updatedAt: new Date() } }
      );
    } else {
      // Sinon, insérez une nouvelle réponse
      await db.collection("answers").insertOne({ moods, userId, questionnaireId, isAnswered: true, createdAt: new Date() });
    }

    return NextResponse.json({ message: 'Réponse sauvegardée avec succès' }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Méthode GET pour récupérer les réponses
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("questionnaires");

    const { searchParams } = new URL(request.url);
    const questionnaireId = searchParams.get('questionnaireId');
    const userId = searchParams.get('userId');

    // Recherche d'une réponse correspondant au questionnaireId et userId
    const answer = await db.collection("answers").findOne({ questionnaireId, userId });

    // Vérifie si une réponse existe et si elle date de moins d'un mois
    const isAnswered = answer ? (() => {
      const lastAnswerDate = new Date(answer.updatedAt || answer.createdAt);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return lastAnswerDate > oneMonthAgo;
    })() : false;

    return NextResponse.json({ isAnswered }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}