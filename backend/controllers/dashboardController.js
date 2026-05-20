const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');
const Exam = require('../models/Exam');
const { asyncHandler } = require('../utils/helpers');

exports.getStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    recentNotices,
    feeStats,
    genderStats,
    attendanceToday,
    upcomingExams
  ] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Teacher.countDocuments({ isActive: true }),
    Class.countDocuments({ isActive: true }),
    Notice.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).populate('postedBy', 'name'),
    Fee.aggregate([
      { $group: { _id: null, totalFees: { $sum: '$totalAmount' }, collected: { $sum: '$paidAmount' } } }
    ]),
    Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]),
    (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return Attendance.aggregate([
        { $match: { date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
    })(),
    Exam.find({ status: 'scheduled', date: { $gte: new Date() } })
      .populate('class', 'name section')
      .populate('subject', 'name')
      .sort({ date: 1 })
      .limit(5)
  ]);

  // Format fee stats
  const fees = feeStats[0] || { totalFees: 0, collected: 0 };

  // Format gender stats
  const gender = { Male: 0, Female: 0, Other: 0 };
  genderStats.forEach(g => { gender[g._id] = g.count; });

  // Format attendance
  const attendance = { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
  attendanceToday.forEach(a => { attendance[a._id] = a.count; attendance.total += a.count; });

  // Monthly enrollment data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyEnrollment = await Student.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalFees: fees.totalFees,
      collectedFees: fees.collected,
      pendingFees: fees.totalFees - fees.collected,
      genderDistribution: gender,
      attendanceToday: attendance,
      recentNotices,
      upcomingExams,
      monthlyEnrollment
    }
  });
});
