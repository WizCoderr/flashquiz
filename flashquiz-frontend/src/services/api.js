import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/flashcards';

export const getAllFlashcards = () => axios.get(BASE_URL);
export const getFlashcardById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createFlashcard = (flashcard) => axios.post(BASE_URL, flashcard);