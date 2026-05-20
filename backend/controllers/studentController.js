const Student = require('../models/Student');
const { asyncHandler, getPagination, paginateResponse, buildSearchFilter } = require('../utils/helpers');

// @desc    Get all students
// @route   GET /api/students
exports.getStudents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const searchFilter = buildSearchFilter(req.query, ['firstName', 'lastName', 'studentId', 'email']);
  const filter = { isActive: true, ...searchFilter };

  if (req.query.class) filter.class = req.query.class;
  if (req.query.gender) filter.gender = req.query.gender;

  const [students, total] = await Promise.all([
    Student.find(filter).populate('class', 'name section').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter)
  ]);

  res.json({ success: true, ...paginateResponse(students, total, page, limit) });
});

// @desc    Get single student
// @route   GET /api/students/:id
exports.getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('class', 'name section');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
});

// @desc    Create student
// @route   POST /api/students
exports.createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  const populated = await student.populate('class', 'name section');
  res.status(201).json({ success: true, message: 'Student added successfully', data: populated });
});

// @desc    Update student
// @route   PUT /api/students/:id
exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  }).populate('class', 'name section');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, message: 'Student updated', data: student });
});

// @desc    Delete student (soft)
// @route   DELETE /api/students/:id
exports.deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, message: 'Student removed' });
});
