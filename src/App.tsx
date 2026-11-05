import React, { useState, useEffect } from 'react';
import { Smartphone, Code2, Download, BookOpen, Brain, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import { Difficulty, Question, QuizCategory, QuizResult, UserProfile, LeaderboardEntry } from './types/quiz';
import { fetchOpenTdbQuestions } from './services/openTdbApi';
import { soundEffects } from './services/soundEffects';
import { FLUTTER_PROJECT_FILES } from './data/flutterSourceCode';
import { AndroidFrame } from './components/AndroidFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoryScreen } from './components/screens/CategoryScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { AddQuestionScreen } from './components/screens/AddQuestionScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { CodeExplorer } from './components/CodeExplorer';

export const DEFAULT_CATEGORIES: QuizCategory[] = [
  {
    id: 9,
    name: 'General Knowledge',
    description: 'Test your grasp across diverse global trivia.',
    iconName: 'lightbulb',
    color: '#3B82F6',
  },
  {
    id: 18,
    name: 'Computer Science',
    description: 'Algorithms, hardware, protocols, and IT foundations.',
    iconName: 'cpu',
    color: '#6366F1',
  },
  {
    id: 18,
    name: 'Programming',
    description: 'Flutter, Dart, Python, JavaScript, and OOP principles.',
    iconName: 'code',
    color: '#8B5CF6',
  },
  {
    id: 19,
    name: 'Mathematics',
    description: 'Algebra, geometry, logic, and arithmetic challenges.',
    iconName: 'calculator',
    color: '#EC4899',
  },
  {
    id: 17,
    name: 'Science & Nature',
    description: 'Physics, chemistry, biology, and astronomy wonders.',
    iconName: 'flask',
    color: '#10B981',
  },
  {
    id: 21,
    name: 'Sports',
    description: 'Olympic games, world football, basketball, and records.',
    iconName: 'trophy',
    color: '#F59E0B',
  },
  {
    id: 23,
    name: 'History',
    description: 'Ancient empires, world wars, and turning points.',
    iconName: 'history',
    color: '#EF4444',
  },
  {
    id: 11,
    name: 'Entertainment',
    description: 'Cinema, music, pop culture, and television.',
    iconName: 'film',
    color: '#06B6D4',
  },
];

const INITIAL_PROFILE: UserProfile = {
  username: 'Alex Developer',
  avatar: '🧑‍💻',
  quizzesAttempted: 4,
  totalCorrectAnswers: 32,
  highestScore: 920,
  currentStreak: 3,
};

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    username: 'Sarah_Tech',
    score: 1000,
    category: 'Computer Science',
    difficulty: 'hard',
    accuracy: 100,
    date: new Date().toISOString(),
  },
  {
    username: 'Rahul_Code',
    score: 920,
    category: 'Programming',
    difficulty: 'medium',
    accuracy: 90,
    date: new Date().toISOString(),
  },
  {
    username: 'Elena_V',
    score: 850,
    category: 'General Knowledge',
    difficulty: 'medium',
    accuracy: 80,
    date: new Date().toISOString(),
  },
  {
    username: 'David_K',
    score: 740,
    category: 'Science & Nature',
    difficulty: 'easy',
    accuracy: 70,
    date: new Date().toISOString(),
  },
];

