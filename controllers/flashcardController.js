import Flashcard from '../models/Flashcard.js';

/**
 * Add a new flashcard
 * @route POST /api/flashcards
 * @access Private
 */
export async function addFlashcard(req, res) {
  try {
    const { question, answer, topic, difficulty, category, tags, hint, explanation, imageUrl, isPublic } = req.body;

    if (!question || !answer || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: question, answer, and topic are required',
      });
    }

    const newFlashcard = new Flashcard({
      question,
      answer,
      topic,
      difficulty,
      category,
      tags,
      hint,
      explanation,
      imageUrl,
      isPublic,
      createdBy: req.user.id
    });
    
    const savedFlashcard = await newFlashcard.save();

    res.status(201).json({ success: true, data: savedFlashcard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get all flashcards
 * @route GET /api/flashcards
 * @access Public
 */
export async function getAllFlashcards(req, res) {
  try {
    const { limit = 50, page = 1, sort = '-createdAt', difficulty, topic } = req.query;
    
    // Build filter
    const filter = { isPublic: true };
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;
    
    // Count documents for pagination
    const total = await Flashcard.countDocuments(filter);
    
    // Execute query with pagination and sorting
    const flashcards = await Flashcard.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('createdBy', 'username');

    res.status(200).json({ 
      success: true, 
      data: flashcards,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get flashcard by ID
 * @route GET /api/flashcards/:id
 * @access Public
 */
export async function getFlashcardById(req, res) {
  try {
    const { id } = req.params;
    
    // Increment view count
    await Flashcard.incrementViewCount(id);
    
    const flashcard = await Flashcard.findById(id)
      .populate('createdBy', 'username');

    if (!flashcard) {
      return res.status(404).json({ success: false, message: 'Flashcard not found' });
    }

    res.status(200).json({ success: true, data: flashcard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Update a flashcard
 * @route PUT /api/flashcards/:id
 * @access Private
 */
export async function updateFlashcard(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find flashcard
    const flashcard = await Flashcard.findById(id);
    
    if (!flashcard) {
      return res.status(404).json({ success: false, message: 'Flashcard not found' });
    }
    
    // Check ownership
    if (flashcard.createdBy && flashcard.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this flashcard' 
      });
    }

    const updated = await Flashcard.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Delete a flashcard
 * @route DELETE /api/flashcards/:id
 * @access Private
 */
export async function deleteFlashcard(req, res) {
  try {
    const { id } = req.params;
    
    // Find flashcard
    const flashcard = await Flashcard.findById(id);
    
    if (!flashcard) {
      return res.status(404).json({ success: false, message: 'Flashcard not found' });
    }
    
    // Check ownership
    if (flashcard.createdBy && flashcard.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this flashcard' 
      });
    }
    
    await flashcard.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: 'Flashcard deleted successfully',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get flashcards by topic
 * @route GET /api/flashcards/topic/:topic
 * @access Public
 */
export async function getFlashcardsByTopic(req, res) {
  try {
    const { topic } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    const total = await Flashcard.countDocuments({ topic, isPublic: true });
    
    const flashcards = await Flashcard.find({ topic, isPublic: true })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('createdBy', 'username');

    res.status(200).json({ 
      success: true, 
      data: flashcards,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get flashcards by category
 * @route GET /api/flashcards/category/:category
 * @access Public
 */
export async function getFlashcardsByCategory(req, res) {
  try {
    const { category } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    const total = await Flashcard.countDocuments({ category, isPublic: true });
    
    const flashcards = await Flashcard.find({ category, isPublic: true })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('createdBy', 'username');

    res.status(200).json({ 
      success: true, 
      data: flashcards,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Search flashcards
 * @route GET /api/flashcards/search
 * @access Public
 */
export async function searchFlashcards(req, res) {
  try {
    const { keyword, limit = 50, page = 1 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Search keyword is required',
      });
    }

    const searchQuery = {
      $or: [
        { question: { $regex: keyword, $options: 'i' } },
        { answer: { $regex: keyword, $options: 'i' } },
        { topic: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [keyword.toLowerCase()] } }
      ],
      isPublic: true
    };
    
    const total = await Flashcard.countDocuments(searchQuery);
    
    const flashcards = await Flashcard.find(searchQuery)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('createdBy', 'username');

    res.status(200).json({ 
      success: true, 
      data: flashcards,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get random flashcard
 * @route GET /api/flashcards/random
 * @access Public
 */
export async function getRandomFlashcard(req, res) {
  try {
    const { topic, difficulty } = req.query;
    
    // Build filter
    const filter = { isPublic: true };
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    
    const count = await Flashcard.countDocuments(filter);
    
    if (count === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No flashcards found with the specified criteria' 
      });
    }
    
    const random = Math.floor(Math.random() * count);
    const flashcard = await Flashcard.findOne(filter)
      .skip(random)
      .populate('createdBy', 'username');
    
    // Increment view count
    await Flashcard.incrementViewCount(flashcard._id);
    
    res.status(200).json({ success: true, data: flashcard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Record flashcard attempt
 * @route POST /api/flashcards/:id/attempt
 * @access Private
 */
export async function recordAttempt(req, res) {
  try {
    const { id } = req.params;
    const { isCorrect } = req.body;
    
    if (isCorrect === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isCorrect field is required',
      });
    }
    
    await Flashcard.recordAttempt(id, isCorrect);
    
    res.status(200).json({ 
      success: true, 
      message: `Attempt recorded as ${isCorrect ? 'correct' : 'incorrect'}` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get user's flashcards
 * @route GET /api/flashcards/user
 * @access Private
 */
export async function getUserFlashcards(req, res) {
  try {
    const { limit = 50, page = 1, sort = '-createdAt' } = req.query;
    
    const total = await Flashcard.countDocuments({ createdBy: req.user.id });
    
    const flashcards = await Flashcard.find({ createdBy: req.user.id })
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({ 
      success: true, 
      data: flashcards,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}