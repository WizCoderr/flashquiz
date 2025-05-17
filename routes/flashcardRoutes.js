import { Router } from 'express';
import { 
  getAllFlashcards, 
  getFlashcardById, 
  addFlashcard, 
  updateFlashcard, 
  deleteFlashcard,
  getFlashcardsByCategory,
  searchFlashcards,
  getRandomFlashcard
} from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * @route GET /api/flashcards/search
 * @desc Search flashcards by keyword
 * @access Public
 */
router.get('/search', searchFlashcards);

/**
 * @route GET /api/flashcards/random
 * @desc Get a random flashcard
 * @access Public
 */
router.get('/random', getRandomFlashcard);

/**
 * @route GET /api/flashcards/category/:category
 * @desc Get flashcards by category
 * @access Public
 */
router.get('/category/:category', getFlashcardsByCategory);

/**
 * @route GET /api/flashcards
 * @desc Get all flashcards
 * @access Public
 */
router.get('/', getAllFlashcards);

/**
 * @route GET /api/flashcards/:id
 * @desc Get flashcard by ID
 * @access Public
 */
router.get('/:id', getFlashcardById);

/**
 * @route POST /api/flashcards
 * @desc Create a new flashcard
 * @access Private
 */
router.post('/', protect, addFlashcard);

/**
 * @route PUT /api/flashcards/:id
 * @desc Update an existing flashcard
 * @access Private
 */
router.put('/:id', protect, updateFlashcard);

/**
 * @route DELETE /api/flashcards/:id
 * @desc Delete a flashcard
 * @access Private
 */
router.delete('/:id', protect, deleteFlashcard);

export default router;