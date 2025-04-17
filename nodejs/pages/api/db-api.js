// pages/api/db-api.js
import { connectDB } from '../../utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Use the connectDB utility properly
    const { db } = await connectDB();

    // Fetch all students with basic info and latest transcript using direct db.collection
    const students = await db.collection('students').aggregate([
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
      {
        $lookup: {
          from: "courses",
          localField: "latestTranscript.courses.courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "facultyDetails"
        }
      },
      { $unwind: { path: "$facultyDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "programmes",
          localField: "programmeId",
          foreignField: "_id",
          as: "programmeDetails"
        }
      },
      { $unwind: { path: "$programmeDetails", preserveNullAndEmptyArrays: true } },
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
          courses: "$courseDetails.title",
          grades: "$latestTranscript.grades",
          level: 1,
          latestGPA: "$latestTranscript.gpa",
          transcriptHash: "$latestTranscript.transcriptHash"
        }
      }
    ]).toArray();

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}