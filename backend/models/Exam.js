const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Unit Test', 'Mid Term', 'Final', 'Quiz', 'Assignment'],
    required: [true, 'Exam type is required']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  date: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    default: 100
  },
  passingMarks: {
    type: Number,
    default: 35
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
