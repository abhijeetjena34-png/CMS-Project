const express = require('express');
const router = express.Router();
const {
  getPublishedContent,
  getPublishedContentByIdOrSlug,
} = require('../controllers/contentController');

// GET /api/content            — all published
// GET /api/content/:idOrSlug  — single published item
router.get('/', getPublishedContent);
router.get('/:idOrSlug', getPublishedContentByIdOrSlug);

module.exports = router;

