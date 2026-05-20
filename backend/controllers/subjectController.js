const Subject = require('../models/Subject');
const { asyncHandler } = require('../utils/helpers');

exports.getSubjects = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.class) filter.class = req.query.class;
  if (req.query.type) filter.type = req.query.type;

  const subjects = await Subject.find(filter)
    .populate('class', 'name section')
    .populate('teacher', 'firstName lastName')
    .sort({ name: 1 });

  res.json({ success: true, data: subjects });
});

exports.getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate('class', 'name section').populate('teacher', 'firstName lastName');
  if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
  res.json({ success: true, data: subject });
});

exports.createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, message: 'Subject created', data: subject });
});

exports.updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
  res.json({ success: true, message: 'Subject updated', data: subject });
});

exports.deleteSubject = asyncHandler(async (req, res) => {
  await Subject.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Subject deleted' });
});
