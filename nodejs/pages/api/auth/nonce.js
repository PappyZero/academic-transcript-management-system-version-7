import { connectDB } from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectDB();
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    // Generate random 6-digit nonce
    const nonce = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Store nonce in database
    await db.collection('nonces').updateOne(
      { address },
      { $set: { nonce, expiresAt } },
      { upsert: true }
    );

    res.status(200).json({ nonce });
  } catch (error) {
    console.error('Nonce generation error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}