import { useEffect, useState } from 'react';
import Navbar from '../../components/AdminNavbar';

export default function ManageVerifiers() {
  const [pendingVerifiers, setPendingVerifiers] = useState([]);

  useEffect(() => {
    fetchPendingVerifiers();
  }, []);

  const fetchPendingVerifiers = async () => {
    try {
      const res = await fetch('/api/manage-verifiers');
      if (res.ok) {
        const verifiers = await res.json();
        setPendingVerifiers(verifiers);
      }
    } catch (error) {
      // Error handling removed
    }
  };

  const approveVerifier = async (id) => {
    try {
      const res = await fetch('/api/manage-verifiers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchPendingVerifiers();
      }
    } catch (error) {
      // Error handling removed
    }
  };

  const deleteVerifier = async (id) => {
    try {
      const res = await fetch('/api/manage-verifiers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchPendingVerifiers();
      }
    } catch (error) {
      // Error handling removed
    }
  };

  return (
    <div className="text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-6 flex justify-center items center mb-6">Manage Verifiers</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Wallet Address</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingVerifiers.map((verifier) => (
            <tr key={verifier._id}>
              <td className="border border-gray-300 p-2">{verifier.name}</td>
              <td className="border border-gray-300 p-2">{verifier.walletAddress}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => approveVerifier(verifier._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => deleteVerifier(verifier._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}