import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("questionnaires");
    
    const { moods, userId, questionnaireId } = await request.json(); // Récupération des données du corps de la requête

    // Insertion des données dans la collection "answers"
    await db.collection("answers").insertOne({ moods, userId, questionnaireId, isAnswered: true, createdAt: new Date() }); // Enregistrer les humeurs

    return NextResponse.json({ message: 'Réponse sauvegardée avec succès' }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: Request) { // Ajout de la méthode GET
  try {
    const client = await clientPromise;
    const db = client.db("questionnaires");

    const { searchParams } = new URL(request.url); // Récupération des paramètres de requête
    const questionnaireId = searchParams.get('questionnaireId'); // Récupération de questionnaireId
    const userId = searchParams.get('userId'); // Récupération de userId

    // Recherche d'une réponse correspondant au questionnaireId et userId
    const answer = await db.collection("answers").findOne({ questionnaireId, userId });

    // Si aucune réponse n'est trouvée, définir isAnswered comme false
    const isAnswered = answer ? answer.isAnswered : false;

    return NextResponse.json({ isAnswered }, { status: 200 }); // Retour de la propriété isAnswered
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
