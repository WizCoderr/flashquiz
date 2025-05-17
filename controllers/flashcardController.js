import Flashcard from '../models/Flashcard.js';


export async function addFlashcard(req, res) {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (question, answer, category)',
      });
    }

    const newFlashcard = new Flashcard({ question, answer, category });
    const savedFlashcard = await newFlashcard.save();

    res.status(201).json({ success: true, data: savedFlashcard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAllFlashcards(req, res) {
  try {
    const flashcards = await Flashcard.find();
    res.status(200).json({ success: true, data: flashcards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getFlashcardById(req, res) {
  try {
    const { id } = req.params;
    const flashcard = await Flashcard.findById(id);

    if (!flashcard) {
      return res.status(404).json({ success: false, message: 'Flashcard not found' });
    }

    res.status(200).json({ success: true, data: flashcard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export async function updateFlashcard(req, res) {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;

    const updated = await Flashcard.findByIdAndUpdate(
      id,
      { question, answer, category },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Flashcard not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteFlashcard(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Flashcard.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Flashcard not found' });
    }

    res.status(200).json({ success: true, message: 'Flashcard deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getFlashcardsByCategory(req, res) {
  try {
    const { category } = req.params;
    const flashcards = await Flashcard.find({ category });

    res.status(200).json({ success: true, data: flashcards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
