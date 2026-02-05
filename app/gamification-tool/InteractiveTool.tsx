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
  const [steps, setSteps] = useState(0); 
  const [calories, setCalories] = useState(0);
  
  const isNaija = config.theme === 'nigerian-vibrant';
  const isWestern = config.theme === 'western-modern';
  const isPanAfrican = config.theme === 'pan-african';

  // Real-Time Pedometer Logic (Actual Movement)
  useEffect(() => {
    let lastAcceleration = 0;
    const threshold = 12; // Sensitivity for a 'step'

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const totalAcc = Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2);
      const delta = Math.abs(totalAcc - lastAcceleration);
      
      if (delta > threshold) {
        setSteps(prev => {
          const next = prev + 1;
          setCalories(Math.round(next * 0.04));
          if (next % 10 === 0) setPoints(p => p + 1);
          return next;
        });
      }
      lastAcceleration = totalAcc;
    };

    if (isActive) {
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [isActive]);

  const toggleSession = async () => {
    if (isActive) {
      setIsActive(false);
      setShowEvaluation(true);
    } else {
      // iOS Sensor Permission Request
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission !== 'granted') {
            alert("Motion permission is required to track actual steps!");
            return;
          }
        } catch (error) {
          console.error("Permission error:", error);
        }
      }
      setIsActive(true);
      setIsPlaying(true);
    }
  };

  if (showEvaluation) {
    return (
      <div className={`min-h-[100dvh] w-full ${isNaija ? 'bg-[#fdf8f4]' : isWestern ? 'bg-blue-50' : 'bg-slate-50'} p-6 flex flex-col items-center justify-center font-sans`}>
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">Evaluation Protocol</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Objective (iv): Impact Analysis</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-2xl flex justify-between items-center border border-gray-100 shadow-inner">
               <div className="text-center">
                 <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Real steps</span>
                 <span className="text-2xl font-black text-indigo-600 leading-none">{steps}</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="text-center">
                 <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Burn</span>
                 <span className="text-2xl font-black text-orange-500 leading-none">{calories}</span>
               </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-700 leading-tight text-center px-4">Based on this session, rate the motivational impact of the {config.culturalContext.locationSignal} tool:</p>
              <div className="flex justify-between gap-2 px-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} className="flex-1 aspect-square rounded-xl bg-gray-50 border border-gray-100 text-gray-400 font-black hover:bg-indigo-600 hover:text-white transition-all active:scale-90">
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase px-2">
                 <span>Weak Signal</span>
                 <span>Peak Motivation</span>
              </div>
            </div>

            <Link href="/" className="block w-full py-5 bg-indigo-600 text-white text-center rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              Submit Intelligence
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] w-full ${isNaija ? 'bg-[#fdf8f4]' : isWestern ? 'bg-blue-50' : 'bg-slate-50'} p-3 sm:p-6 lg:p-12 font-sans overflow-x-hidden flex flex-col items-center justify-center`}>
      <div className="max-w-md w-full mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Top Header */}
        <header className="flex justify-between items-center bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-black/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${isNaija ? 'bg-green-600' : isWestern ? 'bg-blue-600' : isPanAfrican ? 'bg-orange-600' : 'bg-indigo-600'} flex items-center justify-center text-white font-black shadow-lg text-sm sm:text-base flex-shrink-0`}>
              {isNaija ? '🇳🇬' : isWestern ? '🇺🇸' : isPanAfrican ? '🌍' : '🌐'}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black tracking-tight uppercase leading-none truncate">
                {config.culturalContext.locationSignal} Tool
              </h1>
              <p className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">Research Obj. III</p>
            </div>
          </div>
          <Link href="/" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
        </header>

        <div className="p-2.5 sm:p-4 bg-indigo-600 rounded-xl sm:rounded-2xl text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-between shadow-lg shadow-indigo-200">
           <span className="truncate mr-2">Protocol: {mode}</span>
           <div className="flex items-center gap-2">
              <span className="opacity-60 text-[7px] uppercase tracking-tighter">{config.totalParticipants} ACTIVE SIGNALS</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
           </div>
        </div>

        {/* Core Tracker Section */}
        <div className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl transition-all duration-1000 ${isActive ? (isNaija ? 'bg-green-600' : isWestern ? 'bg-blue-600' : 'bg-indigo-600') : (isNaija ? 'bg-gradient-to-br from-green-600 to-indigo-950' : isWestern ? 'bg-gradient-to-br from-blue-600 to-indigo-900' : 'bg-gradient-to-br from-indigo-600 to-purple-700')}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
              {isActive ? 'Tracking Body Motion' : 'Sensor Offline'}
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
                <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">Energy Burn</span>
                <span className="text-lg font-black">{calories} <span className="text-[10px]">kcal</span></span>
             </div>
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">Consensus Pts</span>
                <span className="text-lg font-black">{points} <span className="text-[10px]">pts</span></span>
             </div>
          </div>
        </div>

        {/* Dynamic Music Section */}
        <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex items-center gap-3 sm:gap-4 group hover:border-indigo-200 transition-all">
          <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${isNaija ? 'bg-orange-100 text-orange-600' : isWestern ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'} flex items-center justify-center shadow-inner flex-shrink-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${isPlaying ? 'animate-bounce' : ''} sm:w-7 sm:h-7`}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Audio Driver</h3>
            <p className="font-black text-gray-900 text-xs sm:text-base truncate leading-tight mt-0.5">{config.culturalContext.musicGenre}</p>
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

        {/* Dynamic Leaderboard */}
        {config.showLeaderboard && (
          <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h3 className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{config.culturalContext.leaderboardName}</h3>
              <span className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase">Voted by {config.leaderboardVotes}%</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'Target', score: '8.5k', img: '🎯' },
                { name: 'Session', score: `${(steps/1000).toFixed(1)}k`, img: '👤', active: true }
              ].map((user, i) => (
                <div key={i} className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${user.active ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center text-xs sm:text-sm shadow-sm border border-gray-100 flex-shrink-0">{user.img}</div>
                  <span className="flex-1 font-black text-[11px] sm:text-sm text-gray-700 truncate uppercase">{user.name}</span>
                  <span className="font-black text-[7px] sm:text-[9px] text-indigo-600 uppercase flex-shrink-0 tracking-tighter">{user.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Rewards */}
        {config.showRewards && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-dashed ${isNaija ? 'border-green-200 bg-green-50/50' : isWestern ? 'border-blue-200 bg-blue-50/50' : 'border-indigo-100 bg-indigo-50/50'} flex flex-col items-center justify-center text-center`}>
              <span className="text-lg sm:text-2xl mb-1.5 sm:mb-2">{isNaija ? '👑' : '🏆'}</span>
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Consensus Prize</span>
              <span className="font-black text-gray-900 text-[10px] sm:text-sm leading-tight mt-1.5 uppercase">{config.culturalContext.rewardName}</span>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl mb-1.5 sm:mb-2">⚡</span>
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">REALTIME</span>
              <span className="font-black text-indigo-600 text-sm sm:text-lg mt-1.5">{points.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Active Toggle */}
        <button 
          onClick={toggleSession}
          className={`w-full py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-white shadow-2xl active:scale-95 transition-all text-xs sm:text-base flex items-center justify-center gap-3 ${
            isActive 
              ? 'bg-red-500 shadow-red-200' 
              : (isNaija ? 'bg-green-600 shadow-green-200' : isWestern ? 'bg-blue-600 shadow-blue-200' : 'bg-indigo-600 shadow-indigo-200')
          }`}
        >
          {isActive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
              Finalize & Evaluate
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Engage Local Protocol
            </>
          )}
        </button>

        <div className="text-center space-y-1.5 pb-6 sm:pb-12 border-t border-gray-100 pt-6">
           <p className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
             Adaptive Protocol: {config.culturalContext.locationSignal} — v1.0.0
           </p>
           <p className="text-[6px] sm:text-[8px] text-gray-300 font-medium max-w-[200px] sm:max-w-xs mx-auto leading-relaxed px-4 italic leading-tight">
             Executing design findings from {config.totalParticipants} participants to test multicultural health adoption.
           </p>
        </div>
      </div>
    </div>
  );
}