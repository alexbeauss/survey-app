// /src/pages/api/user-profile.ts

import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  const session = await getSession(); // Utiliser getSession sans passer la requête

  console.log(session); // Vérifie si la session est valide
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("questionnaires");
  const usersCollection = db.collection("users");

  try {
    const { searchParams } = new URL(request.url); // Récupération des paramètres de requête
    const userId = searchParams.get('userId') || session.user.sub; // Utilisation de userId de la requête ou de la session

    const user = await usersCollection.findOne({ userId }); // Assurez-vous que userId est indexé

    if (user) {
      return NextResponse.json({ 
        profile: user.profile || '', 
        centre: user.centre || '', 
        role: user.role || '', 
        isCompleted: user.isCompleted || false 
      });
    } else {
      return NextResponse.json({ 
        profile: '', 
        centre: '', 
        role: '', 
        isCompleted: false 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession(); // Utiliser getSession sans passer la requête

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { profile, centre, role, isCompleted } = await request.json(); // Récupération des données, y compris isCompleted
  const userId = session.user.sub; // Récupération du userId à partir de la session

  const client = await clientPromise;
  const db = client.db("questionnaires");
  const usersCollection = db.collection("users");

  try {
    await usersCollection.updateOne(
      { email: session.user.email }, // Utilisation de l'email pour identifier l'utilisateur
      { $set: { profile, centre, role, userId, isCompleted } }, // Ajout de isCompleted dans la mise à jour
      { upsert: true }
    );

    return NextResponse.json({ message: 'Profil sauvegardé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}