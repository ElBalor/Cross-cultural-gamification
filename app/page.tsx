import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-3 sm:p-6 lg:p-12 bg-[#f8fafc] relative overflow-hidden">
      {/* Subtle light blobs for depth */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-100 rounded-full blur-[80px] sm:blur-[120px] opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-100 rounded-full blur-[80px] sm:blur-[120px] opacity-50 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 sm:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 border border-white/20">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Protocol Active
            </div>
            <h1 className="text-2xl sm:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight uppercase">
              Cross-Cultural <br/><span className="text-indigo-200">Fitness Intelligence</span>
            </h1>
            <p className="text-xs sm:text-lg text-indigo-50/80 max-w-2xl mx-auto font-medium leading-relaxed px-4">
              Neural mapping of motivation triggers to architect the future of gamified health tools.
            </p>
          </div>
          
          <div className="p-5 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 hidden lg:block">
                <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Objectives</h2>
                <ul className="space-y-4">
                  {[
                    "Map behavioral triggers.",
                    "Nigerian context tailoring.",
                    "Neural-symbolic testing.",
                    "Consistency impact analysis."
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] flex-shrink-0">0{i+1}</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="p-1 bg-gray-50/50 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col gap-1.5 sm:gap-2 border border-gray-100">
                  <Link
                    href="/survey"
                    className="flex items-center justify-between w-full bg-indigo-600 text-white px-5 sm:px-8 py-4 sm:py-5 rounded-[1.25rem] sm:rounded-2xl font-black text-sm sm:text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100"
                  >
                    Take Survey
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Link>
                  <Link
                    href="/interview"
                    className="flex items-center justify-between w-full bg-white text-indigo-600 px-5 sm:px-8 py-4 sm:py-5 rounded-[1.25rem] sm:rounded-2xl font-black text-sm sm:text-lg hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-100"
                  >
                    Deep Interview
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[1.5rem] sm:rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <Link
                    href="/gamification-tool"
                    className="relative flex items-center justify-between w-full bg-gray-900 text-white px-5 sm:px-8 py-5 sm:py-6 rounded-[1.25rem] sm:rounded-2xl font-black text-sm sm:text-lg hover:bg-black active:scale-[0.98] transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      Cross-Cultural Tool
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 18h.01"/></svg>
                  </Link>
                </div>

                <div className="pt-6 flex justify-between gap-2 sm:gap-4">
                   <div className="text-center flex-1">
                      <span className="block text-gray-900 font-black text-xs sm:text-sm uppercase tracking-tight">100%</span>
                      <span className="text-[7px] sm:text-[8px] text-gray-400 font-black uppercase tracking-widest">Secure</span>
                   </div>
                   <div className="text-center flex-1 border-x border-gray-100 px-1">
                      <span className="block text-gray-900 font-black text-xs sm:text-sm uppercase tracking-tight">AI-Driven</span>
                      <span className="text-[7px] sm:text-[8px] text-gray-400 font-black uppercase tracking-widest">Engine</span>
                   </div>
                   <div className="text-center flex-1">
                      <span className="block text-gray-900 font-black text-xs sm:text-sm uppercase tracking-tight">Realtime</span>
                      <span className="text-[7px] sm:text-[8px] text-gray-400 font-black uppercase tracking-widest">Sync</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}