import clientPromise from '../../utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('academic-transcript-system');
    const verifiersCollection = db.collection('verifiers');

    if (req.method === 'GET') {
      const verifiers = await verifiersCollection.find({ approved: false }).toArray();
      res.status(200).json(verifiers);
    } else if (req.method === 'PUT') {
      const { id } = req.body;
      await verifiersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { approved: true } });
      res.status(200).json({ message: 'Verifier approved' });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await verifiersCollection.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Verifier deleted' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error managing verifiers:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}