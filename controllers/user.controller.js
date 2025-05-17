 import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Register new user
 * @route POST /api/users/register
 * @access Public
 */
export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate request
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bookmarks: user.bookmarks,
        known: user.known,
        unknown: user.unknown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Update user bookmarks
 * @route POST /api/users/bookmarks
 * @access Private
 */
export async function updateBookmarks(req, res) {
  try {
    const { cardId } = req.body;
    const userId = req.user.id;

    if (!cardId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide flashcard ID'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Toggle bookmark
    const cardIndex = user.bookmarks.indexOf(cardId);
    if (cardIndex === -1) {
      // Add to bookmarks
      user.bookmarks.push(cardId);
    } else {
      // Remove from bookmarks
      user.bookmarks.splice(cardIndex, 1);
    }

    await user.save();

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Get user bookmarks
 * @route GET /api/users/bookmarks
 * @access Private
 */
export async function getBookmarks(req, res) {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Update user progress
 * @route POST /api/users/progress
 * @access Private
 */
export async function updateProgress(req, res) {
  try {
    const { cardId, isKnown } = req.body;
    const userId = req.user.id;

    if (!cardId || isKnown === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide flashcard ID and isKnown status'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove from both known and unknown arrays first
    user.known = user.known.filter(id => id.toString() !== cardId);
    user.unknown = user.unknown.filter(id => id.toString() !== cardId);

    // Add to appropriate array based on isKnown flag
    if (isKnown) {
      user.known.push(cardId);
    } else {
      user.unknown.push(cardId);
    }

    await user.save();

    res.json({
      success: true,
      data: {
        known: user.known,
        unknown: user.unknown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Get user progress
 * @route GET /api/users/progress
 * @access Private
 */
export async function getProgress(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        known: user.known,
        unknown: user.unknown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Generate JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}