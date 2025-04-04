import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import UniversityNavbar from '../../../../components/UniversityNavbar';
import Footer from '../../../../components/Footer';

export default function TranscriptPage() {
  const router = useRouter();
  const { id } = router.query;
  const [transcriptData, setTranscriptData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDownloadPDF = () => {
    const transcriptElement = document.getElementById('transcript');
    html2canvas(transcriptElement, { scale: 2, useCORS: true })
      .then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`transcript_${transcriptData.studentInfo.matricNumber}.pdf`);
        toast.success('Transcript download started...');
      })
      .catch((error) => {
        toast.error(`Download failed: ${error.message}`);
      });
  };

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) throw new Error('Invalid student ID');
        
        const res = await fetch(`/api/student-transcript?id=${id}`);
        if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch');
        
        setTranscriptData(await res.json());
        toast.success('Transcript loaded successfully!');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscriptData();
  }, [id]);

  if (loading) return (
  <div className="min-h-screen flex flex-col">
    <UniversityNavbar />
    <main className="flex-grow pt-20 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="text-black">Loading...</p>
      </div>
    </main>
  </div>);

  return (
    <div className="min-h-screen pb-6">
      <UniversityNavbar />
      {/* Background Decoration */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>

      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="pt-16 max-w-3xl mx-auto">
          <div 
            id="transcript"
            className="bg-white rounded-lg shadow-xl p-6 border border-gray-200"
          >
            <h1 className="text-2xl font-bold text-black text-center mb-8">
              Unofficial Transcript
            </h1>

            {transcriptData ? (
              <>
                {/* Student Information */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-bold text-black">Name</label>
                      <p className="text-black">{transcriptData.studentInfo.name}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-bold text-black">Matric Number</label>
                      <p className="text-black">{transcriptData.studentInfo.matricNumber}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-bold text-black">Wallet Address</label>
                      <p className="font-mono text-gray-600 break-words">
                        {transcriptData.studentInfo.walletAddress}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-bold text-black">Faculty</label>
                      <p className="text-black">{transcriptData.studentInfo.faculty}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-bold text-black">Programme</label>
                      <p className="text-black">{transcriptData.studentInfo.programme}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-bold text-black">Current Level</label>
                      <p className="text-black">Level {transcriptData.studentInfo.currentLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Records */}
                {transcriptData.academicRecords.map((record, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      {record.session} | {record.level} Level | {record.semester} 
                    </h2>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Course Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Course Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Credits</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Grade</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {record.courses.map((course, courseIndex) => (
                            <tr key={courseIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-black">{courseIndex + 1}</td>
                              <td className="px-4 py-3 text-sm text-black">{course.courseCode}</td>
                              <td className="px-4 py-3 text-sm text-black">{course.courseTitle}</td>
                              <td className="px-4 py-3 text-sm text-black text-center">{course.creditUnit}</td>
                              <td className="px-4 py-3 text-sm text-black text-center">{course.score}</td>
                              <td className="px-4 py-3 text-sm text-black text-center">{course.grade}</td>
                              <td className="px-4 py-3 text-sm text-black text-center">{course.passFail}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-bold text-black">Total Credits: </span>
                        <span className="text-black">
                          {record.courses.reduce((sum, course) => sum + course.creditUnit, 0)}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-bold text-black">Semester GPA: </span>
                        <span className="text-black">
                          {record.semesterGPA?.toFixed(2) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cumulative GPA */}
                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black">Cumulative GPA</span>
                    <span className="text-2xl font-bold text-green-700">
                      {transcriptData.cumulativeGPA?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-black py-8">
                No transcript data available
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-white text-black hover:bg-green-200 p-2 shadow-xl border-b-2 border-green-500 bg-green rounded-md transition-colors duration-200"
          >
            Download PDF
          </button>
          <button
            onClick={() => router.push(`/university/transcript/${id}/generate-hash`)}
            className="bg-white text-black hover:bg-green-200 p-2 shadow-xl border-b-2 border-green-500 bg-green rounded-md transition-colors duration-200"
          >
            Generate Blockchain Hash
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}