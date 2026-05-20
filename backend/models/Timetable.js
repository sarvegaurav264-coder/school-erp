const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  periodNumber: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

const timetableSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: [true, 'Day is required']
  },
  periods: [periodSchema],
  academicYear: {
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${now.getFullYear() + 1}`;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

timetableSchema.index({ class: 1, day: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
