const Class = require('../models/Class');
const Student = require('../models/Student');
const { asyncHandler } = require('../utils/helpers');

exports.getClasses = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.academicYear) filter.academicYear = req.query.academicYear;

  const classes = await Class.find(filter)
    .populate('classTeacher', 'firstName lastName')
    .populate('studentCount')
    .sort({ name: 1, section: 1 });

  res.json({ success: true, data: classes });
});

exports.getClass = asyncHandler(async (req, res) => {
  const classData = await Class.findById(req.params.id)
    .populate('classTeacher', 'firstName lastName')
    .populate('studentCount');
  if (!classData) return res.status(404).json({ success: false, message: 'Class not found' });
  res.json({ success: true, data: classData });
});

exports.createClass = asyncHandler(async (req, res) => {
  const classData = await Class.create(req.body);
  res.status(201).json({ success: true, message: 'Class created successfully', data: classData });
});

exports.updateClass = asyncHandler(async (req, res) => {
  const classData = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  }).populate('classTeacher', 'firstName lastName');
  if (!classData) return res.status(404).json({ success: false, message: 'Class not found' });
  res.json({ success: true, message: 'Class updated', data: classData });
});

exports.deleteClass = asyncHandler(async (req, res) => {
  const studentCount = await Student.countDocuments({ class: req.params.id, isActive: true });
  if (studentCount > 0) {
    return res.status(400).json({ success: false, message: `Cannot delete class with ${studentCount} active students` });
  }
  await Class.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Class deleted' });
});
