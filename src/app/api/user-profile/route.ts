// /src/pages/api/user-profile.ts

import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const session = await getSession();

  console.log(session);
  if (!session || !session.user) {
    // Générer un userId unique pour les utilisateurs non authentifiés
    const userId = uuidv4();
    return NextResponse.json({ 
      profile: '', 
      centre: '', 
      role: '', 
      isCompleted: false,
      firstName: '', 
      lastName: '', 
      ofA: '', 
      gender: '', 
      age: null,
      userId 
    });
  }

  const client = await clientPromise;
  const db = client.db("questionnaires");
  const usersCollection = db.collection("users");

  try {
    // Toujours utiliser l'identifiant Auth0 pour les utilisateurs authentifiés
    const userId = session.user.sub;

    const user = await usersCollection.findOne({ userId });

    if (user) {
      return NextResponse.json({ 
        profile: user.profile || '', 
        centre: user.centre || '', 
        role: user.role || '', 
        isCompleted: user.isCompleted || false,
        firstName: user.firstName || '', 
        lastName: user.lastName || '',   
        ofA: user.ofA || '',             
        gender: user.gender || '',       
        age: user.age || null,
        userId: session.user.sub // Toujours retourner l'identifiant Auth0
      });
    } else {
      return NextResponse.json({ 
        profile: '', 
        centre: '', 
        role: '', 
        isCompleted: false,
        firstName: '', 
        lastName: '', 
        ofA: '', 
        gender: '', 
        age: null,
        userId: session.user.sub // Toujours retourner l'identifiant Auth0
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const { firstName, lastName, role, ofA, gender, age, isCompleted } = await request.json();
    
    // Utiliser l'identifiant Auth0 si l'utilisateur est authentifié, sinon générer un UUID
    const userId = session?.user?.sub || uuidv4();

    const client = await clientPromise;
    const db = client.db("questionnaires");
    const usersCollection = db.collection("users");

    const updateData = {
      firstName,
      lastName,
      role,
      ofA,
      gender,
      age,
      userId,
      isCompleted,
      updatedAt: new Date()
    };

    await usersCollection.updateOne(
      { userId },
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ 
      message: 'Profil sauvegardé avec succès', 
      userId,
      success: true
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil utilisateur:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
