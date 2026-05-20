const Fee = require('../models/Fee');
const { asyncHandler, getPagination, paginateResponse } = require('../utils/helpers');

exports.getFees = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.student) filter.student = req.query.student;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.feeType) filter.feeType = req.query.feeType;
  if (req.query.month) filter.month = req.query.month;

  const [fees, total] = await Promise.all([
    Fee.find(filter).populate('student', 'firstName lastName studentId class')
      .sort({ createdAt: -1 }).skip(skip).limit(limit),
    Fee.countDocuments(filter)
  ]);

  res.json({ success: true, ...paginateResponse(fees, total, page, limit) });
});

exports.createFee = asyncHandler(async (req, res) => {
  const fee = await Fee.create(req.body);
  res.status(201).json({ success: true, message: 'Fee record created', data: fee });
});

exports.updateFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });
  res.json({ success: true, message: 'Fee updated', data: fee });
});

// @desc    Pay fee
exports.payFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);
  if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });

  const { amount, paymentMethod, transactionId } = req.body;
  fee.paidAmount += amount;
  fee.paymentMethod = paymentMethod || fee.paymentMethod;
  fee.transactionId = transactionId || fee.transactionId;
  fee.paidDate = new Date();

  if (fee.paidAmount >= fee.totalAmount) {
    fee.status = 'paid';
  } else {
    fee.status = 'partial';
  }

  await fee.save();
  res.json({ success: true, message: 'Payment recorded', data: fee });
});

exports.deleteFee = asyncHandler(async (req, res) => {
  await Fee.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Fee deleted' });
});

// @desc    Get fee stats
exports.getFeeStats = asyncHandler(async (req, res) => {
  const stats = await Fee.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        paidAmount: { $sum: '$paidAmount' }
      }
    }
  ]);

  const totalCollection = await Fee.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' }, collected: { $sum: '$paidAmount' } } }
  ]);

  res.json({
    success: true,
    data: {
      byStatus: stats,
      summary: totalCollection[0] || { total: 0, collected: 0 }
    }
  });
});
