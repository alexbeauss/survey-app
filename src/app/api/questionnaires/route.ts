import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("questionnaires");

    const answers = await db
      .collection("answers")
      .find({})
      .limit(10)
      .toArray();

    return NextResponse.json(answers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
