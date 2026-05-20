const Exam = require('../models/Exam');
const Result = require('../models/Result');
const { asyncHandler, getPagination, paginateResponse } = require('../utils/helpers');

exports.getExams = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isActive: true };
  if (req.query.class) filter.class = req.query.class;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const [exams, total] = await Promise.all([
    Exam.find(filter).populate('class', 'name section').populate('subject', 'name code')
      .sort({ date: -1 }).skip(skip).limit(limit),
    Exam.countDocuments(filter)
  ]);

  res.json({ success: true, ...paginateResponse(exams, total, page, limit) });
});

exports.getExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate('class', 'name section').populate('subject', 'name code');
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
  res.json({ success: true, data: exam });
});

exports.createExam = asyncHandler(async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json({ success: true, message: 'Exam created', data: exam });
});

exports.updateExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
  res.json({ success: true, message: 'Exam updated', data: exam });
});

exports.deleteExam = asyncHandler(async (req, res) => {
  await Exam.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Exam deleted' });
});

// @desc    Add/Update results (bulk)
exports.addResults = asyncHandler(async (req, res) => {
  const { results } = req.body;
  if (!results || !results.length) {
    return res.status(400).json({ success: false, message: 'No results provided' });
  }

  const operations = results.map(r => ({
    updateOne: {
      filter: { student: r.student, exam: req.params.id },
      update: { $set: { ...r, exam: req.params.id } },
      upsert: true
    }
  }));

  await Result.bulkWrite(operations);

  // Mark exam completed
  await Exam.findByIdAndUpdate(req.params.id, { status: 'completed' });

  res.json({ success: true, message: `Results saved for ${results.length} students` });
});

// @desc    Get results for an exam
exports.getResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ exam: req.params.id })
    .populate('student', 'firstName lastName studentId rollNumber')
    .populate('exam', 'name type totalMarks')
    .sort({ marksObtained: -1 });

  res.json({ success: true, data: results });
});
