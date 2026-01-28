import { 
  analyzeClusters, 
  analyzeFeatureImportance, 
  analyzeCulturalPatterns, 
  analyzeSentiment 
} from "@/lib/analysis";

export default async function AIInsightsView() {
  const [clusters, features, cultural, sentiment] = await Promise.all([
    analyzeClusters(),
    analyzeFeatureImportance(),
    analyzeCulturalPatterns(),
    analyzeSentiment()
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sentiment & Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Sentiment Analysis
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
              <span className="block text-2xl font-bold text-green-600">{sentiment.distribution.positive}</span>
              <span className="text-xs font-semibold text-green-700 uppercase">Positive</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="block text-2xl font-bold text-gray-600">{sentiment.distribution.neutral}</span>
              <span className="text-xs font-semibold text-gray-700 uppercase">Neutral</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-50 border border-red-100">
              <span className="block text-2xl font-bold text-red-600">{sentiment.distribution.negative}</span>
              <span className="text-xs font-semibold text-red-700 uppercase">Negative</span>
            </div>
          </div>
          <div className="mt-8">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Overall Satisfaction Score</span>
                <span className="text-sm font-bold text-indigo-600">{Math.round(sentiment.averageScore * 100)}%</span>
             </div>
             <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" 
                  style={{ width: `${Math.max(0, Math.min(100, (sentiment.averageScore + 1) * 50))}%` }}
                />
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4">AI Feature Rank</h3>
            <p className="text-xs opacity-80 mb-6 uppercase tracking-widest font-semibold">Top Priority Element</p>
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 mb-4 transform transition-transform group-hover:scale-105">
               <span className="text-xs font-bold block opacity-70 uppercase">#1 Preferred</span>
               <span className="text-xl font-black capitalize tracking-tight">
                 {features.mostImportant?.replace(/([A-Z])/g, ' $1').trim() || 'No Data'}
               </span>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Based on neural embedding analysis, users in this cultural segment value this feature most for engagement.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12 transition-transform group-hover:rotate-45 duration-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
        </div>
      </div>

      {/* Clusters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.63 3 12"/><polyline points="21 12 16.5 14.63 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Neuro-Symbolic Clusters
          </h3>
          <div className="space-y-4">
            {clusters.clusters?.length > 0 ? (
              clusters.clusters.map((cluster: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all group shadow-sm hover:shadow-md">
                   <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-700">Persona {idx + 1}</span>
                      <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">{cluster.size} Users</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                         <span className="block text-[10px] text-gray-400 font-bold uppercase">Engagement</span>
                         <span className="text-sm font-black text-indigo-500">{Math.round(cluster.characteristics.averageEngagement * 20)}%</span>
                      </div>
                      <div className="text-center">
                         <span className="block text-[10px] text-gray-400 font-bold uppercase">Activity</span>
                         <span className="text-sm font-black text-purple-500">{cluster.characteristics.averageActivityLevel.toFixed(1)}d</span>
                      </div>
                      <div className="text-center">
                         <span className="block text-[10px] text-gray-400 font-bold uppercase">Culture</span>
                         <span className="text-sm font-black text-pink-500">{Math.round(cluster.characteristics.culturalInterestRate * 100)}%</span>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 italic">
                Gather more data to unlock clustering analysis...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Cultural Patterns
          </h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {cultural.culturalKeywords.length > 0 ? (
              cultural.culturalKeywords.map((kw: any, idx: number) => (
                <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-200 shadow-sm animate-pulse-slow">
                  {kw.keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">No cultural patterns detected yet.</span>
            )}
          </div>
          
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Motivation Distribution</h4>
             <div className="space-y-3">
                {Object.entries(cultural.culturalMotivation).map(([key, val]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-600 uppercase">{key}</span>
                      <span className="text-gray-900">{val} responses</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full border border-gray-100 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${key === 'Yes' ? 'bg-green-500' : key === 'Maybe' ? 'bg-orange-400' : 'bg-gray-400'}`} 
                        style={{ width: `${(val / Math.max(cultural.totalResponses, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
