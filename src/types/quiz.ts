export type Difficulty = 'any' | 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  category: string;
  difficulty: string;
  isCustom?: boolean;
}

export interface QuizCategory {
  id: number | null;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export interface UserAnswerReview {
  question: Question;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResult {
  id: string;
  categoryName: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  totalTimeSeconds: number;
  completedAt: string;
  reviews: UserAnswerReview[];
}

export interface UserProfile {
  username: string;
  avatar: string;
  quizzesAttempted: number;
  totalCorrectAnswers: number;
  highestScore: number;
  currentStreak: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  category: string;
  difficulty: string;
  accuracy: number;
  date: string;
}
