import { getSurveyResponseById } from "@/lib/db";
import { getPrototypeConfig, getConsensusConfig } from "@/lib/analysis";
import Link from "next/link";

export default async function GamificationToolPage({ 
  searchParams 
}: { 
  searchParams: { id?: string } 
}) {
  const id = searchParams.id ? parseInt(searchParams.id) : null;
  let surveyData = null;
  let config = null;
  let mode = "Consensus (Majority Choice)";
  
  if (id) {
    surveyData = await getSurveyResponseById(id);
    if (surveyData) {
      config = getPrototypeConfig(surveyData);
      mode = `Personalized (ID: ${id})`;
    }
  }

  // If no specific user ID or user not found, load the research consensus
  if (!config) {
    config = await getConsensusConfig();
  }

  const isNaija = config.theme === 'nigerian-vibrant';

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
              <p className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">Research Obj. III</p>
            </div>
          </div>
          <Link href="/" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
        </header>

        <div className="p-2.5 sm:p-4 bg-indigo-600 rounded-xl sm:rounded-2xl text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-between shadow-lg shadow-indigo-200">
           <span className="truncate mr-2">State: {mode}</span>
           <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
        </div>

        {/* Core Logic Section */}
        <div className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl ${isNaija ? 'bg-gradient-to-br from-green-600 to-indigo-950' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Research Protocol</span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-5 leading-tight tracking-tight uppercase">
            {isNaija ? 'Nigerian Scaling' : 'Global Adaptability'}
          </h2>
          <div className="space-y-3 sm:space-y-4">
             <div className="flex justify-between text-[8px] sm:text-[10px] font-black opacity-80 uppercase tracking-tighter sm:tracking-normal">
                <span>Engagement Yield</span>
                <span>84%</span>
             </div>
             <div className="w-full h-1.5 sm:h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[84%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
             </div>
          </div>
          <p className="mt-5 text-[11px] sm:text-sm font-bold opacity-90 leading-relaxed px-0.5">
            {isNaija 
              ? "Optimized for the Nigerian manifold using collective challenges." 
              : "Operating in a neutral global manifold for neutral health adoption."}
          </p>
        </div>

        {/* Music Section */}
        <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex items-center gap-3 sm:gap-4 group hover:border-indigo-200 transition-all">
          <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${isNaija ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'} flex items-center justify-center shadow-inner flex-shrink-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse sm:w-7 sm:h-7"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Audio Driver</h3>
            <p className="font-black text-gray-900 text-xs sm:text-base truncate leading-tight mt-0.5">{config.suggestedMusic}</p>
          </div>
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>

        {/* Feature: Leaderboard */}
        {config.showLeaderboard && (
          <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h3 className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{isNaija ? 'Speed Leaderboard' : 'Global Rankings'}</h3>
              <span className="text-[7px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded-md">Live Sync</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'Consensus', score: 'Top Choice', img: '🔥' },
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

        {/* Feature: Rewards */}
        {config.showRewards && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-dashed ${isNaija ? 'border-green-200 bg-green-50/50' : 'border-indigo-100 bg-indigo-50/50'} flex flex-col items-center justify-center text-center`}>
              <span className="text-lg sm:text-2xl mb-1.5 sm:mb-2">{isNaija ? '👑' : '🏆'}</span>
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">Unlocked</span>
              <span className="font-black text-gray-900 text-[10px] sm:text-sm leading-tight mt-0.5">{isNaija ? 'Naija Giant' : 'Top Tier'}</span>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col items-center justify-center text-center">
              <span className="text-lg sm:text-2xl mb-1.5 sm:mb-2">⚡</span>
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">Points</span>
              <span className="font-black text-indigo-600 text-sm sm:text-lg mt-0.5">2,450</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className={`w-full py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-white shadow-2xl active:scale-95 transition-all text-xs sm:text-base ${isNaija ? 'bg-green-600 shadow-green-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
          Initialize Tool
        </button>

        <div className="text-center space-y-1.5 pb-6 sm:pb-12">
           <p className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
             Cross-Cultural Gamification Tool — v1.0.0
           </p>
           <p className="text-[6px] sm:text-[8px] text-gray-300 font-medium max-w-[200px] sm:max-w-xs mx-auto leading-relaxed px-4 italic">
             Implementing design findings from Objectives (i) and (ii) to test health adoption.
           </p>
        </div>
      </div>
    </div>
  );
}