const { Schema, model } = require('mongoose');
const assignmentSchema = require('./Assignment');
//Schema means "Scheme for the MVC"
// Schema to create Student model
const studentSchema = new Schema(
  {
    first: {
      type: String,
      required: true,
      max_length: 50,
    },
    last: {
      type: String,
      required: true,
      max_length: 50,
    },
    github: {//store nonoperational url links 
      type: String,
      required: true,
      max_length: 50,
    },
    assignments: [assignmentSchema],//the array from Assignment.js is here
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Student = model('student', studentSchema);//exports this model with the ("name id", model)
//compare with 25
module.exports = Student;
