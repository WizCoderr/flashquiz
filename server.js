import express from 'express';
import db from './config/db.js';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import flashcardRoutes from './routes/flashcardRoutes.js';

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
db(); 
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/flashcards', flashcardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});