export default function App() {
  // Top-level Navigation Mode: Simulator vs Code Explorer
  const [viewMode, setViewMode] = useState<'simulator' | 'code'>('simulator');

  // Simulator Screen Navigation: 'splash' | 'home' | 'category' | 'quiz' | 'result' | 'add-question' | 'leaderboard' | 'profile'
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'category' | 'leaderboard' | 'profile' | 'add-question'>('home');

  // Device Frame Mode: Phone Frame vs Expanded
  const [isDeviceFramed, setIsDeviceFramed] = useState(true);

  // Dark Mode for Simulator & App
  const [isDark, setIsDark] = useState(true);

  // Persistent User Data
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('quizmaster_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('quizmaster_custom_q');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('quizmaster_leaderboard');
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // Quiz Session Configuration
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>(DEFAULT_CATEGORIES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quizmaster_profile', JSON.stringify(profile));
    } catch (_) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('quizmaster_custom_q', JSON.stringify(customQuestions));
    } catch (_) {}
  }, [customQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem('quizmaster_leaderboard', JSON.stringify(leaderboard));
    } catch (_) {}
  }, [leaderboard]);

  // Sync dark class to html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Start Quiz Handler
  const handleStartQuiz = async (useCustom: boolean = false) => {
    setIsLoadingQuiz(true);
    setQuizError(null);
    setCurrentScreen('quiz');

    try {
      if (useCustom) {
        if (customQuestions.length === 0) {
          throw new Error('No custom questions found. Add some questions first!');
        }
        const shuffled = [...customQuestions].sort(() => Math.random() - 0.5);
        setActiveQuestions(shuffled.slice(0, Math.min(questionCount, shuffled.length)));
      } else {
        const fetched = await fetchOpenTdbQuestions(
          questionCount,
          selectedCategory.id,
          selectedDifficulty
        );
        if (!fetched || fetched.length === 0) {
          throw new Error('Could not load questions. Check your internet connection.');
        }
        setActiveQuestions(fetched);
      }
    } catch (err: any) {
      setQuizError(err.message || 'An unexpected error occurred while loading the quiz.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Finish Quiz Handler
  const handleFinishQuiz = (
    score: number,
    correctCount: number,
    incorrectCount: number,
    totalTimeSeconds: number,
    reviews: any[]
  ) => {
    const newResult: QuizResult = {
      id: `res_${Date.now()}`,
      categoryName: selectedCategory.name,
      difficulty: selectedDifficulty,
      score,
      totalQuestions: activeQuestions.length,
      correctCount,
      incorrectCount,
      totalTimeSeconds,
      completedAt: new Date().toISOString(),
      reviews,
    };

    setActiveResult(newResult);
    setCurrentScreen('result');

    // Update Profile Aggregates
    setProfile((prev) => ({
      ...prev,
      quizzesAttempted: prev.quizzesAttempted + 1,
      totalCorrectAnswers: prev.totalCorrectAnswers + correctCount,
      highestScore: Math.max(prev.highestScore, score),
    }));

    // Record to Leaderboard
    const newEntry: LeaderboardEntry = {
      username: profile.username,
      score,
      category: selectedCategory.name,
      difficulty: selectedDifficulty,
      accuracy: Math.round((correctCount / Math.max(1, activeQuestions.length)) * 100),
      date: new Date().toISOString(),
    };

    setLeaderboard((prev) => {
      const updated = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 25);
      return updated;
    });
  };

  // Add Custom Question
  const handleAddCustomQuestion = (q: Question) => {
    setCustomQuestions((prev) => [q, ...prev]);
  };

  const handleDeleteCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Reset Demo Data
  const handleResetData = () => {
    setProfile(INITIAL_PROFILE);
    setCustomQuestions([]);
    setLeaderboard(INITIAL_LEADERBOARD);
    localStorage.clear();
  };

  // Quick Zip Downloader
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      FLUTTER_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QuizMaster_Flutter_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (_) {}
  };

  // Render Simulator Screen
  const renderSimulatorScreen = () => {
    if (currentScreen === 'splash') {
      return (
        <SplashScreen
          onComplete={() => {
            setCurrentScreen('home');
            setActiveNavTab('home');
          }}
        />
      );
    }

    if (currentScreen === 'quiz') {
      return (
        <QuizScreen
          questions={activeQuestions}
          isLoading={isLoadingQuiz}
          error={quizError}
          onRetry={() => handleStartQuiz()}
          onFinishQuiz={handleFinishQuiz}
          onQuit={() => {
            setCurrentScreen('home');
            setActiveNavTab('home');
          }}
          isDark={isDark}
        />
      );
    }

    if (currentScreen === 'result' && activeResult) {
      return (
        <ResultScreen
          result={activeResult}
          onRestart={() => handleStartQuiz()}
          onHome={() => {
            setCurrentScreen('home');
            setActiveNavTab('home');
          }}
          isDark={isDark}
        />
      );
    }

    switch (activeNavTab) {
      case 'home':
        return (
          <HomeScreen
            profile={profile}
            categories={DEFAULT_CATEGORIES}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            customQuestionsCount={customQuestions.length}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveNavTab('category');
              setCurrentScreen('category');
            }}
            onStartQuiz={handleStartQuiz}
            onNavigate={(screen) => {
              setActiveNavTab(screen);
              setCurrentScreen(screen);
            }}
            isDark={isDark}
          />
        );
      case 'category':
        return (
          <CategoryScreen
            categories={DEFAULT_CATEGORIES}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            questionCount={questionCount}
            onSelectCategory={setSelectedCategory}
            onSelectDifficulty={setSelectedDifficulty}
            onSelectQuestionCount={setQuestionCount}
            onStartQuiz={() => handleStartQuiz()}
            isDark={isDark}
          />
        );
      case 'add-question':
        return (
          <AddQuestionScreen
            customQuestions={customQuestions}
            onAddQuestion={handleAddCustomQuestion}
            onDeleteQuestion={handleDeleteCustomQuestion}
            isDark={isDark}
          />
        );
      case 'leaderboard':
        return <LeaderboardScreen entries={leaderboard} isDark={isDark} />;
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={(upd) => setProfile((p) => ({ ...p, ...upd }))}
            onResetData={handleResetData}
            isDark={isDark}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Contract: 3-Zone Architecture */}
      <header className="h-16 px-6 flex items-center justify-between gap-8 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 shrink-0">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            QuizMaster
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('simulator');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              viewMode === 'simulator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android App Simulator</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('code');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              viewMode === 'code'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Flutter Source Code Hub</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            className="h-9 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-2 shadow-sm whitespace-nowrap transition-all active:scale-95"
            title="Download full Flutter source code project zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Flutter Zip</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {viewMode === 'simulator' ? (
          <AndroidFrame
            activeTab={activeNavTab}
            onTabChange={(tab) => {
              setActiveNavTab(tab);
              setCurrentScreen(tab);
            }}
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            isDeviceFramed={isDeviceFramed}
            onToggleDeviceFrame={() => setIsDeviceFramed(!isDeviceFramed)}
          >
            {renderSimulatorScreen()}
          </AndroidFrame>
        ) : (
          <CodeExplorer />
        )}
      </main>
    </div>
  );
}
