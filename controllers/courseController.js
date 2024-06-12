const { Course, Student } = require('../models');
//what does this do?
module.exports = {
  // Get all courses
  async getCourses(req, res) {
    try {//query all courses from the database.populate the students field (including details) for each course
      const courses = await Course.find().populate('students');
      res.json(courses);//render
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a course
  async getSingleCourse(req, res) {
    try {//query one course({find by _id: the request's parameter being courseId})
      const course = await Course.findOne({ _id: req.params.courseId })
        .populate('students');

      if (!course) {
        return res.status(404).json({ message: 'No course with that ID' });
      }

      res.json(course);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a course
  async createCourse(req, res) {
    try { //create the course, giving the request a body to input into
      const course = await Course.create(req.body);
      res.json(course);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a course
  async deleteCourse(req, res) {
    try {//find and delete a course by its _id, which is passed as a parameter in the request URL (req.params.courseId)
      const course = await Course.findOneAndDelete({ _id: req.params.courseId });

      if (!course) {
        res.status(404).json({ message: 'No course with that ID' });
      }
//delete all students associated with that course
      await Student.deleteMany({ _id: { $in: course.students } });//a filter that matches the _id of the students that are in the course.students array.
      res.json({ message: 'Course and students deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a course
  async updateCourse(req, res) {
    try {//find and update a course by its _id
      const course = await Course.findOneAndUpdate(//It takes three parameters:
        { _id: req.params.courseId },//filters for this object that specifies which course to update based on its _id.
        { $set: req.body },//contains the update data from the req.body; this updates the course with the new values provided in the request
        { runValidators: true, new: true }
      );//specifies that Mongoose should run validators on the update operation and return the updated document

      if (!course) {
        res.status(404).json({ message: 'No course with this id!' });
      }

      res.json(course);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
