import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Home, LayoutGrid, Trophy, User, PlusCircle, Volume2, VolumeX, Moon, Sun, Smartphone, Maximize2 } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: 'home' | 'category' | 'leaderboard' | 'profile' | 'add-question';
  onTabChange: (tab: 'home' | 'category' | 'leaderboard' | 'profile' | 'add-question') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isDeviceFramed: boolean;
  onToggleDeviceFrame: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  isDeviceFramed,
  onToggleDeviceFrame,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    soundEffects.isMuted = !soundEffects.isMuted;
    setIsMuted(soundEffects.isMuted);
    if (!soundEffects.isMuted) {
      soundEffects.playClick();
    }
  };

  const frameContent = (
    <div
      className={`relative flex flex-col w-full h-full select-none overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Android Status Bar */}
      <div
        className={`h-7 px-4 flex items-center justify-between text-[11px] font-semibold shrink-0 z-20 ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        <div className="flex items-center gap-1.5 font-mono">
          <span>{timeStr}</span>
        </div>

        {/* Camera Punch-Hole Simulation */}
        <div className="w-3.5 h-3.5 rounded-full bg-black/90 border border-slate-700/50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className="hover:opacity-75 transition-opacity"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
          </button>
          <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
          <div className="flex items-center gap-0.5 font-mono text-[10px]">
            <span>100%</span>
            <Battery className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Screen Body */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <div
        className={`h-16 px-2 flex items-center justify-around border-t shrink-0 z-20 transition-colors ${
          isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}
      >
        <button
          onClick={() => {
            soundEffects.playClick();
            onTabChange('home');
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'home' ? 'bg-indigo-600/15' : ''
            }`}
          >
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onTabChange('category');
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            activeTab === 'category'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'category' ? 'bg-indigo-600/15' : ''
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Quiz</span>
        </button>

        {/* Center Add Question Action */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onTabChange('add-question');
          }}
          className="flex flex-col items-center justify-center -mt-4 group"
          title="Add Custom Question"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-active:scale-95 transition-transform">
            <PlusCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[9px] font-bold text-indigo-500 mt-1">Add</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onTabChange('leaderboard');
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            activeTab === 'leaderboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'leaderboard' ? 'bg-indigo-600/15' : ''
            }`}
          >
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Ranks</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onTabChange('profile');
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'profile' ? 'bg-indigo-600/15' : ''
            }`}
          >
            <User className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>

      {/* Android Gesture Bar */}
      <div className={`h-3 w-full flex items-center justify-center pb-1 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="w-24 h-1 rounded-full bg-slate-400/50" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-64px)] p-2 md:p-6">
      {/* Device Toolbar Controls */}
      <div className="flex items-center gap-3 mb-3 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-md">
        <span className="text-xs font-semibold text-slate-300">
          Android Device Emulator
        </span>
        <div className="w-px h-3.5 bg-slate-700" />

        <button
          onClick={onToggleDeviceFrame}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
          title="Toggle phone chassis"
        >
          {isDeviceFramed ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isDeviceFramed ? 'Expanded' : 'Chassis'}</span>
        </button>

        <div className="w-px h-3.5 bg-slate-700" />

        <button
          onClick={onToggleTheme}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
          title="Toggle Android app theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Phone Body */}
      {isDeviceFramed ? (
        <div className="relative w-full max-w-[400px] h-[780px] max-h-[88vh] rounded-[48px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800 shadow-indigo-950/40">
          {/* Outer edge buttons simulation */}
          <div className="absolute -left-1 top-24 w-1 h-12 bg-slate-800 rounded-l-sm" />
          <div className="absolute -left-1 top-40 w-1 h-12 bg-slate-800 rounded-l-sm" />
          <div className="absolute -right-1 top-32 w-1 h-16 bg-slate-800 rounded-r-sm" />

          {/* Screen Chassis */}
          <div className="w-full h-full rounded-[40px] overflow-hidden border border-slate-800/80 shadow-inner">
            {frameContent}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl h-[780px] max-h-[88vh] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
          {frameContent}
        </div>
      )}
    </div>
  );
};
