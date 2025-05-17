import { Router } from 'express';
import { getAllFlashcards, getFlashcardById, addFlashcard, updateFlashcard, deleteFlashcard } from '../controllers/flashcardController';

const router = Router();

router.get('/getAll', getAllFlashcards);
router.get('/flashCard/:id', getFlashcardById);
router.post('/create', addFlashcard);
router.put('/update/:id', updateFlashcard);
router.delete('/delete/:id', deleteFlashcard);

export default router;