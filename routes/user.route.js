import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateBookmarks, 
  getBookmarks, 
  updateProgress, 
  getProgress 
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerUser);

/**
 * @route POST /api/users/login
 * @desc Login user & get token
 * @access Public
 */
router.post('/login', loginUser);

/**
 * @route GET /api/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', protect, getUserProfile);

/**
 * @route POST /api/users/bookmarks
 * @desc Toggle bookmark for flashcard
 * @access Private
 */
router.post('/bookmarks', protect, updateBookmarks);

/**
 * @route GET /api/users/bookmarks
 * @desc Get user bookmarks
 * @access Private
 */
router.get('/bookmarks', protect, getBookmarks);

/**
 * @route POST /api/users/progress
 * @desc Update user progress (known/unknown cards)
 * @access Private
 */
router.post('/progress', protect, updateProgress);

/**
 * @route GET /api/users/progress
 * @desc Get user progress
 * @access Private
 */
router.get('/progress', protect, getProgress);

export default router;