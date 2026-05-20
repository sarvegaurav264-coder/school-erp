const Notice = require('../models/Notice');
const { asyncHandler, getPagination, paginateResponse } = require('../utils/helpers');

exports.getNotices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.audience) filter.audience = { $in: [req.query.audience, 'all'] };

  const [notices, total] = await Promise.all([
    Notice.find(filter).populate('postedBy', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notice.countDocuments(filter)
  ]);

  res.json({ success: true, ...paginateResponse(notices, total, page, limit) });
});

exports.createNotice = asyncHandler(async (req, res) => {
  req.body.postedBy = req.user._id;
  const notice = await Notice.create(req.body);
  res.status(201).json({ success: true, message: 'Notice posted', data: notice });
});

exports.updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
  res.json({ success: true, message: 'Notice updated', data: notice });
});

exports.deleteNotice = asyncHandler(async (req, res) => {
  await Notice.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Notice deleted' });
});
