const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    trim: true
  },
  rollNumber: {
    type: String,
    trim: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  parentInfo: {
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    guardianEmail: { type: String, trim: true }
  },
  avatar: {
    type: String,
    default: ''
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

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Auto-generate student ID
studentSchema.pre('validate', async function(next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Text search index
studentSchema.index({ firstName: 'text', lastName: 'text', studentId: 'text' });

module.exports = mongoose.model('Student', studentSchema);
