import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Question } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface QuizScreenProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onFinishQuiz: (score: number, correctCount: number, incorrectCount: number, timeSpent: number, reviews: any[]) => void;
  onQuit: () => void;
  isDark: boolean;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  isLoading,
  error,
  onRetry,
  onFinishQuiz,
  onQuit,
  isDark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);

  // 20-second timer per question
  const QUESTION_DURATION = 20;
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [totalQuizTime, setTotalQuizTime] = useState(0);

  const currentQ = questions[currentIndex];

  // Timer Effect
  useEffect(() => {
    if (isLoading || error || !currentQ || isConfirmed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6 && prev > 1) {
          soundEffects.playTick();
        }
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isConfirmed, isLoading, error, currentQ]);

  const handleTimeExpire = () => {
    if (isConfirmed) return;
    setIsConfirmed(true);
    soundEffects.playWrong();
    setIncorrectCount((c) => c + 1);
    setTotalQuizTime((t) => t + QUESTION_DURATION);

    if (currentQ) {
      setReviews((r) => [
        ...r,
        {
          question: currentQ,
          selectedIndex: -1,
          isCorrect: false,
          timeSpentSeconds: QUESTION_DURATION,
        },
      ]);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isConfirmed) return;
    soundEffects.playClick();
    setSelectedOptionIndex(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOptionIndex === null || isConfirmed || !currentQ) return;

    setIsConfirmed(true);
    const timeSpent = QUESTION_DURATION - timeLeft;
    setTotalQuizTime((t) => t + timeSpent);

    const isCorrect = selectedOptionIndex === currentQ.correctOptionIndex;

    if (isCorrect) {
      soundEffects.playCorrect();
      setCorrectCount((c) => c + 1);
      // Base 100 + speed bonus up to 50
      const speedBonus = Math.round(timeLeft * 2.5);
      setScore((s) => s + 100 + speedBonus);
    } else {
      soundEffects.playWrong();
      setIncorrectCount((c) => c + 1);
    }

    setReviews((r) => [
      ...r,
      {
        question: currentQ,
        selectedIndex: selectedOptionIndex,
        isCorrect,
        timeSpentSeconds: timeSpent,
      },
    ]);
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsConfirmed(false);
      setTimeLeft(QUESTION_DURATION);
    } else {
      // Finished
      onFinishQuiz(score, correctCount, incorrectCount, totalQuizTime, reviews);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-12 h-12 rounded-full border-3 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Generating Quiz Questions
        </h3>
        <p className={`text-xs mt-1 max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Fetching verified trivia from Open Trivia Database API...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error || !currentQ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Failed to Load Questions
          </h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {error || 'Unable to retrieve quiz items from API.'}
          </p>
        </div>
        <div className="flex gap-2 w-full max-w-xs pt-2">
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
          <button
            onClick={onQuit}
            className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs active:scale-95"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isTimerUrgent = timeLeft <= 5;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Header: Progress Bar + Timer */}
      <div className={`px-4 pt-3 pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-500">
              Q{currentIndex + 1} of {questions.length}
            </span>
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              · {progressPercent}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Score pill */}
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              {score} pts
            </span>

            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs transition-colors ${
                isTimerUrgent
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question & Options Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Question Statement Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentQ.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                currentQ.difficulty === 'hard'
                  ? 'bg-red-500/15 text-red-400'
                  : currentQ.difficulty === 'medium'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-emerald-500/15 text-emerald-400'
              }`}
            >
              {currentQ.difficulty}
            </span>
          </div>
          <h3 className={`text-sm md:text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentQ.questionText}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrectOption = idx === currentQ.correctOptionIndex;

            let tileStyle = isDark
              ? 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:border-slate-600'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-sm';
            let badgeStyle = isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700';

            if (isConfirmed) {
              if (isCorrectOption) {
                tileStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-500 text-white';
              } else if (isSelected && !isCorrectOption) {
                tileStyle = 'bg-red-500/20 border-red-500 text-red-400 ring-1 ring-red-500';
                badgeStyle = 'bg-red-500 text-white';
              } else {
                tileStyle = 'opacity-40 border-transparent';
              }
            } else if (isSelected) {
              tileStyle = 'bg-indigo-600/15 border-indigo-600 text-indigo-400 ring-1 ring-indigo-600';
              badgeStyle = 'bg-indigo-600 text-white';
            }

            return (
              <button
                key={idx}
                disabled={isConfirmed}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-3.5 rounded-xl border flex items-center text-left transition-all active:scale-[0.99] ${tileStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mr-3 transition-colors ${badgeStyle}`}
                >
                  {optionLetters[idx]}
                </div>
                <span className="text-xs font-medium flex-1 leading-snug">
                  {option}
                </span>
                {isConfirmed && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                )}
                {isConfirmed && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Banner */}
        {isConfirmed && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 animate-fadeIn ${
              selectedOptionIndex === currentQ.correctOptionIndex
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}
          >
            {selectedOptionIndex === currentQ.correctOptionIndex ? (
              <>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">
                  Correct! +100 base score (+ speed bonus)
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">
                  Incorrect! Correct answer: {currentQ.options[currentQ.correctOptionIndex]}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div
        className={`p-3.5 border-t flex items-center gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <button
          onClick={onQuit}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Quit
        </button>

        {!isConfirmed ? (
          <button
            disabled={selectedOptionIndex === null}
            onClick={handleConfirmAnswer}
            className="flex-1 h-11 rounded-xl bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Answer</span>
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>{currentIndex + 1 === questions.length ? 'View Results' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
