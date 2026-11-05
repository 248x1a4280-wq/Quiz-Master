import React from 'react';
import { Play, Trophy, CheckCircle, PlusCircle, ArrowRight, Sparkles, Code, Cpu, Calculator, FlaskConical, Trophy as TrophyIcon, History as HistoryIcon, Film, Lightbulb } from 'lucide-react';
import { QuizCategory, UserProfile } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface HomeScreenProps {
  profile: UserProfile;
  categories: QuizCategory[];
  selectedCategory: QuizCategory;
  selectedDifficulty: string;
  customQuestionsCount: number;
  onSelectCategory: (cat: QuizCategory) => void;
  onStartQuiz: (useCustom?: boolean) => void;
  onNavigate: (screen: 'category' | 'leaderboard' | 'profile' | 'add-question') => void;
  isDark: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  categories,
  selectedCategory,
  selectedDifficulty,
  customQuestionsCount,
  onSelectCategory,
  onStartQuiz,
  onNavigate,
  isDark,
}) => {
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
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
      {/* Top Welcome Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Welcome back,
          </span>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {profile.username}
          </h2>
        </div>
        <button
          onClick={() => {
            soundEffects.playClick();
            onNavigate('profile');
          }}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-transform active:scale-95 border ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-700'
              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
          title="Open Profile"
        >
          {profile.avatar}
        </button>
      </div>

      {/* Featured Quiz Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
            Featured Quiz
          </span>
          <span className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Active
          </span>
        </div>

        <h3 className="text-xl font-extrabold leading-tight">
          Test Your Brain Power
        </h3>
        <p className="text-xs text-indigo-100/90 mt-1">
          {selectedCategory.name} · {selectedDifficulty.toUpperCase()}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              onStartQuiz();
            }}
            className="flex-1 h-11 rounded-xl bg-white text-indigo-600 font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-indigo-50 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-indigo-600" />
            <span>Start Quiz Now</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('category');
            }}
            className="h-11 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs flex items-center justify-center backdrop-blur-md active:scale-95 transition-all"
            title="Configure category and difficulty"
          >
            Config
          </button>
        </div>
      </div>

      {/* Quick Statistics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5">
              Done
            </span>
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-extrabold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profile.quizzesAttempted}
            </span>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Quizzes Completed
            </p>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-amber-500">
              Personal Best
            </span>
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-extrabold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profile.highestScore}
            </span>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Highest Score
            </p>
          </div>
        </div>
      </div>

      {/* Custom Questions Banner */}
      {customQuestionsCount > 0 && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-indigo-950/40 border-indigo-800/60' : 'bg-indigo-50 border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {customQuestionsCount} Custom Question{customQuestionsCount > 1 ? 's' : ''}
              </h4>
              <p className={`text-[11px] ${isDark ? 'text-indigo-200/70' : 'text-slate-600'}`}>
                Ready for user-created challenges
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onStartQuiz(true);
            }}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-indigo-300/40 shadow-xs"
          >
            Play Custom
          </button>
        </div>
      )}

      {/* Categories Showcase Header */}
      <div className="flex items-center justify-between pt-1">
        <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Popular Categories
        </h3>
        <button
          onClick={() => {
            soundEffects.playClick();
            onNavigate('category');
          }}
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Grid (4 top preview items) */}
      <div className="grid grid-cols-2 gap-2.5 pb-2">
        {categories.slice(0, 4).map((cat) => {
          const isSelected = selectedCategory.name === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => {
                soundEffects.playClick();
                onSelectCategory(cat);
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all active:scale-[0.98] ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white mb-2"
                style={{ backgroundColor: cat.color }}
              >
                {getCategoryIcon(cat.iconName)}
              </div>
              <h4 className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {cat.name}
              </h4>
              <p className={`text-[10px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
