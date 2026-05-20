const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam is required']
  },
  marksObtained: {
    type: Number,
    required: [true, 'Marks obtained is required'],
    min: [0, 'Marks cannot be negative']
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String
  },
  remarks: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    default: 'pass'
  }
}, {
  timestamps: true
});

// Auto-calculate percentage and grade
resultSchema.pre('save', function(next) {
  if (this.totalMarks > 0) {
    this.percentage = Math.round((this.marksObtained / this.totalMarks) * 100 * 100) / 100;
  }
  // Grade calculation
  const pct = this.percentage || 0;
  if (pct >= 90) this.grade = 'A+';
  else if (pct >= 80) this.grade = 'A';
  else if (pct >= 70) this.grade = 'B+';
  else if (pct >= 60) this.grade = 'B';
  else if (pct >= 50) this.grade = 'C';
  else if (pct >= 35) this.grade = 'D';
  else this.grade = 'F';

  this.status = pct >= 35 ? 'pass' : 'fail';
  next();
});

// Unique: one result per student per exam
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
