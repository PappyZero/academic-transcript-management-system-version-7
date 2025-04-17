import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user || session.user.role !== 'university') {
    return res.status(403).json({ message: 'University access required' });
  }

  // Implement sharing/revoking logic here
}