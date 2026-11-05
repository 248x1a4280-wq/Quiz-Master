import React, { useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white p-8 select-none overflow-hidden">
      {/* Decorative ambient blurs */}
      <div className="absolute top-1/4 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex justify-end">
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 transition-colors"
        >
          Skip Intro
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 100 }}
          className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/20 mb-6"
        >
          <Brain className="w-13 h-13 text-white stroke-[2.2]" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-200 bg-clip-text text-transparent">
            QuizMaster
          </h1>
          <p className="text-xs text-indigo-200/80 mt-2 font-medium tracking-wide">
            Interactive Android Quiz Experience
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <span className="text-[11px] text-slate-400 font-mono">
          Flutter 3.35 · OpenTDB API
        </span>
      </div>
    </div>
  );
};
