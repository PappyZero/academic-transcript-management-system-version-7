import clientPromise from '../../utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    // Validate the ID
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    console.log('Fetching transcript for student ID:', id);

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
    const staffsCollection = db.collection('staffs');

    // Fetch student basic info
    const student = await studentsCollection.findOne({ 
      _id: new ObjectId(id) 
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    console.log('Fetched student:', student);

    // Fetch all related data in single aggregation
    const transcriptData = await transcriptsCollection.aggregate([
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
        $project: 
        {
          session: "$session.name",
          semester: "$semester.name",
          level: 1,
          courses: 
          {
            $map: 
            {
              input: "$courses",
              as: "course",
              in: {
                $mergeObjects: 
                [
                  "$$course",
                  {
                    $arrayElemAt: 
                    [
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
          },
          semesterGPA: 1,
          transcriptHash: 1
        }
      },
      { $sort: { "session": 1, "semester": 1 } }
    ]).toArray();

    console.log('Fetched transcript data:', transcriptData);

    // Calculate cumulative GPA
    const cumulativeResult = await transcriptsCollection.aggregate([
      { $match: { studentId: new ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: "$totalCreditUnit" },
          weightedGPA: { $sum: { $multiply: ["$semesterGPA", "$totalCreditUnit"] } }
        }
      }
    ]).toArray();

    console.log('Cumulative GPA result:', cumulativeResult);

    const response = {
      studentInfo: {
        name: student.name,
        matricNumber: student.matricNumber,
        walletAddress: student.walletAddress, // Include walletAddress
        faculty: (await facultiesCollection.findOne({ _id: student.facultyId }))?.name,
        programme: (await programmesCollection.findOne({ _id: student.programmeId }))?.name,
        department: (await departmentsCollection.findOne({ _id: student.departmentId }))?.name,
        currentLevel: student.level
      },
      academicRecords: transcriptData,
      cumulativeGPA: cumulativeResult[0] 
        ? cumulativeResult[0].weightedGPA / cumulativeResult[0].totalCredits 
        : 0
    };

    console.log('Final response:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}