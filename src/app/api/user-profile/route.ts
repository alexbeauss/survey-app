import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("questionnaires");
  const usersCollection = db.collection("users");
  
  // Utilisation de l'email de l'utilisateur pour récupérer ses informations
  const user = await usersCollection.findOne({ userId: session.user.sub });

  if (user) {
    return NextResponse.json({ 
      profile: user.profile || '', 
      centre: user.centre || '', 
      role: user.role || '', 
      isCompleted: user.isCompleted || false // Ajout de isCompleted
    });
  } else {
    return NextResponse.json({ 
      profile: '', 
      centre: '', 
      role: '', 
      isCompleted: false // Retourner false si l'utilisateur n'est pas trouvé
    });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { profile, centre, role, isCompleted } = await request.json(); // Récupération des données, y compris isCompleted
  const userId = session.user.sub; // Récupération du userId à partir de la session

  const client = await clientPromise;
  const db = client.db("questionnaires");
  const usersCollection = db.collection("users");

  await usersCollection.updateOne(
    { email: session.user.email }, // Utilisation de l'email pour identifier l'utilisateur
    { $set: { profile, centre, role, userId, isCompleted } }, // Ajout de isCompleted dans la mise à jour
    { upsert: true }
  );

  return NextResponse.json({ message: 'Profil sauvegardé avec succès' });
}
