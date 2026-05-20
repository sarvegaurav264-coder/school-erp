const router = require('express').Router();
const { getExams, getExam, createExam, updateExam, deleteExam, addResults, getResults } = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getExams).post(authorize('admin', 'teacher'), createExam);
router.route('/:id').get(getExam).put(authorize('admin', 'teacher'), updateExam).delete(authorize('admin'), deleteExam);
router.route('/:id/results').get(getResults).post(authorize('admin', 'teacher'), addResults);

module.exports = router;
