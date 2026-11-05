import React, { useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  isDark: boolean;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  entries,
  isDark,
}) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Computer Science', 'Programming', 'General Knowledge', 'Science & Nature'];

  const filteredEntries = filter === 'All'
    ? entries
    : entries.filter((e) => e.category === filter);

  const top3 = filteredEntries.slice(0, 3);
  const remaining = filteredEntries.slice(3);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
      <div>
        <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          High Score Leaderboard
        </h3>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Top ranked quiz players and local score history.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundEffects.playClick();
              setFilter(cat);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Top 3 Podium (if at least 3 players) */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-2 pt-4 pb-2">
          {/* #2 Silver */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 flex items-center justify-center text-sm shadow-md mb-1">
              🥈
            </div>
            <span className={`text-[11px] font-bold truncate max-w-[80px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {top3[1].username}
            </span>
            <span className="text-[10px] text-slate-400 font-bold tabular-nums">
              {top3[1].score} pts
            </span>
            <div className="w-full h-16 rounded-t-xl bg-gradient-to-t from-slate-400/20 to-slate-400/40 border-t border-x border-slate-400/40 flex items-center justify-center font-black text-slate-400 text-sm mt-1">
              2
            </div>
          </div>

          {/* #1 Gold */}
          <div className="flex-1 flex flex-col items-center -mt-3">
            <Crown className="w-5 h-5 text-amber-400 mb-0.5 animate-bounce" />
            <div className="w-12 h-12 rounded-full bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-base shadow-lg shadow-amber-500/30 mb-1">
              👑
            </div>
            <span className={`text-xs font-extrabold truncate max-w-[90px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {top3[0].username}
            </span>
            <span className="text-[11px] text-amber-500 font-extrabold tabular-nums">
              {top3[0].score} pts
            </span>
            <div className="w-full h-22 rounded-t-xl bg-gradient-to-t from-amber-500/20 to-amber-500/40 border-t border-x border-amber-500/50 flex items-center justify-center font-black text-amber-500 text-base mt-1">
              1
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-700/60 border-2 border-amber-600 flex items-center justify-center text-sm shadow-md mb-1 text-white">
              🥉
            </div>
            <span className={`text-[11px] font-bold truncate max-w-[80px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {top3[2].username}
            </span>
            <span className="text-[10px] text-slate-400 font-bold tabular-nums">
              {top3[2].score} pts
            </span>
            <div className="w-full h-12 rounded-t-xl bg-gradient-to-t from-amber-700/20 to-amber-700/40 border-t border-x border-amber-700/40 flex items-center justify-center font-black text-amber-700 text-sm mt-1">
              3
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="space-y-2">
        {filteredEntries.map((entry, index) => {
          const rank = index + 1;
          return (
            <div
              key={index}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                rank === 1
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold tabular-nums ${
                    rank === 1
                      ? 'bg-amber-400 text-slate-900 font-extrabold'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : rank === 3
                      ? 'bg-amber-700 text-white'
                      : isDark
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {rank}
                </span>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {entry.username}
                  </h4>
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {entry.category} · {entry.accuracy}% accuracy
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-indigo-500 tabular-nums">
                {entry.score} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
