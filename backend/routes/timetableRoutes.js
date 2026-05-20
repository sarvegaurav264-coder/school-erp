const router = require('express').Router();
const { getTimetable, createOrUpdateTimetable, deleteTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getTimetable);
router.post('/', authorize('admin'), createOrUpdateTimetable);
router.delete('/:id', authorize('admin'), deleteTimetable);

module.exports = router;
