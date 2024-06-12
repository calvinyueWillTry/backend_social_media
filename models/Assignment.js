const { Schema, Types } = require('mongoose');

const assignmentSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),//going to create the id
    },
    assignmentName: {
      type: String,
      required: true,
      maxlength: 50,//characters
      minlength: 4,
      default: 'Unnamed assignment',
    },
    score: {
      type: Number,
      required: true,
      default: () => Math.floor(Math.random() * (100 - 70 + 1) + 70),//randomly give scores to populate the data
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      getters: true,// allows user to transform data in MongoDB into assigned form (JSON here) for reader-friendly purposes
    },
    id: false,//doesn't reaplce the ObjectId at {_id: }
  }
);

module.exports = assignmentSchema;
