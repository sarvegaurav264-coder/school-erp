const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { asyncHandler } = require('../utils/helpers');

// @desc    Mark attendance (bulk)
exports.markAttendance = asyncHandler(async (req, res) => {
  const { classId, date, records } = req.body;

  if (!records || !records.length) {
    return res.status(400).json({ success: false, message: 'No attendance records provided' });
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  // Upsert each record
  const operations = records.map(record => ({
    updateOne: {
      filter: { student: record.student, date: attendanceDate },
      update: {
        $set: {
          student: record.student,
          class: classId,
          date: attendanceDate,
          status: record.status,
          remarks: record.remarks || '',
          markedBy: req.user._id
        }
      },
      upsert: true
    }
  }));

  await Attendance.bulkWrite(operations);

  res.json({
    success: true,
    message: `Attendance marked for ${records.length} students`,
    data: { count: records.length, date: attendanceDate }
  });
});

// @desc    Get attendance for a class/date
exports.getAttendance = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.class) filter.class = req.query.class;
  if (req.query.student) filter.student = req.query.student;
  if (req.query.date) {
    const date = new Date(req.query.date);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.date = { $gte: date, $lt: nextDay };
  }

  const attendance = await Attendance.find(filter)
    .populate('student', 'firstName lastName studentId rollNumber')
    .populate('class', 'name section')
    .sort({ date: -1 });

  res.json({ success: true, data: attendance });
});

// @desc    Get attendance stats
exports.getAttendanceStats = asyncHandler(async (req, res) => {
  const { classId, month, year } = req.query;
  const filter = {};
  if (classId) filter.class = classId;

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    filter.date = { $gte: startDate, $lte: endDate };
  }

  const stats = await Attendance.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
  stats.forEach(s => {
    result[s._id] = s.count;
    result.total += s.count;
  });

  res.json({ success: true, data: result });
});
