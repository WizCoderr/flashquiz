import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/flashcard';

export const getAllFlashcards = () => axios.get(`${BASE_URL}/getAll`);
export const getFlashcardById = (id) => axios.get(`${BASE_URL}/flashCard/${id}`);
export const createFlashcard = (flashcard) => axios.post(`${BASE_URL}/create`, flashcard);
export const updateFlashcard = (id, flashcard) => axios.put(`${BASE_URL}/update/${id}`, flashcard);
export const deleteFlashcard = (id) => axios.delete(`${BASE_URL}/delete/${id}`);