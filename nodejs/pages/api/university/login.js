import { createSession } from '../../../lib/session';
import { ethers } from 'ethers';
import clientPromise from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, signature, message } = req.body;

    // Validate input
    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check database for authorized university user with case-insensitive match
    const client = await clientPromise;
    const db = client.db('academic-transcript-system');
    const user = await db.collection('users').findOne({
      "walletAddress": { 
        "$regex": `^${ethers.getAddress(address)}$`, 
        "$options": "i" 
      },
      "role": "university"
    });

    if (!user) {
      return res.status(403).json({ 
        error: 'Unauthorized - Not a registered university account' 
      });
    }

    // Normalize address to checksum format
    const normalizedAddress = ethers.getAddress(address);

    // Create session with role information
    await createSession(res, {
      address: normalizedAddress,
      role: user.role,
      userId: user._id.toString(),
      universityDetails: user.universityDetails // Include university info
    });

    res.status(200).json({ 
      success: true,
      user: {
        address: normalizedAddress,
        role: user.role,
        name: user.universityDetails.name,
        domain: user.universityDetails.domain
      }
    });

  } catch (error) {
    console.error('University login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}