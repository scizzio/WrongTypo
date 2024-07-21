const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ExampleModel = mongoose.model('ExampleModel', exampleSchema);
module.exports = ExampleModel;
