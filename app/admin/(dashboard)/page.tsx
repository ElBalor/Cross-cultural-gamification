import { getAllSurveyResponses, getAllInterviewResponses } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  const interviews = await getAllInterviewResponses().catch(() => []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and view all research submissions.</p>
         </div>
         <div className="flex gap-3">
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-center">
                 <span className="block text-xs text-gray-500 font-medium uppercase">Total Surveys</span>
                 <span className="text-xl font-bold text-indigo-600">{surveys.length}</span>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-center">
                 <span className="block text-xs text-gray-500 font-medium uppercase">Total Interviews</span>
                 <span className="text-xl font-bold text-purple-600">{interviews.length}</span>
             </div>
         </div>
      </div>

      {/* Survey Responses Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
            Survey Responses
          </h2>
          <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{surveys.length} submissions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demographics</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Motivation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likelihood</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {surveys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No survey responses found yet.
                  </td>
                </tr>
              ) : (
                surveys.map((survey: any) => {
                  const sa = survey.section_a || {};
                  const sc = survey.section_c || {};
                  const sd = survey.section_d || {};
                  
                  return (
                    <tr key={survey.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(survey.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="font-medium text-gray-900">{sa.country || 'N/A'}</div>
                        <div className="text-xs opacity-75">{sa.age || 'N/A'}, {sa.gender || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={sc.culturalMotivation}>
                        {sc.culturalMotivation || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sd.likelihood?.includes('Very Likely') ? 'bg-green-100 text-green-700' : 
                          sd.likelihood?.includes('Likely') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {sd.likelihood || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <Link href={`/admin/survey/${survey.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 group-hover:underline">
                          View
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interview Responses Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Interview Responses
          </h2>
          <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{interviews.length} submissions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Insight</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nigerian Elements</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No interview responses found yet.
                  </td>
                </tr>
              ) : (
                interviews.map((interview: any) => {
                  const resp = interview.responses || {};
                  
                  return (
                    <tr key={interview.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(interview.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={resp.cultureReflection}>
                        {resp.cultureReflection || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={resp.nigerianElements}>
                        {resp.nigerianElements || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                         <Link href={`/admin/interview/${interview.id}`} className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-1 group-hover:underline">
                          View
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
