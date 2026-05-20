const router = require('express').Router();
const { getClasses, getClass, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getClasses).post(authorize('admin'), createClass);
router.route('/:id').get(getClass).put(authorize('admin'), updateClass).delete(authorize('admin'), deleteClass);

module.exports = router;
