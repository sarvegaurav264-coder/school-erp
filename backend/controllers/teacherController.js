const Teacher = require('../models/Teacher');
const { asyncHandler, getPagination, paginateResponse, buildSearchFilter } = require('../utils/helpers');

exports.getTeachers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const searchFilter = buildSearchFilter(req.query, ['firstName', 'lastName', 'teacherId', 'email']);
  const filter = { isActive: true, ...searchFilter };
  if (req.query.gender) filter.gender = req.query.gender;

  const [teachers, total] = await Promise.all([
    Teacher.find(filter).populate('classTeacher', 'name section').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Teacher.countDocuments(filter)
  ]);

  res.json({ success: true, ...paginateResponse(teachers, total, page, limit) });
});

exports.getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('classTeacher', 'name section').populate('subjects', 'name code');
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  res.json({ success: true, data: teacher });
});

exports.createTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.status(201).json({ success: true, message: 'Teacher added successfully', data: teacher });
});

exports.updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  }).populate('classTeacher', 'name section');
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  res.json({ success: true, message: 'Teacher updated', data: teacher });
});

exports.deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  res.json({ success: true, message: 'Teacher removed' });
});
