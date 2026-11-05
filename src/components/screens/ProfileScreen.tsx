import React, { useState } from 'react';
import { User, Edit3, Check, Trophy, Target, Award, RotateCcw, GraduationCap, Flame } from 'lucide-react';
import { UserProfile } from '../../types/quiz';
import { soundEffects } from '../../services/soundEffects';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  isDark: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
  isDark,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const avatars = ['🧑‍💻', '🚀', '💡', '🏆', '🎯', '⚡', '🧠', '🎓', '🦊', '👾'];

  const handleSave = () => {
    if (!username.trim()) return;
    soundEffects.playClick();
    onUpdateProfile({
      username: username.trim(),
      avatar: selectedAvatar,
    });
    setIsEditing(false);
  };

  const accuracyRate = profile.quizzesAttempted > 0
    ? Math.min(100, Math.round((profile.totalCorrectAnswers / (profile.quizzesAttempted * 10)) * 100))
    : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
      {/* User Header Card */}
      <div
        className={`p-5 rounded-3xl border text-center relative ${
          isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <button
          onClick={() => {
            soundEffects.playClick();
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className="absolute top-4 right-4 text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4" />
              <span>Done</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </>
          )}
        </button>

        {/* Avatar Display */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-indigo-500/25 border-2 border-white/20 mb-3">
          {selectedAvatar}
        </div>

        {isEditing ? (
          <div className="space-y-3 pt-1">
            {/* Avatar selector row */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {avatars.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform ${
                    selectedAvatar === emoji
                      ? 'bg-indigo-600 text-white scale-110 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-2 text-center text-sm font-bold rounded-xl border outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
              placeholder="Your username"
            />
          </div>
        ) : (
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profile.username}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Senior Quiz Pioneer · Level 4
            </p>
          </div>
        )}
      </div>

      {/* 4-Stat Metric Summary */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-1.5 text-blue-500 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-[11px] font-semibold">High Score</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {profile.highestScore}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Correct Solved</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {profile.totalCorrectAnswers}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-1.5 text-purple-500 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Quizzes Taken</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {profile.quizzesAttempted}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-1.5 text-amber-500 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Win Accuracy</span>
          </div>
          <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {accuracyRate}%
          </span>
        </div>
      </div>

      {/* College Project Info Banner */}
      <div
        className={`p-4 rounded-2xl border space-y-2 text-xs ${
          isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 font-bold text-indigo-500">
          <GraduationCap className="w-4 h-4" />
          <span>College Project Architecture</span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Frontend Framework:</span>
            <span className="font-semibold text-right">Flutter 3.35+ & Dart</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>State Management:</span>
            <span className="font-semibold text-right">Provider + ChangeNotifier</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Persistence:</span>
            <span className="font-semibold text-right">SharedPreferences Local DB</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>API Source:</span>
            <span className="font-semibold text-right">Open Trivia DB (opentdb.com)</span>
          </div>
        </div>
      </div>

      {/* Reset Data Button */}
      <div className="pt-1 pb-4">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your quiz stats and local scores?')) {
              onResetData();
            }
          }}
          className="w-full py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-red-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Statistics</span>
        </button>
      </div>
    </div>
  );
};
