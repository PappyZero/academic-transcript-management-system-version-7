import { useEffect, useState } from 'react';
import Link from 'next/link';
import UniversityNavbar from '../../components/UniversityNavbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function UniversityDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/db-api');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! ${res.status}`);
        }
        const data = await res.json();
        setStudents(data.students || []);
        toast.success('Students data loaded successfully!');
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error(`Error fetching students: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading)
  return(
    <div className="min-h-screen flex flex-col">
      <UniversityNavbar />
      <main className="flex-grow pt-20 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <p className="text-black">Loading...</p>
        </div>
      </main>
    </div>
    );

  return (
    <ProtectedRoute allowedRoles={['university']}>
      <div className="min-h-screen">
        <UniversityNavbar />
          {/* Background Decoration */}
          <div className="blob top-right"></div>
          <div className="blob top-left animation-delay-2000"></div>

        <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="pt-16 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold pt-7 text-black">Student Registry</h1>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Matric Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Wallet Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Faculty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Programme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Latest GPA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Transcript Hash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.matricNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{student.walletAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.faculty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.programme}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Level {student.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {student.latestGPA?.toFixed(2) || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                          {student.transcriptHash || 'Not generated'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link href={`/university/transcript/${student._id}`}>
                            <button className="text-black hover:bg-green-200 p-2 shadow-xl border-b-2 border-green-500 bg-green rounded-md transition-colors duration-200">
                              View Transcript
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}