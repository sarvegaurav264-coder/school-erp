const Timetable = require('../models/Timetable');
const { asyncHandler } = require('../utils/helpers');

exports.getTimetable = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.class) filter.class = req.query.class;
  if (req.query.day) filter.day = req.query.day;

  const timetable = await Timetable.find(filter)
    .populate('class', 'name section')
    .populate('periods.subject', 'name code')
    .populate('periods.teacher', 'firstName lastName')
    .sort({ day: 1 });

  res.json({ success: true, data: timetable });
});

exports.createOrUpdateTimetable = asyncHandler(async (req, res) => {
  const { classId, day, periods, academicYear } = req.body;

  const timetable = await Timetable.findOneAndUpdate(
    { class: classId, day, academicYear: academicYear || undefined },
    { class: classId, day, periods, academicYear },
    { new: true, upsert: true, runValidators: true }
  ).populate('periods.subject', 'name code').populate('periods.teacher', 'firstName lastName');

  res.json({ success: true, message: 'Timetable saved', data: timetable });
});

exports.deleteTimetable = asyncHandler(async (req, res) => {
  await Timetable.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Timetable deleted' });
});
