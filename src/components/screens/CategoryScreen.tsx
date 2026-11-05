import React from 'react';
import { Play, Check, Code, Cpu, Calculator, FlaskConical, Trophy as TrophyIcon, History as HistoryIcon, Film, Lightbulb } from 'lucide-react';
import { Difficulty, QuizCategory } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface CategoryScreenProps {
  categories: QuizCategory[];
  selectedCategory: QuizCategory;
  selectedDifficulty: Difficulty;
  questionCount: number;
  onSelectCategory: (cat: QuizCategory) => void;
  onSelectDifficulty: (diff: Difficulty) => void;
  onSelectQuestionCount: (count: number) => void;
  onStartQuiz: () => void;
  isDark: boolean;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  categories,
  selectedCategory,
  selectedDifficulty,
  questionCount,
  onSelectCategory,
  onSelectDifficulty,
  onSelectQuestionCount,
  onStartQuiz,
  isDark,
}) => {
  const difficulties: Difficulty[] = ['any', 'easy', 'medium', 'hard'];
  const counts = [5, 10, 15, 20];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'code': return <Code className="w-5 h-5" />;
      case 'cpu': return <Cpu className="w-5 h-5" />;
      case 'calculator': return <Calculator className="w-5 h-5" />;
      case 'flask': return <FlaskConical className="w-5 h-5" />;
      case 'trophy': return <TrophyIcon className="w-5 h-5" />;
      case 'history': return <HistoryIcon className="w-5 h-5" />;
      case 'film': return <Film className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Title & Instructions */}
        <div>
          <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Select Quiz Category
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pick a knowledge domain and customize difficulty.
          </p>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory.name === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  soundEffects.playClick();
                  onSelectCategory(cat);
                }}
                className={`p-3 rounded-2xl text-left border transition-all active:scale-[0.98] relative flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/50'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h4>
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Difficulty Selection */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Difficulty Level
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((diff) => {
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectDifficulty(diff);
                  }}
                  className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/70'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count Selection */}
        <div className="pb-2">
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Questions Per Quiz
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {counts.map((count) => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectQuestionCount(count);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl tabular-nums transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/70'
                  }`}
                >
                  {count} Qs
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div
        className={`p-4 border-t ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
        }`}
      >
        <button
          onClick={() => {
            soundEffects.playClick();
            onStartQuiz();
          }}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start {selectedCategory.name} Quiz</span>
        </button>
      </div>
    </div>
  );
};
