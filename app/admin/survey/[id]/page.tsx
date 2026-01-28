import { getSurveyResponseById } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SurveyDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const survey = await getSurveyResponseById(id);
  if (!survey) notFound();

  const sa = survey.section_a || {};
  const sb = survey.section_b || {};
  const sc = survey.section_c || {};
  const sd = survey.section_d || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-200">
             Protocol Signal
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Survey Trace #{survey.id}</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Captured: {new Date(survey.created_at).toLocaleString()}</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border border-indigo-50 hover:bg-indigo-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demographics */}
        <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white shadow-xl">
          <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-gray-100">Profile Attributes</h3>
          <dl className="space-y-6">
            {[
              { label: "Age", value: sa.age },
              { label: "Gender", value: sa.gender },
              { label: "Location", value: sa.country },
              { label: "Activity Level", value: sa.activityFrequency }
            ].map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</dt>
                <dd className="text-base font-bold text-gray-900">{item.value || 'N/A'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* AI & Metadata */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 sm:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <h3 className="text-sm font-black text-white/50 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/10 relative z-10">Neural Metadata</h3>
          <div className="space-y-8 relative z-10">
            <div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-3">Sentiment Vector</span>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/20 border border-white/20`}>
                  {survey.ml_metadata?.sentiment?.label || 'NEUTRAL'}
                </span>
                <span className="text-2xl font-black tracking-tighter">
                  {Math.round((survey.ml_metadata?.sentiment?.score || 0) * 100)}% Confidence
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-3">Detected Markers</span>
              <div className="flex flex-wrap gap-2">
                {survey.ml_metadata?.culturalKeywords?.map((kw: string) => (
                  <span key={kw} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                    {kw}
                  </span>
                )) || <span className="text-xs italic opacity-50 font-medium">No cultural markers detected.</span>}
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] border border-white shadow-2xl space-y-12">
        {/* Feature Preferences */}
        <section>
          <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-gray-100 flex justify-between items-center">
            <span>Gamification Intensity</span>
            <span className="text-[10px] text-gray-400 font-bold">1.0 — 5.0 Rating</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(sb).map(([key, value]) => {
              if (key === 'favoriteFeatures') return null;
              return (
                <div key={key} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                  <dd className="flex items-center gap-3">
                    <span className="text-2xl font-black text-indigo-600">{String(value)}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500" style={{ width: `${(Number(value) / 5) * 100}%` }} />
                    </div>
                  </dd>
                </div>
              );
            })}
          </div>
          {sb.favoriteFeatures && (
            <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 italic font-medium text-gray-700">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2 not-italic">Qualitative Addendum:</span>
               "{sb.favoriteFeatures}"
            </div>
          )}
        </section>

        {/* Culture & Motivation */}
        <section>
          <h3 className="text-sm font-black text-purple-600 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-gray-100">Motivation Vectors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div>
                  <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cultural Motivation Pulse</dt>
                  <dd className="text-lg font-black text-gray-900">{sc.culturalMotivation || 'N/A'}</dd>
               </div>
               <div>
                  <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Barriers Encountered</dt>
                  <dd className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(sc.barriers) ? sc.barriers.map((b: string) => (
                      <span key={b} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 border border-gray-200">{b}</span>
                    )) : <span className="text-sm font-bold text-gray-900">{sc.barriers || 'None'}</span>}
                  </dd>
               </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cultural Elements Registry</dt>
               <dd className="text-sm font-medium text-gray-700 leading-relaxed italic">
                 {sc.culturalElements ? `"${sc.culturalElements}"` : 'No specific elements registered.'}
               </dd>
            </div>
          </div>
        </section>

        {/* Impact & Likelihood */}
        <section>
          <h3 className="text-sm font-black text-pink-600 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-gray-100">Behavioral Projections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Consistency Impact", value: sd.consistency, color: "text-blue-500" },
              { label: "Enjoyment Factor", value: sd.enjoyment, color: "text-green-500" },
              { label: "Visual Drive", value: sd.visualProgress, color: "text-orange-500" },
              { label: "Social Drive", value: sd.competition, color: "text-purple-500" }
            ].map((item) => (
              <div key={item.label} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                 <dt className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-2">{item.label}</dt>
                 <dd className={`text-3xl font-black ${item.color}`}>{item.value || '0'}</dd>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between p-8 bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl text-white">
            <div>
               <span className="text-[10px] font-black opacity-50 uppercase tracking-widest block mb-1">Adoption Probability</span>
               <span className="text-xl font-black uppercase tracking-tight">{sd.likelihood || 'Undefined'}</span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
