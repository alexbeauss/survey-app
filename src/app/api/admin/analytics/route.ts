import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("questionnaires");

    // Récupérer toutes les réponses avec les informations utilisateur
    const answers = await db.collection("answers")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "userId",
            as: "userInfo"
          }
        },
        {
          $unwind: "$userInfo"
        }
      ]).toArray();

    return NextResponse.json(answers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 