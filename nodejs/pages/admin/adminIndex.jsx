import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/AdminNavbar';

export default function AdminDashboard() {
  const [universities, setUniversities] = useState([]);
  const [verifiers, setVerifiers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/db-api');
      const result = await response.json();
      setUniversities(result.universities || []);
      setVerifiers(result.verifiers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="text-black">
      <Navbar />
      <div className=' flex justify-center items-center'>
        <h1 className="text-2xl font-bold mt-6 mb-4 ">Admin Dashboard</h1>
      </div>

      <div className="p-1 mb-8">
        <h2 className="text-xl font-semibold mb-2">Approved Universities</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Academic Exam Officer's Address</th>
            </tr>
          </thead>
          <tbody>
            {universities.length > 0 ? (
              universities.map((uni) => (
                <tr key={uni._id}>
                  <td className="border border-gray-300 p-2">{uni.name}</td>
                  <td className="border border-gray-300 p-2">{uni.Academic_Exam_officerAddress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-gray-300 p-2 text-center">No universities found</td>
              </tr>
            )}
          </tbody>
        </table>
        <Link href="/admin/manage-university">
          <span className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded mb-20">Manage Universities</span>
        </Link>
      </div>

      <div className="p-1 mb-8">
        <h2 className="text-xl font-semibold mb-2">Approved Verifiers</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            {verifiers.length > 0 ? (
              verifiers.map((verifier) => (
                <tr key={verifier._id}>
                  <td className="border border-gray-300 p-2">{verifier.name}</td>
                  <td className="border border-gray-300 p-2">{verifier.walletAddress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-gray-300 p-2 text-center">No verifiers found</td>
              </tr>
            )}
          </tbody>
        </table>
        <Link href="/admin/manage-verifiers">
          <span className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded">Manage Verifiers</span>
        </Link>
      </div>
    </div>
  );
}