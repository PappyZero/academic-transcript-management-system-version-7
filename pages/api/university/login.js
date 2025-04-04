import { createSession } from '../../../lib/session';
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, signature, message } = req.body;

    console.log('Received Login Request:', { address, signature, message });

    if (!address || !ethers.isAddress(address)) {
      console.error('Invalid wallet address:', address);
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
    console.log('Admin Wallet:', adminWallet);

    if (ethers.getAddress(address) !== ethers.getAddress(adminWallet)) {
      console.error('Unauthorized wallet address:', address);
      return res.status(401).json({ error: 'Unauthorized wallet address' });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      console.error('Signature verification failed:', { recoveredAddress, address });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Signature verified successfully');

    // Create the session
    await createSession(res, address);
    console.log('Session created successfully');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('University login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}