import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      index: true // Added index for better search performance
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true // Added index for better filtering
    },
    category: {
      type: String,
      required: false,
      trim: true,
      index: true // Added index for better filtering
    },
    tags: [{
      type: String,
      trim: true
    }],
    imageUrl: {
      type: String,
      trim: true,
      default: null
    },
    hint: {
      type: String,
      trim: true,
      default: null
    },
    explanation: {
      type: String,
      trim: true,
      default: null
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    viewCount: {
      type: Number,
      default: 0
    },
    correctCount: {
      type: Number,
      default: 0
    },
    incorrectCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for success rate percentage
flashcardSchema.virtual('successRate').get(function() {
  const total = this.correctCount + this.incorrectCount;
  if (total === 0) return 0;
  return Math.round((this.correctCount / total) * 100);
});

// Index for text search on question and answer
flashcardSchema.index({ question: 'text', answer: 'text', topic: 'text', tags: 'text' });

// Static method to increment view count
flashcardSchema.statics.incrementViewCount = async function(id) {
  return this.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
};

// Static method to record attempt
flashcardSchema.statics.recordAttempt = async function(id, isCorrect) {
  const updateField = isCorrect ? 'correctCount' : 'incorrectCount';
  return this.findByIdAndUpdate(id, { $inc: { [updateField]: 1 } });
};

// Pre-save middleware to enforce lowercase tags
flashcardSchema.pre('save', function(next) {
  if (this.tags && this.tags.length) {
    this.tags = this.tags.map(tag => tag.toLowerCase());
    // Remove duplicates
    this.tags = [...new Set(this.tags)];
  }
  next();
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;
