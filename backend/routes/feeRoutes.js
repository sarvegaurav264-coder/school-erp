const router = require('express').Router();
const { getFees, createFee, updateFee, payFee, deleteFee, getFeeStats } = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getFees).post(authorize('admin'), createFee);
router.get('/stats', authorize('admin'), getFeeStats);
router.route('/:id').put(authorize('admin'), updateFee).delete(authorize('admin'), deleteFee);
router.post('/:id/pay', authorize('admin'), payFee);

module.exports = router;
