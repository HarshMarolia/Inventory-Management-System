import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    let {action, slug, initialQuantity} = await request.json();
    const uri = process.env.API_URL;
    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const filter = { slug: slug };
        let newQuantity = action == "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1);
        const updateDoc = {
            $set: {
                quantity: newQuantity
            },
        };
        const result = await inventory.updateOne(filter, updateDoc)
        return NextResponse.json({ result, message: `${result.matchedCount} documents matched the filter, updated ${result.modifiedCount} documents`})
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}