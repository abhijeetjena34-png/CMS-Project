const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  updateStatus,
} = require('../controllers/contentController');

// All routes here are protected (admin only)
router.use(protect);

router.route('/').get(getAllContent).post(createContent);

router.route('/:id').get(getContentById).put(updateContent).delete(deleteContent);

router.patch('/:id/status', updateStatus);

module.exports = router;

