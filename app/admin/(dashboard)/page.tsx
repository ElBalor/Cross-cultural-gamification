import { getAllSurveyResponses, getAllInterviewResponses } from "@/lib/db";
import Link from "next/link";
import DashboardTabs from "./DashboardTabs";
import AIInsightsView from "./AIInsightsView";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  const interviews = await getAllInterviewResponses().catch(() => []);

  const submissionsView = (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Survey Responses Section */}
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/50">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <h2 className="text-sm sm:text-base font-black text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
            Surveys
          </h2>
          <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 bg-indigo-600 text-white rounded-md uppercase tracking-wider">{surveys.length} Logs</span>
        </div>
        
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-gray-50">
          {surveys.length === 0 ? (
            <div className="p-10 text-center text-[10px] text-gray-400 font-black uppercase italic tracking-[0.2em]">Awaiting Signals...</div>
          ) : (
            surveys.map((survey: any) => {
              const sa = survey.section_a || {};
              const sentiment = survey.ml_metadata?.sentiment || { label: 'neutral' };
              return (
                <div key={survey.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100 uppercase">{sa.gender?.[0] || '?'}</div>
                      <div>
                        <div className="text-xs font-black text-gray-900 leading-tight">{sa.age || 'N/A'} yrs — {sa.country || 'N/A'}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{new Date(survey.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                      sentiment.label === 'positive' ? 'bg-green-100 text-green-700' : 
                      sentiment.label === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>{sentiment.label}</span>
                  </div>
                  <Link href={`/admin/survey/${survey.id}`} className="block w-full text-center py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all border border-indigo-100/50">
                    View Trace
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Sentiment</th>
                <th scope="col" className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {surveys.map((survey: any) => {
                const sa = survey.section_a || {};
                const sentiment = survey.ml_metadata?.sentiment || { label: 'neutral' };
                return (
                  <tr key={survey.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-200 shadow-inner">{sa.gender?.[0] || '?'}</div>
                         <div>
                            <div className="text-sm font-bold text-gray-900">{sa.age || 'N/A'} yrs</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">{sa.gender || 'N/A'}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-gray-700">{sa.country || 'N/A'}</div>
                      <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">{new Date(survey.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        sentiment.label === 'positive' ? 'bg-green-100 text-green-700' : 
                        sentiment.label === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>{sentiment.label}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/admin/survey/${survey.id}`} className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all inline-flex shadow-sm border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interview Section */}
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/50">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <h2 className="text-sm sm:text-base font-black text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Interviews
          </h2>
          <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 bg-purple-500 text-white rounded-md uppercase tracking-wider">{interviews.length} Logs</span>
        </div>
        
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-gray-50">
          {interviews.length === 0 ? (
            <div className="p-10 text-center text-[10px] text-gray-400 font-black uppercase italic tracking-[0.2em]">Awaiting Voice Signals...</div>
          ) : (
            interviews.map((interview: any) => {
              const resp = interview.responses || {};
              return (
                <div key={interview.id} className="p-4 space-y-4">
                  <div>
                    <div className="text-[9px] font-black text-gray-900 uppercase tracking-tighter mb-1">{new Date(interview.created_at).toLocaleDateString()} — RESP-{interview.id}</div>
                    <div className="text-xs text-gray-600 font-medium line-clamp-2 italic">"{resp.cultureReflection || 'N/A'}"</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {interview.ml_metadata?.culturalKeywords?.slice(0, 3).map((kw: string) => (
                        <span key={kw} className="text-[8px] font-black px-1 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 uppercase tracking-tighter">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/admin/interview/${interview.id}`} className="block w-full text-center py-2.5 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all border border-purple-100/50">
                    Analyze Depth
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Neural Summary</th>
                <th scope="col" className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {interviews.map((interview: any) => {
                const resp = interview.responses || {};
                return (
                  <tr key={interview.id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-gray-900">{new Date(interview.created_at).toLocaleDateString()}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: RESP-{interview.id}</div>
                    </td>
                    <td className="px-6 py-5 max-w-md">
                      <div className="text-sm text-gray-700 font-medium line-clamp-1 italic">"{resp.cultureReflection || 'N/A'}"</div>
                      <div className="mt-1 flex gap-1">
                        {interview.ml_metadata?.culturalKeywords?.slice(0, 3).map((kw: string) => (
                          <span key={kw} className="text-[9px] font-black px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 uppercase">{kw}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <Link href={`/admin/interview/${interview.id}`} className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-purple-600 hover:text-white transition-all inline-flex shadow-sm border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M13 8H7"/><path d="M10 12H7"/></svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
         <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200 shadow-sm mx-auto lg:mx-0">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
               </span>
               Core Active
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter leading-tight">Research Core</h1>
            <p className="text-xs sm:text-base text-gray-500 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">Neural analysis of cross-cultural gamification patterns and behavioral motivation signals.</p>
         </div>
         <div className="flex gap-2 sm:gap-4 w-full lg:w-auto">
             <div className="flex-1 lg:flex-none bg-white p-4 sm:p-5 rounded-3xl shadow-xl border border-white flex flex-col items-center justify-center min-w-0 lg:min-w-[140px] transform transition-transform hover:scale-105">
                 <span className="text-xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">{surveys.length}</span>
                 <span className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Surveys</span>
             </div>
             <div className="flex-1 lg:flex-none bg-white p-4 sm:p-5 rounded-3xl shadow-xl border border-white flex flex-col items-center justify-center min-w-0 lg:min-w-[140px] transform transition-transform hover:scale-105">
                 <span className="text-xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 leading-none">{interviews.length}</span>
                 <span className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Interviews</span>
             </div>
         </div>
      </div>

      <div className="px-0 sm:px-0">
        <DashboardTabs 
          submissions={submissionsView} 
          aiInsights={<AIInsightsView />} 
        />
      </div>
    </div>
  );
}