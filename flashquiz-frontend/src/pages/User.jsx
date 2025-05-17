import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress } from '@mui/material';
import FlashcardViewer from '../components/FlashcardViewer';
import ScoreTracker from '../components/ScoreTracker';
import CategorySelector from '../components/CategorySelector';
import { getAllFlashcards } from '../services/api';

const UserPanel = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await getAllFlashcards();
      setFlashcards(response.data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">FlashQuiz</Typography>

      <CategorySelector />

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <FlashcardViewer flashcards={flashcards} />
      )}

      <ScoreTracker />
    </Container>
  );
};

export default UserPanel;
