const router = require('express').Router();
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getStudents).post(authorize('admin', 'teacher'), createStudent);
router.route('/:id').get(getStudent).put(authorize('admin', 'teacher'), updateStudent).delete(authorize('admin'), deleteStudent);

module.exports = router;
