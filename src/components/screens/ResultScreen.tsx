import React, { useState, useEffect } from 'react';
import { RotateCcw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle, Award, Clock, Percent, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizResult } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface ResultScreenProps {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
  isDark: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRestart,
  onHome,
  isDark,
}) => {
  const [showReview, setShowReview] = useState(false);
  const percentage = Math.round((result.correctCount / Math.max(1, result.totalQuestions)) * 100);

  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    }
  }, [percentage]);

  const getPerformanceBadge = () => {
    if (percentage >= 90) return { title: 'Master Mind! 🏆', desc: 'Outstanding knowledge mastery', color: 'from-amber-500 to-yellow-600' };
    if (percentage >= 75) return { title: 'Great Job! 🌟', desc: 'Superb precision and agility', color: 'from-indigo-500 to-purple-600' };
    if (percentage >= 50) return { title: 'Good Effort! 🎯', desc: 'Solid foundation, keep practicing', color: 'from-blue-500 to-cyan-600' };
    return { title: 'Keep Learning! 💪', desc: 'Review your mistakes and try again', color: 'from-slate-600 to-slate-700' };
  };

  const badge = getPerformanceBadge();

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
      {/* Hero Score Showcase Card */}
      <div className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${badge.color} text-white text-center shadow-lg`}>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-extrabold tracking-tight">
          {badge.title}
        </h3>
        <p className="text-xs text-white/80 mt-0.5">
          {badge.desc}
        </p>

        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-center gap-2">
          <span className="text-4xl font-extrabold tracking-tight tabular-nums">
            {result.score}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            Total Points
          </span>
        </div>
      </div>

      {/* 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          className={`p-3 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Percent className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Accuracy</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {percentage}%
          </span>
        </div>

        <div
          className={`p-3 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Correct</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {result.correctCount} / {result.totalQuestions}
          </span>
        </div>

        <div
          className={`p-3 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Mistakes</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {result.incorrectCount}
          </span>
        </div>

        <div
          className={`p-3 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Duration</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {result.totalTimeSeconds}s
          </span>
        </div>
      </div>

      {/* Review Answers Accordion */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <button
          onClick={() => {
            soundEffects.playClick();
            setShowReview(!showReview);
          }}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs"
        >
          <span className={isDark ? 'text-white' : 'text-slate-900'}>
            Review Detailed Answers ({result.reviews.length})
          </span>
          {showReview ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showReview && (
          <div className={`p-3.5 pt-0 space-y-2.5 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
            {result.reviews.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  item.isCorrect
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-emerald-50/60 border-emerald-200'
                    : isDark
                    ? 'bg-red-950/20 border-red-800/40'
                    : 'bg-red-50/60 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Q{idx + 1}. {item.question.questionText}
                  </span>
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-1.5" />
                  )}
                </div>

                {!item.isCorrect && item.selectedIndex >= 0 && (
                  <p className="text-red-500 text-[11px]">
                    Your Answer: {item.question.options[item.selectedIndex]}
                  </p>
                )}
                <p className="text-emerald-500 font-semibold text-[11px]">
                  Correct: {item.question.options[item.question.correctOptionIndex]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1 pb-4">
        <button
          onClick={() => {
            soundEffects.playClick();
            onRestart();
          }}
          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onHome();
          }}
          className={`w-full h-11 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
            isDark
              ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
