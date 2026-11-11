const Content = require('../models/Content');
const mongoose = require('mongoose');

// Helper: validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── ADMIN ROUTES ──────────────────────────────────────────────────

// @desc    Create new content
// @route   POST /api/admin/content
// @access  Private
const createContent = async (req, res, next) => {
  try {
    const { title, description, category, image, content, status } = req.body;

    // Basic validation
    if (!title || !description || !category || !image || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, image and content are required',
      });
    }

    const newContent = await Content.create({
      title,
      description,
      category,
      image,
      content,
      status: status || 'Draft',
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: newContent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all content (admin — all statuses)
// @route   GET /api/admin/content
// @access  Private
const getAllContent = async (req, res, next) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single content by ID (admin)
// @route   GET /api/admin/content/:id
// @access  Private
const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Update content
// @route   PUT /api/admin/content/:id
// @access  Private
const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const { title, description, category, image, content: body, status } = req.body;

    // Update fields
    if (title !== undefined) content.title = title;
    if (description !== undefined) content.description = description;
    if (category !== undefined) content.category = category;
    if (image !== undefined) content.image = image;
    if (body !== undefined) content.content = body;
    if (status !== undefined) content.status = status;

    const updated = await content.save();

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete content
// @route   DELETE /api/admin/content/:id
// @access  Private
const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update content status only (Draft / Published)
// @route   PATCH /api/admin/content/:id/status
// @access  Private
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    if (!['Draft', 'Published'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Draft or Published',
      });
    }

    const content = await Content.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────

// @desc    Get all PUBLISHED content (public)
// @route   GET /api/content
// @access  Public
const getPublishedContent = async (req, res, next) => {
  try {
    const content = await Content.find({ status: 'Published' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single PUBLISHED content by ID or slug (public)
// @route   GET /api/content/:idOrSlug
// @access  Public
const getPublishedContentByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let content;

    if (isValidId(idOrSlug)) {
      content = await Content.findOne({ _id: idOrSlug, status: 'Published' });
    } else {
      content = await Content.findOne({ slug: idOrSlug, status: 'Published' });
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found or not published',
      });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  updateStatus,
  getPublishedContent,
  getPublishedContentByIdOrSlug,
};

