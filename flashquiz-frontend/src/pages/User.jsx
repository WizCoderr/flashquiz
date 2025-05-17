import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Modal,
  IconButton,
  Tooltip,
  Switch,
  TextField
} from '@mui/material';
import { Bookmark, BookmarkBorder, LightMode, DarkMode } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const categories = ['Math', 'Science', 'History', 'Art', 'Bookmarks'];
const sampleFlashcards = {
  Math: [
    { id: 1, question: 'What is 2 + 2?', answer: '4' },
    { id: 2, question: 'What is the square root of 16?', answer: '4' },
  ],
  Science: [
    { id: 3, question: 'What planet is known as the Red Planet?', answer: 'Mars' },
    { id: 4, question: 'What gas do plants breathe in?', answer: 'Carbon Dioxide' },
  ],
  History: [
    { id: 5, question: 'Who discovered America?', answer: 'Christopher Columbus' },
  ],
  Art: [
    { id: 6, question: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci' },
  ],
};

export default function FlashQuizUI() {
  const [category, setCategory] = useState('Math');
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [openSummary, setOpenSummary] = useState(false);
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);

  const allCards = category === 'Bookmarks'
    ? Object.values(sampleFlashcards).flat().filter(c => bookmarks.includes(c.id))
    : sampleFlashcards[category] || [];

  const filteredCards = allCards.filter(card =>
    card.question.toLowerCase().includes(search.toLowerCase()) ||
    card.answer.toLowerCase().includes(search.toLowerCase())
  );

  const currentCard = filteredCards[index];

  const handleKnow = () => {
    setKnown(prev => [...prev, currentCard.id]);
    setStreak(streak + 1);
    nextCard();
  };

  const handleDontKnow = () => {
    setUnknown(prev => [...prev, currentCard.id]);
    setStreak(0);
    nextCard();
  };

  const nextCard = () => {
    if (index + 1 < filteredCards.length) {
      setIndex(index + 1);
      setShowAnswer(false);
      setStartTime(Date.now());
    } else {
      setOpenSummary(true);
    }
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'k') handleKnow();
    if (e.key === 'd') handleDontKnow();
    if (e.key === 'b') toggleBookmark(currentCard.id);
    if (e.key === 'ArrowRight') {
      const currentIndex = categories.indexOf(category);
      setCategory(categories[(currentIndex + 1) % categories.length]);
    }
    if (e.key === 'ArrowLeft') {
      const currentIndex = categories.indexOf(category);
      setCategory(categories[(currentIndex - 1 + categories.length) % categories.length]);
    }
  }, [category, currentCard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
    setSearch('');
  }, [category]);

  const resetQuiz = () => {
    setKnown([]);
    setUnknown([]);
    setIndex(0);
    setShowAnswer(false);
    setOpenSummary(false);
    setStartTime(Date.now());
    setStreak(0);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: theme === 'light' ? '#fff' : '#121212', color: theme === 'light' ? '#000' : '#fff', height: '100vh' }}>
      {/* Right-side Navbar */}
      <Drawer variant="permanent" anchor="right" sx={{ width: 200, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {categories.map((cat) => (
              <ListItem button key={cat} selected={cat === category} onClick={() => setCategory(cat)}>
                <ListItemText primary={cat} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>FlashQuiz</Typography>
            <TextField size="small" variant="outlined" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <Tooltip title="Toggle Theme">
              <IconButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <LinearProgress variant="determinate" value={((index) / filteredCards.length) * 100} sx={{ my: 2 }} />

        {currentCard && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              sx={{
                perspective: 1000,
                width: 300,
                height: 200,
              }}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '20px',
                    padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">{currentCard.question}</Typography>
                  <IconButton
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(currentCard.id);
                    }}
                  >
                    {bookmarks.includes(currentCard.id) ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '20px',
                    padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">{currentCard.answer}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="success" onClick={handleKnow}>Know (K)</Button>
          <Button variant="contained" color="error" onClick={handleDontKnow}>Don’t Know (D)</Button>
        </Box>

        <Typography variant="body2" align="center" mt={2}>Streak: 🔥 {streak}</Typography>

        <Modal open={openSummary} onClose={() => setOpenSummary(false)}>
          <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 3, width: 400, mx: 'auto', mt: '20vh', textAlign: 'center' }}>
            <Typography variant="h6">Quiz Summary</Typography>
            <Typography>Known: {known.length}</Typography>
            <Typography>Don’t Know: {unknown.length}</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{ name: category, known: known.length, unknown: unknown.length }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="known" fill="#4caf50" />
                <Bar dataKey="unknown" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
            <Button variant="outlined" onClick={resetQuiz}>Retry</Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}