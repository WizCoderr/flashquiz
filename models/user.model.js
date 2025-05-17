import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password in queries by default
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  known: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  unknown: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);