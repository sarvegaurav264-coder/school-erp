const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    uppercase: true,
    trim: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  type: {
    type: String,
    enum: ['Core', 'Elective', 'Lab', 'Extra'],
    default: 'Core'
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  passingMarks: {
    type: Number,
    default: 35
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

subjectSchema.index({ code: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
