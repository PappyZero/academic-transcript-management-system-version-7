import { useEffect, useState } from 'react';
import Navbar from '../../components/AdminNavbar';


export default function ManageUniversities() {
  const [pendingUniversities, setPendingUniversities] = useState([]);

  useEffect(() => {
    fetchPendingUniversities();
  }, []);

  const fetchPendingUniversities = async () => {
    try {
      const response = await fetch('/api/manage-university');
      const universities = await response.json();
      setPendingUniversities(universities);
    } catch (error) {
      console.error('Error fetching pending universities:', error);
    }
  };

  const approveUniversity = async (id) => {
    try {
      await fetch('/api/manage-university', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, action: 'approve' }),
      });
      fetchPendingUniversities();
    } catch (error) {
      console.error('Error approving university:', error);
    }
  };

  const deleteUniversity = async (id) => {
    try {
      await fetch('/api/manage-university', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, action: 'delete' }),
      });
      fetchPendingUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  };

  return (
    <div className="text-black p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Universities</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Exam Officer's Address</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingUniversities.map((uni) => (
            <tr key={uni._id}>
              <td className="border border-gray-300 p-2">{uni.name}</td>
              <td className="border border-gray-300 p-2">{uni.exam_officerAddress}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => approveUniversity(uni._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => deleteUniversity(uni._id)}
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