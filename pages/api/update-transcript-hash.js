import clientPromise from '../../utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { studentId, hash } = req.body;

    // Validate input
    if (!studentId || !hash) {
      return res.status(400).json({ message: 'Missing studentId or hash' });
    }

    const client = await clientPromise;
    const db = client.db('academic-transcript-system');

    // Convert to ObjectId and validate
    let objectId;
    try {
      objectId = new ObjectId(studentId);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid studentId format' });
    }

    // Update the most recent transcript
    const result = await db.collection('transcripts').updateOne(
      { studentId: objectId },
      { $set: { transcriptHash: hash } },
      { sort: { _id: -1 }, upsert: false }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        message: 'No transcript found for this student',
        studentId: studentId
      });
    }

    return res.status(200).json({ 
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
}