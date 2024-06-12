const { Schema, model } = require('mongoose');

// Schema to create a course model
const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    inPerson: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      // Sets a default value of 12 weeks from now
      default: () => new Date(+new Date() + 84 * 24 * 60 * 60 * 1000),
    },//+current date, and then adds the numbers behind it
    students: [
      { //an array of students inside the course, so allows me to associate those specific students with the courses 
        type: Schema.Types.ObjectId,//{Schema (require mongoose)}, Types of foreignkey.ObjectId of student
        ref: 'student',
      },
    ],
  },
  {
    toJSON: {//virtuals are allowed
      virtuals: true,//any fields that are calculated on the spot and/or constantly changing, so it doesn't exist in the database
    },
    id: false,
  }
);

const Course = model('course', courseSchema);

module.exports = Course;
