import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || uuidv4();

    const client = await clientPromise;
    const db = client.db("questionnaires");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ userId });

    if (user) {
      return NextResponse.json({ 
        firstName: user.firstName || '', 
        lastName: user.lastName || '',   
        ofA: user.ofA || '',             
        gender: user.gender || '',       
        age: user.age || null,
        campus: user.campus || '',
        metier: user.metier || '',
        userId: user.userId
      });
    } else {
      return NextResponse.json({ 
        firstName: '', 
        lastName: '', 
        ofA: '', 
        gender: '', 
        age: null,
        campus: '',
        metier: '',
        userId
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, role, ofA, gender, age, campus, metier, isCompleted, userId: existingUserId } = await request.json();
    
    // Utiliser le userId existant ou en générer un nouveau
    const userId = existingUserId || uuidv4();

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
      campus,
      metier,
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