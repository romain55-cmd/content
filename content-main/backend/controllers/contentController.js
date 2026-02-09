const asyncHandler = require('express-async-handler');
const { Content, User } = require('../models');
const { Op } = require('sequelize'); // Import Op for operators

// @desc    Create new content
// @route   POST /api/content
// @access  Private
const createContent = asyncHandler(async (req, res) => {
  const { title, body, platform, content_type, hashtags, status } = req.body;

  // We get the user ID from the 'protect' middleware
  const userId = req.user.id;

  if (!title || !body || !platform || !content_type || !userId) {
    res.status(400);
    throw new Error('Пожалуйста, предоставьте все обязательные поля (title, body, platform, content_type).');
  }

  const content = await Content.create({
    title,
    body,
    platform,
    content_type,
    hashtags,
    status,
    userId,
  });

  if (content) {
    res.status(201).json(content);
  } else {
    res.status(400);
    throw new Error('Invalid content data');
  }
});

// @desc    Get authenticated user's content
// @route   GET /api/content
// @access  Private
const getUserContent = asyncHandler(async (req, res) => {
  const { search, platform, status } = req.query;
  const whereClause = { userId: req.user.id };

  if (search) {
    whereClause.title = { [Op.iLike]: `%${search}%` };
  }
  if (platform) {
    whereClause.platform = platform;
  }
  if (status) {
    whereClause.status = status;
  }

  const content = await Content.findAll({ 
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });
  res.status(200).json(content);
});

const updateContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await Content.findByPk(id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  // Check if the user is the owner of the content
  if (content.userId.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error('User not authorized to update this content');
  }

  const updatedContent = await content.update(req.body);
  res.status(200).json(updatedContent);
});

const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await Content.findByPk(id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  // Check if the user is the owner of the content
  if (content.userId.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error('User not authorized to delete this content');
  }

  await content.destroy();
  res.status(200).json({ message: 'Content removed' });
});

module.exports = {
  createContent,
  getUserContent,
  updateContent,
  deleteContent,
};
