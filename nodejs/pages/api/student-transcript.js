import { connectDB } from '../../utils/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const GRADE_POINTS = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'F': 0.0 };

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    // Validate student ID format
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    // Get session using NextAuth
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ message: 'Unauthorized - Please log in' });
    }

    // Connect to MongoDB
    const { db } = await connectDB(); // Correctly destructure `db` from `connectDB`

    const studentId = new ObjectId(id);

    // Fetch student document with access control
    const student = await db.collection('students').findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Role-based access control
    const { role, walletAddress } = session.user;

    // University Access: Full access
    const isUniversity = role === 'university';

    // Student Access: Only their own records
    const isStudentOwner = role === 'student' &&
      student.walletAddress.toLowerCase() === walletAddress.toLowerCase();

    // Verifier Access: Only shared transcripts
    const isVerifierWithAccess = role === 'verifier' &&
      await db.collection('shared_transcripts').findOne({
        studentId: studentId,
        verifierAddress: walletAddress.toLowerCase(),
        status: 'approved'
      });

    if (!isUniversity && !isStudentOwner && !isVerifierWithAccess) {
      return res.status(403).json({
        message: 'Access denied - Insufficient permissions',
        requiredAccess: 'Ownership, university role, or valid sharing agreement'
      });
    }

    // Main aggregation pipeline with security filtering
    const pipeline = [
      { $match: { studentId: studentId } },
      {
        $lookup: {
          from: "sessions",
          localField: "sessionId",
          foreignField: "_id",
          as: "session"
        }
      },
      { $unwind: "$session" },
      {
        $lookup: {
          from: "semesters",
          localField: "semesterId",
          foreignField: "_id",
          as: "semester"
        }
      },
      { $unwind: "$semester" },
      {
        $lookup: {
          from: "courses",
          localField: "courses.courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $addFields: {
          courses: {
            $map: {
              input: "$courses",
              as: "course",
              in: {
                $mergeObjects: [
                  "$$course",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$courseDetails",
                          as: "cd",
                          cond: { $eq: ["$$cd._id", "$$course.courseId"] }
                        }
                      },
                      0
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          session: "$session.name",
          semester: "$semester.name",
          courses: 1,
          transcriptHash: isUniversity ? 1 : 0, // Only university sees hash
          level: 1
        }
      },
      { $sort: { "session": 1 } }
    ];

    const transcriptData = await db.collection('transcripts')
      .aggregate(pipeline)
      .toArray();

    // GPA calculation logic
    let cumulativeQualityPoints = 0;
    let cumulativeCredits = 0;

    const processedRecords = transcriptData.map(record => {
      let semesterQualityPoints = 0;
      let semesterCredits = 0;

      record.courses.forEach(course => {
        const credits = Number(course.creditUnits) || 0;
        const gradePoint = GRADE_POINTS[course.grade] || 0;

        semesterQualityPoints += credits * gradePoint;
        semesterCredits += credits;

        // Add course metadata
        course.courseCode = course.code;
        course.courseTitle = course.title;
        course.credits = credits;
      });

      const semesterGPA = semesterCredits > 0
        ? (semesterQualityPoints / semesterCredits)
        : 0;

      cumulativeQualityPoints += semesterQualityPoints;
      cumulativeCredits += semesterCredits;

      return {
        ...record,
        level: record.level,
        semesterGPA: Number(semesterGPA.toFixed(2)),
        totalCredits: semesterCredits
      };
    });

    // Final cumulative GPA
    const cumulativeGPA = cumulativeCredits > 0
      ? (cumulativeQualityPoints / cumulativeCredits)
      : 0;

    // Build response based on role
    const response = {
      studentInfo: {
        name: student.name,
        matricNumber: student.matricNumber,
        walletAddress: isUniversity ? student.walletAddress : 'REDACTED',
        faculty: (await db.collection('faculties').findOne({ _id: student.facultyId }))?.name,
        programme: (await db.collection('programmes').findOne({ _id: student.programmeId }))?.name,
        department: (await db.collection('departments').findOne({ _id: student.departmentId }))?.name,
        currentLevel: student.level
      },
      academicRecords: processedRecords,
      cumulativeGPA: Number(cumulativeGPA.toFixed(2)),
      verification: isVerifierWithAccess ? {
        sharedBy: student.university,
        sharedDate: isVerifierWithAccess.sharedDate,
        expiration: isVerifierWithAccess.expiration
      } : undefined
    };

    // Remove sensitive info for non-university roles
    if (!isUniversity) {
      delete response.studentInfo.walletAddress;
      response.academicRecords.forEach(record => delete record.transcriptHash);
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}