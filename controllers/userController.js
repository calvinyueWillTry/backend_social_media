const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
//what does this do?
// Aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfStudents = await User.aggregate()//building an aggregation pipeline
    .count('studentCount');//$count aggregation operator counts the # of documents in the aggregation pipeline and assigns results to field 'studentCount'
  return numberOfStudents;//results
}

// Aggregate function for getting the overall grade using $avg
const grade = async (studentId) =>
User.aggregate([//start building an aggregation pipeline
    // only include the given student by using $match
    { $match: { _id: new ObjectId(studentId) } },
    {//filter and include only the documents that match the given studentId
      $unwind: '$assignments',
    },//deconstruct the assignments array, creating a separate document for each element of the array
    {
      $group: {//group the documents by the specified studentId, 
        _id: new ObjectId(studentId),//calculate the average of the score field in the assignments array,
        overallGrade: { $avg: '$assignments.score' },//storing it in the overallGrade: field
      },//function returns the aggregation result, which includes the _id (studentId) and the calculated overallGrade
    },
  ]);

module.exports = {
  // Get all students
  async getStudents(req, res) {
    try {//query all students
      const students = await User.find();

      const studentObj = {//2 objects in this array
        students,
        headCount: await headCount(),//from line 5
      };

      res.json(studentObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleStudent(req, res) {
    try {//query one student({find by _id: the request's URL parameter being courseId})
      const student = await User.findOne({ _id: req.params.studentId })
        .select('-__v');//returns a JSON response containing the student's info 
//(exclude the __v (_v = field name)) and their grade obtained by.
      if (!student) {
        return res.status(404).json({ message: 'No student with that ID' })
      }
// calling the grade function with that student's ID
      res.json({
        student,
        grade: await grade(req.params.studentId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createStudent(req, res) {
    try {//make a body for the request to create a new student
      const student = await User.create(req.body);
      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a student and remove them from the course
  async deleteStudent(req, res) {
    try {//find a student using their _id: studentId as the params in the req in the URL
      const student = await User.findOneAndRemove({ _id: req.params.studentId });

      if (!student) {
        return res.status(404).json({ message: 'No such student exists' });
      }
//find their course that the student is being removed from, and update the following "columns":
      const course = await Thought.findOneAndUpdate(
        { students: req.params.studentId },//find that specific students like line 75
        { $pull: { students: req.params.studentId } },//pull from the array
        { new: true }//update
      );

      if (!course) {
        return res.status(404).json({
          message: 'Student deleted, but no courses found',
        });
      }

      res.json({ message: 'Student successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addAssignment(req, res) {
    console.log('You are adding an assignment');
    console.log(req.body);//lets you see what assignment is in the req.body

    try {
      const student = await User.findOneAndUpdate(//require the following add in the json array to add an assignment
        { _id: req.params.studentId },
        { $addToSet: { assignments: req.body } },//new assignment
        { runValidators: true, new: true }//verify and then update
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeAssignment(req, res) {
    try {
      const student = await User.findOneAndUpdate(
        { _id: req.params.studentId },
        { $pull: { assignment: { assignmentId: req.params.assignmentId } } },//pull a specific assignment by its id
        { runValidators: true, new: true }
      );

      if (!student) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
