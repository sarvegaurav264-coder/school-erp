const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  feeType: {
    type: String,
    enum: ['Tuition', 'Transport', 'Library', 'Laboratory', 'Sports', 'Exam', 'Admission', 'Other'],
    required: [true, 'Fee type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  fine: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paidDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'partial', 'overdue'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank', 'upi', 'online', ''],
    default: ''
  },
  transactionId: {
    type: String,
    trim: true
  },
  month: {
    type: String,
    required: [true, 'Month is required']
  },
  academicYear: {
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${now.getFullYear() + 1}`;
    }
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Auto-calculate total
feeSchema.pre('save', function(next) {
  this.totalAmount = this.amount - this.discount + this.fine;
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'paid';
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else if (new Date() > this.dueDate && this.status !== 'paid') {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
