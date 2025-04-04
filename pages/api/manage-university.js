import { useEffect, useState } from 'react';

export default function ManageUniversity() {
  const [pendingUniversities, setPendingUniversities] = useState([]);

  useEffect(() => {
    const fetchPendingUniversities = async () => {
      try {
        const response = await fetch('/api/db-api');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPendingUniversities(data.universities);
      } catch (error) {
        console.error('Error fetching pending universities:', error);
      }
    };

    fetchPendingUniversities();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Pending Universities</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">University Name</th>
            <th className="py-2 px-4 border">Exam Officer Address</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pendingUniversities) && pendingUniversities.map((uni) => (
            <tr key={uni._id}>
              <td className="border border-gray-300 p-2">{uni.name}</td>
              <td className="border border-gray-300 p-2">{uni.exam_officerAddress}</td>
              <td className="border border-gray-300 p-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}