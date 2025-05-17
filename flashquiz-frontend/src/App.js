import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, Typography } from '@mui/material';
import UserPanel from './pages/User.jsx';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          FlashQuiz
        </Typography>
        <Routes>
          <Route path="/" element={<UserPanel />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
