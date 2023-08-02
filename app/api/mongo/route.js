import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {


  const uri = process.env.API_URL;

  const client = new MongoClient(uri);


  try {
    const database = client.db('harsh');
    const movies = database.collection('inventory');
    const query = {}
    const movie = await movies.find(query).toArray();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return NextResponse.json({ "a": 34, movie })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}