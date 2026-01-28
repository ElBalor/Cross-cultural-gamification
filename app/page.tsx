import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 bg-[#f8fafc] relative overflow-hidden">
      {/* Subtle light blobs for depth */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-100 rounded-full blur-[120px] opacity-50 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 sm:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 border border-white/20">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Protocol Active
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Cross-Cultural <br className="hidden sm:block"/><span className="text-indigo-200">Fitness Intelligence</span>
            </h1>
            <p className="text-sm sm:text-lg text-indigo-50/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Neural mapping of motivation triggers to architect the future of gamified health tools.
            </p>
          </div>
          
          <div className="p-6 sm:p-12">
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
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">0{i+1}</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <Link
                  href="/survey"
                  className="flex items-center justify-between w-full bg-indigo-600 text-white px-6 py-5 rounded-2xl font-black text-base sm:text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200"
                >
                  Take Survey
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
                <Link
                  href="/interview"
                  className="flex items-center justify-between w-full bg-gray-50 text-indigo-600 border-2 border-gray-100 px-6 py-5 rounded-2xl font-black text-base sm:text-lg hover:bg-gray-100 active:scale-95 transition-all"
                >
                  Interview
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </Link>
                <div className="pt-6 flex justify-between gap-4">
                   <div className="text-center flex-1">
                      <span className="block text-gray-900 font-black text-sm">100%</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase">Secure</span>
                   </div>
                   <div className="text-center flex-1 border-x border-gray-100">
                      <span className="block text-gray-900 font-black text-sm">AI</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase">Engine</span>
                   </div>
                   <div className="text-center flex-1">
                      <span className="block text-gray-900 font-black text-sm">LIVE</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase">Sync</span>
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






