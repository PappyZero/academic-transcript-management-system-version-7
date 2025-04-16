import clientPromise from '../../utils/db';
import { ObjectId } from 'mongodb';
import { getSession } from '../../lib/session';

const GRADE_POINTS = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'F': 0.0 };

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const session = await getSession(req);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const client = await clientPromise;
    const db = client.db('academic-transcript-system');

    // Fetch student document
    const student = await db.collection('students').findOne({ 
      _id: new ObjectId(id) 
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Authorization check
    if (session.role === 'student' && 
        student.walletAddress.toLowerCase() !== session.address.toLowerCase()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Main aggregation pipeline
    const transcriptData = await db.collection('transcripts').aggregate([
      { $match: { studentId: new ObjectId(id) } },
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
          transcriptHash: 1,
          level: 1 // Include stored level from transcript
        }
      },
      { $sort: { "session": 1 } }
    ]).toArray();

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
        level: record.level, // Use stored level from transcript
        semesterGPA: Number(semesterGPA.toFixed(2)),
        totalCredits: semesterCredits
      };
    });

    // Final cumulative GPA
    const cumulativeGPA = cumulativeCredits > 0
      ? (cumulativeQualityPoints / cumulativeCredits)
      : 0;

    const response = {
      studentInfo: {
        name: student.name,
        matricNumber: student.matricNumber,
        walletAddress: student.walletAddress,
        faculty: (await db.collection('faculties').findOne({ _id: student.facultyId }))?.name,
        programme: (await db.collection('programmes').findOne({ _id: student.programmeId }))?.name,
        department: (await db.collection('departments').findOne({ _id: student.departmentId }))?.name,
        currentLevel: student.level // Current level from student document
      },
      academicRecords: processedRecords,
      cumulativeGPA: Number(cumulativeGPA.toFixed(2))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}