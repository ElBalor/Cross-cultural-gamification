"use client";

import { useState } from "react";
import Link from "next/link";
import { ToolConfig } from "@/lib/analysis";

export default function InteractiveTool({ 
  config, 
  mode 
}: { 
  config: ToolConfig, 
  mode: string 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [points, setPoints] = useState(2450);
  const [steps, setPointsSteps] = useState(6500);
  const [logs, setLogs] = useState<string[]>([]);

  const isNaija = config.theme === 'nigerian-vibrant';

  const logActivity = () => {
    const newSteps = steps + 500;
    const newPoints = points + 25;
    setPointsSteps(newSteps);
    setPoints(newPoints);
    setLogs([`+500 steps logged at ${new Date().toLocaleTimeString()}`, ...logs.slice(0, 2)]);
  };

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
              <p className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">Voted by Users</p>
            </div>
          </div>
          <Link href="/" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
        </header>

        <div className="p-2.5 sm:p-4 bg-indigo-600 rounded-xl sm:rounded-2xl text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-between shadow-lg shadow-indigo-200">
           <span className="truncate mr-2">{mode}</span>
           <div className="flex items-center gap-2">
              <span className="opacity-60 text-[7px]">{config.totalParticipants} SIGNALS</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
           </div>
        </div>

        {/* Live Goal Tracker */}
        <div className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl transition-all ${isNaija ? 'bg-gradient-to-br from-green-600 to-indigo-950' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Active Session</span>
            <div className="bg-white/20 px-2 py-1 rounded-md text-[8px] font-black uppercase">Consensus Goal</div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight tracking-tight uppercase italic">
            {steps.toLocaleString()} <span className="text-sm opacity-60 not-italic">Steps</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
             <div className="flex justify-between text-[8px] sm:text-[10px] font-black opacity-80 uppercase">
                <span>Daily Target: 10k</span>
                <span>{Math.round((steps/10000)*100)}%</span>
             </div>
             <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${(steps/10000)*100}%` }}></div>
             </div>
          </div>
        </div>

        {/* Music Section - Interactive */}
        <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex items-center gap-3 sm:gap-4 group hover:border-indigo-200 transition-all">
          <div className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${isNaija ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'} flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden`}>
            {isPlaying && <div className="absolute inset-0 bg-current opacity-10 animate-ping"></div>}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${isPlaying ? 'animate-bounce' : ''} sm:w-7 sm:h-7 transition-all`}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              Audio Driver
              <span className="text-[7px] bg-gray-100 px-1 py-0.5 rounded text-gray-500 tracking-normal">Chosen by {config.totalParticipants > 0 ? 'Majority' : 'Data'}</span>
            </h3>
            <p className="font-black text-gray-900 text-xs sm:text-base truncate leading-tight mt-0.5">{config.suggestedMusic}</p>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all flex-shrink-0 ${isPlaying ? 'bg-red-500 shadow-red-100' : 'bg-indigo-600 shadow-indigo-100'}`}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
        </div>

        {/* Feature: Leaderboard (Voted by Users) */}
        {config.showLeaderboard && (
          <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <div>
                <h3 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{isNaija ? 'Lagos Speed Rank' : 'Global Rankings'}</h3>
                <p className="text-[7px] font-bold text-indigo-500 mt-0.5">HIGH DEMAND: {config.leaderboardVotes}% OF USERS</p>
              </div>
              <span className="text-[7px] sm:text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100">Live Sync</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'Research Majority', score: 'Top Choice', img: '🔥' },
                { name: 'You (Current)', score: `${(steps/1000).toFixed(1)}k`, img: '👤', active: true }
              ].map((user, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${user.active ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center text-xs sm:text-sm shadow-sm border border-gray-100 flex-shrink-0">{user.img}</div>
                  <span className="flex-1 font-black text-[11px] sm:text-sm text-gray-700 truncate">{user.name}</span>
                  <span className="font-black text-[8px] sm:text-[9px] text-indigo-600 uppercase flex-shrink-0 tracking-tighter">{user.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature: Rewards (Voted by Users) */}
        {config.showRewards && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-dashed ${isNaija ? 'border-green-200 bg-green-50/50' : 'border-indigo-100 bg-indigo-50/50'} flex flex-col items-center justify-center text-center`}>
              <span className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{isNaija ? '👑' : '🏆'}</span>
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">VOTED REWARD</span>
              <span className="font-black text-gray-900 text-[10px] sm:text-sm leading-tight mt-1.5">{isNaija ? 'Naija Giant' : 'Top Tier'}</span>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl mb-1.5 sm:mb-2">⚡</span>
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">REALTIME</span>
              <span className="font-black text-indigo-600 text-base sm:text-lg mt-1.5">{points.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Action Button - Interactive */}
        <div className="space-y-3">
          <button 
            onClick={logActivity}
            className={`w-full py-5 sm:py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-white shadow-2xl active:scale-95 transition-all text-sm sm:text-base ${isNaija ? 'bg-orange-500 shadow-orange-200 hover:bg-orange-600' : 'bg-black shadow-gray-200 hover:bg-gray-900'}`}
          >
            Record 500 Steps
          </button>
          
          {logs.length > 0 && (
            <div className="space-y-1 animate-in slide-in-from-top-2">
              {logs.map((log, i) => (
                <div key={i} className="text-[8px] font-bold text-green-600 uppercase text-center tracking-widest opacity-60">{log}</div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center space-y-1.5 pb-6 sm:pb-12 border-t border-gray-100 pt-6">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
             Objective (iii): Functional Tool Execution
           </p>
           <p className="text-[6px] sm:text-[8px] text-gray-300 font-medium max-w-[200px] sm:max-w-xs mx-auto leading-relaxed px-4 italic">
             This implementation reflects the highest number of choices from {config.totalParticipants} research participants.
           </p>
        </div>
      </div>
    </div>
  );
}
