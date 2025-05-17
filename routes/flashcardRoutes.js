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

const router = Router();

router.get('/', getAllFlashcards);
router.get('/:id', getFlashcardById);
router.post('/', addFlashcard);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);
router.get('/category/:category', getFlashcardsByCategory);
router.get('/search', searchFlashcards);
router.get('/random', getRandomFlashcard);

export default router;