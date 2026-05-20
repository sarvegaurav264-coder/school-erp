const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    uppercase: true
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  capacity: {
    type: Number,
    default: 40
  },
  academicYear: {
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${now.getFullYear() + 1}`;
    }
  },
  room: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for display name
classSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.section}`;
});

// Virtual for student count
classSchema.virtual('studentCount', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'class',
  count: true
});

// Unique combo of name + section + academic year
classSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
