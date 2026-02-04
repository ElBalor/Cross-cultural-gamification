"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ToolConfig } from "@/lib/analysis";

export default function InteractiveTool({ 
  config, 
  mode 
}: { 
  config: ToolConfig, 
  mode: string 
}) {
  const [isActive, setIsActive] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Fitness Stats
  const [points, setPoints] = useState(2450);
  const [steps, setSteps] = useState(0); // Start at 0 for session
  const [calories, setCalories] = useState(0);
  
  const isNaija = config.theme === 'nigerian-vibrant';

  // Live Step Simulation (Pedometer Mimic)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSteps(prev => {
          const next = prev + Math.floor(Math.random() * 3) + 1; // 1-3 steps per tick
          setCalories(Math.round(next * 0.04)); // Approx 0.04 kcal per step
          return next;
        });
        
        // Add points every 100 steps
        if (steps > 0 && steps % 100 === 0) {
           setPoints(p => p + 10);
        }
      }, 800); // Update every 800ms to feel "live"
    }
    return () => clearInterval(interval);
  }, [isActive, steps]);

  const toggleSession = () => {
    if (isActive) {
      // Stopping session -> Trigger Evaluation (Objective 4)
      setIsActive(false);
      setShowEvaluation(true);
    } else {
      // Starting session
      setIsActive(true);
      setIsPlaying(true); // Auto-start music
    }
  };

  if (showEvaluation) {
    return (
      <div className={`min-h-[100dvh] w-full ${isNaija ? 'bg-[#fdf8f4]' : 'bg-slate-50'} p-6 flex flex-col items-center justify-center font-sans`}>
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Session Complete</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Objective (iv): Impact Evaluation</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-100">
               <div className="text-center">
                 <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Steps</span>
                 <span className="text-xl font-black text-indigo-600">{steps}</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="text-center">
                 <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Calories</span>
                 <span className="text-xl font-black text-orange-500">{calories}</span>
               </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700">How motivated did you feel using the {isNaija ? 'Nigerian' : 'Standard'} cultural elements?</p>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-colors">
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/" className="block w-full py-4 bg-black text-white text-center rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
              Submit Impact Data
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] w-full ${isNaija ? 'bg-[#fdf8f4]' : 'bg-slate-50'} p-3 sm:p-6 lg:p-12 font-sans overflow-x-hidden flex flex-col items-center justify-center`}>
      <div className="max-w-md w-full mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Top Header */}
        <header className="flex justify-between items-center bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-black/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${isNaija ? 'bg-green-600' : 'bg-indigo-600'} flex items-center justify-center text-white font-black shadow-lg text-sm sm:text-base flex-shrink-0`}>
              {isNaija ? '🇳🇬' : '🌍'}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black tracking-tight uppercase leading-none truncate">
                {isNaija ? 'Cross-Cultural Tool' : 'Global Adaptor'}
              </h1>
              <p className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">Research Objective III</p>
            </div>
          </div>
          <Link href="/" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
        </header>

        {/* Core Logic Section */}
        <div className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl transition-all duration-1000 ${isActive ? (isNaija ? 'bg-green-600' : 'bg-indigo-600') : (isNaija ? 'bg-gradient-to-br from-green-600 to-indigo-950' : 'bg-gradient-to-br from-indigo-600 to-purple-700')}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
              {isActive ? 'Session Active' : 'Ready to Start'}
            </span>
            {isActive && <span className="flex h-2 w-2 rounded-full bg-white animate-ping"></span>}
          </div>
          
          <div className="flex items-end gap-2 mb-6">
            <h2 className="text-5xl sm:text-6xl font-black leading-none tracking-tighter">
              {steps}
            </h2>
            <span className="text-sm sm:text-base font-bold opacity-60 mb-2 uppercase tracking-widest">Steps</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">Calories</span>
                <span className="text-lg font-black">{calories} <span className="text-[10px]">kcal</span></span>
             </div>
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">Points</span>
                <span className="text-lg font-black">{points} <span className="text-[10px]">pts</span></span>
             </div>
          </div>
        </div>

        {/* Music Section */}
        <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex items-center gap-3 sm:gap-4 group hover:border-indigo-200 transition-all">
          <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${isNaija ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'} flex items-center justify-center shadow-inner flex-shrink-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${isPlaying ? 'animate-bounce' : ''} sm:w-7 sm:h-7`}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Audio Driver</h3>
            <p className="font-black text-gray-900 text-xs sm:text-base truncate leading-tight mt-0.5">{config.suggestedMusic}</p>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all flex-shrink-0 ${isPlaying ? 'bg-red-500' : 'bg-indigo-600'}`}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
        </div>

        {/* Feature: Leaderboard */}
        {config.showLeaderboard && (
          <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h3 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{isNaija ? 'Speed Leaderboard' : 'Global Rankings'}</h3>
              <span className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded-md">Live Sync</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'Research Consensus', score: 'Top Choice', img: '🔥' },
                { name: 'Cultural Sync', score: 'High', img: '✨' }
              ].map((user, i) => (
                <div key={i} className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50/50 border border-gray-100`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center text-xs sm:text-sm shadow-sm border border-gray-100 flex-shrink-0">{user.img}</div>
                  <span className="flex-1 font-black text-[11px] sm:text-sm text-gray-700 truncate">{user.name}</span>
                  <span className="font-black text-[7px] sm:text-[9px] text-indigo-600 uppercase flex-shrink-0 tracking-tighter">{user.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={toggleSession}
          className={`w-full py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-white shadow-2xl active:scale-95 transition-all text-xs sm:text-base flex items-center justify-center gap-3 ${
            isActive 
              ? 'bg-red-500 shadow-red-200' 
              : (isNaija ? 'bg-green-600 shadow-green-200' : 'bg-indigo-600 shadow-indigo-200')
          }`}
        >
          {isActive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
              End Session & Evaluate
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Live Tracking
            </>
          )}
        </button>

        <div className="text-center space-y-1.5 pb-6 sm:pb-12">
           <p className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
             Cross-Cultural Gamification Tool — v1.0.0
           </p>
           <p className="text-[6px] sm:text-[8px] text-gray-300 font-medium max-w-[200px] sm:max-w-xs mx-auto leading-relaxed px-4 italic">
             Complete a session to access the Objective (iv) Impact Evaluation protocol.
           </p>
        </div>
      </div>
    </div>
  );
}
