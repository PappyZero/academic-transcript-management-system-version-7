import { Web3Storage } from 'web3.storage';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { pdfBlob, student } = req.body;
      const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
      const file = new File([Buffer.from(pdfBlob, 'base64')], `${student.matricNumber}.pdf`);
      const cid = await client.put([file]);

      res.status(200).json({ cid });
    } catch (error) {
      console.error('Upload failed:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}