const router = require('express').Router();
const { markAttendance, getAttendance, getAttendanceStats } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/mark', authorize('admin', 'teacher'), markAttendance);
router.get('/', getAttendance);
router.get('/stats', getAttendanceStats);

module.exports = router;
