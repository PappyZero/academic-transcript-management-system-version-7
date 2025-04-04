import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import UniversityNavbar from '../../../../components/UniversityNavbar';
import Footer from '../../../../components/Footer';

export default function GenerateHashPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  // Generate SHA-256 hash
  const generateHash = async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Fetch transcript data and generate hash
  const fetchAndGenerateHash = async () => {
    try {
      const res = await fetch(`/api/student-transcript?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch transcript');
      
      const data = await res.json();
      setStudentInfo(data.studentInfo);
      
      const generatedHash = await generateHash(data);
      setHash(generatedHash);
      setLoading(false);
      
      toast.success('Hash generated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  // Save hash to database
  const saveHashToDatabase = async () => {
    try {
      const response = await fetch('/api/update-transcript-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: id,
          hash: hash
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save hash');
      }

      toast.success('✅ Hash saved successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      toast.error(`❌ Save failed: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  };

  // Copy hash to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      toast.info('📋 Copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('❌ Failed to copy', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (id) fetchAndGenerateHash();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <UniversityNavbar />
      <main className="flex-grow pt-20 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <p className="text-black">Generating hash...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <UniversityNavbar />
      
      <main className="flex-grow pt-20 p-6"> {/* Added pt-20 for navbar spacing */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          {/* Centered heading inside the white card */}
          <h1 className="text-2xl font-bold mb-6 text-center text-black border-b pb-4">
            Transcript Hash Generation
          </h1>
          
          {studentInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h2 className="font-semibold mb-2 text-green-700">Student Information</h2>
              <p className="text-black">Name: {studentInfo.name}</p>
              <p className="text-black">Matric: {studentInfo.matricNumber}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-700">Generated Hash</h2>
            
            <div className="p-4 bg-gray-100 rounded mb-4 overflow-x-auto">
              <code className="break-all text-black font-mono">{hash}</code>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-white text-black rounded-lg 
                         border-b-4 border-blue-500 hover:border-blue-700 
                         transition-all duration-200 shadow-sm"
              >
                Copy Hash
              </button>
              
              <button
                onClick={saveHashToDatabase}
                className={`px-6 py-3 bg-white text-black rounded-lg 
                         border-b-4 transition-all duration-200 shadow-sm
                         ${hash ? 'border-green-500 hover:border-green-700' : 'border-gray-400 text-gray-400 cursor-not-allowed'}`}
                disabled={!hash}
              >
                Save to Database
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}