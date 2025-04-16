// pages/api/db-api.js (full updated code)
import clientPromise from '../../utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('academic-transcript-system');

    // Fetch all collections
    const studentsCollection = db.collection('students');
    const transcriptsCollection = db.collection('transcripts');
    const coursesCollection = db.collection('courses');
    const departmentsCollection = db.collection('departments');
    const facultiesCollection = db.collection('faculties');
    const gradesCollection = db.collection('grades');
    const programmesCollection = db.collection('programmes');
    const semestersCollection = db.collection('semesters');
    const sessionsCollection = db.collection('sessions');

    // Fetch all students with basic info and latest transcript
    const students = await studentsCollection.aggregate([
      {
        $lookup: {
          from: "transcripts",
          let: { studentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$studentId", "$$studentId"] } } },
            { $sort: { "sessionId": -1 } },
            { $limit: 1 }
          ],
          as: "latestTranscript"
        }
      },
      { $unwind: { path: "$latestTranscript", preserveNullAndEmptyArrays: true } },
      // Lookup course names
      {
        $lookup: {
          from: "courses",
          localField: "latestTranscript.courses.courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      // Lookup faculty name
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "facultyDetails"
        }
      },
      { $unwind: { path: "$facultyDetails", preserveNullAndEmptyArrays: true } },
      // Lookup programme name
      {
        $lookup: {
          from: "programmes",
          localField: "programmeId",
          foreignField: "_id",
          as: "programmeDetails"
        }
      },
      { $unwind: { path: "$programmeDetails", preserveNullAndEmptyArrays: true } },
      // Lookup department name
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "_id",
          as: "departmentDetails"
        }
      },
      { $unwind: { path: "$departmentDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          matricNumber: 1,
          walletAddress: 1,
          faculty: "$facultyDetails.name",
          programme: "$programmeDetails.name",
          department: "$departmentDetails.name",
          session: "$latestTranscript.sessionId",
          semester: "$latestTranscript.semesterId",
          courses: "$courseDetails.title", // Changed from courseName to title
          grades: "$latestTranscript.grades",
          level: 1, // Ensure this line exists
          latestGPA: "$latestTranscript.gpa",
          transcriptHash: "$latestTranscript.transcriptHash"
        }
      }
    ]).toArray();

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}