import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const FlashcardViewer = ({ flashcards }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return <Typography>No flashcards available.</Typography>;
  }

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  const current = flashcards[index];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <motion.div
        onClick={handleFlip}
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            width: 300,
            height: 200,
            cursor: 'pointer',
            borderRadius: 12,
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: 20,
            fontWeight: 500,
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            {current.question}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {current.answer}
          </Box>
        </motion.div>
      </motion.div>

      <Box display="flex" gap={2}>
        <Button variant="outlined" color="error" onClick={handleNext}>
          Don’t Know
        </Button>
        <Button variant="outlined" color="success" onClick={handleNext}>
          Know
        </Button>
      </Box>
    </Box>
  );
};

export default FlashcardViewer;