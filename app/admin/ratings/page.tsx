import { getAllAppRatings, getAppRatingsSummary, getRatingsByActivity } from '@/lib/db';
import Link from 'next/link';

export default async function RatingsAdminPage() {
  const [summary, ratings, byActivity] = await Promise.all([
    getAppRatingsSummary(),
    getAllAppRatings(),
    getRatingsByActivity()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-indigo-600 font-bold text-sm hover:underline mb-2 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-black text-gray-900">App Ratings & Feedback</h1>
          <p className="text-gray-600 mt-2">User ratings and feedback from all activities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Ratings</p>
            <p className="text-4xl font-black text-indigo-600">{summary?.total_ratings || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Avg Overall</p>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-black text-yellow-600">{(summary?.avg_overall || 0).toFixed(1)}</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">out of 5</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Recommendation Rate</p>
            <p className="text-4xl font-black text-green-600">
              {summary?.recommend_count && summary.total_ratings 
                ? Math.round((summary.recommend_count / summary.total_ratings) * 100)
                : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summary?.recommend_count || 0} would recommend
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Avg Ease of Use</p>
            <p className="text-4xl font-black text-purple-600">{(summary?.avg_ease_of_use || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">out of 5</p>
          </div>
        </div>

        {/* Ratings by Activity */}
        {byActivity.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
            <h2 className="text-lg font-black text-gray-800 mb-4">Ratings by Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {byActivity.map((activity: any) => (
                <div key={activity.activity_type} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-600 uppercase mb-2">{activity.activity_type}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-indigo-600">{activity.count} ratings</p>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black text-yellow-600">{(activity.avg_rating || 0).toFixed(1)}</span>
                      <span className="text-sm">⭐</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Ratings Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-black text-gray-800">All Ratings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Activity</th>
                  <th className="text-center py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Overall</th>
                  <th className="text-center py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Ease</th>
                  <th className="text-center py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Features</th>
                  <th className="text-center py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Cultural</th>
                  <th className="text-center py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Recommend</th>
                  <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ratings.map((rating: any) => (
                  <tr key={rating.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                        {rating.activity_type || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg font-black text-yellow-600">{rating.overall_rating}</span>
                        <span className="text-sm">⭐</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-sm font-black ${
                        (rating.ease_of_use_rating || 0) >= 4 ? 'text-green-600' :
                        (rating.ease_of_use_rating || 0) >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {rating.ease_of_use_rating || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-sm font-black ${
                        (rating.features_rating || 0) >= 4 ? 'text-green-600' :
                        (rating.features_rating || 0) >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {rating.features_rating || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-sm font-black ${
                        (rating.cultural_relevance_rating || 0) >= 4 ? 'text-green-600' :
                        (rating.cultural_relevance_rating || 0) >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {rating.cultural_relevance_rating || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {rating.would_recommend !== null && (
                        <span className={`text-lg ${rating.would_recommend ? 'text-green-600' : 'text-red-600'}`}>
                          {rating.would_recommend ? '👍' : '👎'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {rating.feedback_text || <span className="text-gray-400 italic">No feedback</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {ratings.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-sm font-medium">No ratings yet. Ratings will appear here after users complete activities.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
