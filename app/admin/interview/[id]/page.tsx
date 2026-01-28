import { getInterviewResponseById } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InterviewDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const interview = await getInterviewResponseById(id);
  if (!interview) notFound();

  const resp = interview.responses || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-purple-200">
             Voice Signal
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Qualitative Trace #{interview.id}</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Captured: {new Date(interview.created_at).toLocaleString()}</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border border-purple-50 hover:bg-purple-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-gradient-to-br from-purple-600 to-indigo-700 p-6 sm:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-black text-white/50 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/10 relative z-10">Intelligence Analysis</h3>
            <div className="space-y-8 relative z-10">
              <div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-3">Tone Vector</span>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/20 border border-white/20`}>
                    {interview.ml_metadata?.sentiment?.label || 'NEUTRAL'}
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    {Math.round((interview.ml_metadata?.sentiment?.score || 0) * 100)}% Satisfaction
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-3">Cultural Markers Identified</span>
                <div className="flex flex-wrap gap-2">
                  {interview.ml_metadata?.culturalKeywords?.map((kw: string) => (
                    <span key={kw} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                      {kw}
                    </span>
                  )) || <span className="text-xs italic opacity-50 font-medium">No cultural markers detected.</span>}
                </div>
              </div>
            </div>
         </div>
         <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-xl flex flex-col justify-center text-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Insights</span>
            <span className="text-6xl font-black text-purple-600 leading-none">{Object.keys(resp).length}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Data Points Captured</span>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] border border-white shadow-2xl">
        <h3 className="text-sm font-black text-purple-600 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-gray-100">Qualitative Registry</h3>
        <div className="space-y-12">
          {Object.entries(resp).map(([key, value]) => (
            <div key={key} className="space-y-4">
              <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </dt>
              <dd className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                "{String(value) || 'No response recorded.'}"
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
