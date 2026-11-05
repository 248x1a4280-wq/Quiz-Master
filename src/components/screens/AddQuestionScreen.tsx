import React, { useState } from 'react';
import { Plus, Check, Trash2, HelpCircle } from 'lucide-react';
import { Difficulty, Question } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface AddQuestionScreenProps {
  customQuestions: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  isDark: boolean;
}

export const AddQuestionScreen: React.FC<AddQuestionScreenProps> = ({
  customQuestions,
  onAddQuestion,
  onDeleteQuestion,
  isDark,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [category, setCategory] = useState('Programming');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState(false);

  const categories = [
    'Programming',
    'Computer Science',
    'General Knowledge',
    'Mathematics',
    'Science & Nature',
    'Sports',
    'History',
    'Entertainment',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!questionText.trim()) {
      errs.questionText = 'Question text is required';
    } else if (questionText.trim().length < 8) {
      errs.questionText = 'Question must be at least 8 characters long';
    }

    if (!optionA.trim()) errs.optionA = 'Option A is required';
    if (!optionB.trim()) errs.optionB = 'Option B is required';
    if (!optionC.trim()) errs.optionC = 'Option C is required';
    if (!optionD.trim()) errs.optionD = 'Option D is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      soundEffects.playWrong();
      return;
    }

    const newQuestion: Question = {
      id: `custom_${Date.now()}`,
      questionText: questionText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctOptionIndex,
      category,
      difficulty,
      isCustom: true,
    };

    soundEffects.playCorrect();
    onAddQuestion(newQuestion);

    // Reset form
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOptionIndex(0);
    setErrors({});
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-5">
      <div>
        <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Create Custom Question
        </h3>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Design your own multiple choice challenge and save it locally.
        </p>
      </div>

      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Custom question saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Question Statement */}
        <div>
          <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Question Statement *
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={2}
            placeholder="e.g. Which programming language is primarily used in Flutter?"
            className={`w-full p-2.5 rounded-xl text-xs border transition-colors outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.questionText
                ? 'border-red-500 bg-red-500/5'
                : isDark
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          {errors.questionText && (
            <span className="text-[11px] text-red-500 font-medium mt-0.5 block">
              {errors.questionText}
            </span>
          )}
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Option A *
            </label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="e.g. Dart"
              className={`w-full p-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.optionA
                  ? 'border-red-500 bg-red-500/5'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {errors.optionA && <span className="text-[10px] text-red-500">{errors.optionA}</span>}
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Option B *
            </label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="e.g. Swift"
              className={`w-full p-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.optionB
                  ? 'border-red-500 bg-red-500/5'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {errors.optionB && <span className="text-[10px] text-red-500">{errors.optionB}</span>}
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Option C *
            </label>
            <input
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              placeholder="e.g. Kotlin"
              className={`w-full p-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.optionC
                  ? 'border-red-500 bg-red-500/5'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {errors.optionC && <span className="text-[10px] text-red-500">{errors.optionC}</span>}
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Option D *
            </label>
            <input
              type="text"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              placeholder="e.g. Java"
              className={`w-full p-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.optionD
                  ? 'border-red-500 bg-red-500/5'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {errors.optionD && <span className="text-[10px] text-red-500">{errors.optionD}</span>}
          </div>
        </div>

        {/* Correct Option Selector */}
        <div>
          <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Correct Option Target
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['Option A', 'Option B', 'Option C', 'Option D'].map((label, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCorrectOptionIndex(idx)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  correctOptionIndex === idx
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label.slice(-1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2 rounded-xl text-xs border outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={`w-full p-2 rounded-xl text-xs border outline-none capitalize ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Save Custom Question</span>
        </button>
      </form>

      {/* Saved Custom Questions List */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Saved Questions ({customQuestions.length})
          </h4>
        </div>

        {customQuestions.length === 0 ? (
          <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <HelpCircle className="w-6 h-6 mx-auto text-slate-400 mb-1" />
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No custom questions yet. Fill out the form above to save one.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {customQuestions.map((q) => (
              <div
                key={q.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="overflow-hidden">
                  <p className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {q.questionText}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {q.category} · {q.difficulty.toUpperCase()} · Ans: {q.options[q.correctOptionIndex]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteQuestion(q.id)}
                  className="w-7 h-7 rounded-lg text-red-500 hover:bg-red-500/10 flex items-center justify-center shrink-0 transition-colors"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
