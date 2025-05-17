# FlashQuiz

A modern flashcard application built with React and Material-UI for efficient learning.

## Features

- 📚 Multiple subject categories
- 🔄 Flip cards with smooth animations
- 🔍 Search functionality
- 🌓 Light/Dark theme
- ⌨️ Keyboard shortcuts
- 📊 Progress tracking
- 🔖 Bookmark system
- 📱 Responsive design

## Tech Stack

- Frontend:
  - React
  - Material-UI
  - Framer Motion
  - Recharts
- Backend:
  - Node.js
  - Express
  - MongoDB

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flashquiz.git
cd flashquiz
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd flashquiz-frontend
npm install

# Install backend dependencies
cd ../
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development servers:
```bash
# Start backend server
npm run server

# In a new terminal, start frontend
cd flashquiz-frontend
npm start
```

## Keyboard Shortcuts

- `K` - Mark card as known
- `D` - Mark card as don't know
- `B` - Toggle bookmark
- `→` - Next category
- `←` - Previous category
