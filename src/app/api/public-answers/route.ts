import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { moods, userId, questionnaireId } = await request.json();

    const client = await clientPromise;
    const db = client.db("questionnaires");
    const answersCollection = db.collection("answers");

    const answerData = {
      moods,
      userId,
      questionnaireId,
      isAnswered: true,
      createdAt: new Date()
    };

    await answersCollection.updateOne(
      { userId, questionnaireId },
      { $set: answerData },
      { upsert: true }
    );

    return NextResponse.json({ 
      message: 'Réponses sauvegardées avec succès',
      success: true
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des réponses:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 