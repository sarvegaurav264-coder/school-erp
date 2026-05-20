const router = require('express').Router();
const { getNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getNotices).post(authorize('admin', 'teacher'), createNotice);
router.route('/:id').put(authorize('admin', 'teacher'), updateNotice).delete(authorize('admin'), deleteNotice);

module.exports = router;
