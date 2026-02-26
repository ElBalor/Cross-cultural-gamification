import { getPublicRatingsSummary, getRecentRatings, getRatingsByActivity } from '@/lib/db';
import RatingModal from '@/components/RatingModal';

export default async function RatingsPage() {
  const [summary, recentRatings, byActivity] = await Promise.all([
    getPublicRatingsSummary(),
    getRecentRatings(20),
    getRatingsByActivity()
  ]);

  const totalRatings = summary?.total_ratings || 0;
  const avgOverall = parseFloat(summary?.avg_overall) || 0;
  const recommendPercent = totalRatings > 0 
    ? Math.round(((summary?.recommend_count || 0) / totalRatings) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            ⭐ Community Ratings
          </h1>
          <p className="text-gray-600">See what users are saying about the app</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center border-2 border-yellow-200">
            <div className="text-5xl font-black text-yellow-600 mb-2">
              {avgOverall.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 font-bold mb-2">out of 5</div>
            <div className="text-2xl mb-1">
              {'⭐'.repeat(Math.round(avgOverall))}
            </div>
            <div className="text-xs text-gray-400 font-bold">{totalRatings} ratings</div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 text-center border-2 border-green-200">
            <div className="text-5xl font-black text-green-600 mb-2">
              {recommendPercent}%
            </div>
            <div className="text-sm text-gray-500 font-bold mb-2">Would Recommend</div>
            <div className="text-3xl mb-1">👍</div>
            <div className="text-xs text-gray-400 font-bold">
              {summary?.recommend_count || 0} users
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 text-center border-2 border-purple-200">
            <div className="text-5xl font-black text-purple-600 mb-2">
              {byActivity.length}
            </div>
            <div className="text-sm text-gray-500 font-bold mb-2">Activities Rated</div>
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-xs text-gray-400 font-bold">Survey, Tool, Steps</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-widest">Rating Breakdown</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-600">Ease of Use</span>
                <span className="text-indigo-600">{summary?.avg_ease_of_use || '0'}/5</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                  style={{ width: `${((parseFloat(summary?.avg_ease_of_use || '0') || 0) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-600">Features Quality</span>
                <span className="text-purple-600">{summary?.avg_features || '0'}/5</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${((parseFloat(summary?.avg_features || '0') || 0) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-600">Cultural Relevance</span>
                <span className="text-green-600">{summary?.avg_cultural || '0'}/5</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all"
                  style={{ width: `${((parseFloat(summary?.avg_cultural || '0') || 0) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ratings by Activity */}
        {byActivity.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-widest">By Activity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {byActivity.map((activity: any) => (
                <div key={activity.activity_type} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center border border-gray-200">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2">{activity.activity_type}</div>
                  <div className="text-3xl font-black text-indigo-600 mb-1">
                    {(activity.avg_rating || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400 font-bold">{activity.count} ratings</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Feedback */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-widest">Recent Feedback</h2>
          
          <div className="space-y-4">
            {recentRatings.map((rating: any, index: number) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-yellow-500 text-lg">
                      {'⭐'.repeat(rating.overall_rating)}
                    </div>
                    {rating.activity_type && (
                      <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                        {rating.activity_type}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </div>
                </div>
                {rating.feedback_text && (
                  <p className="text-gray-700 text-sm italic">"{rating.feedback_text}"</p>
                )}
                {rating.would_recommend !== null && (
                  <div className="mt-2 text-xs font-bold">
                    {rating.would_recommend ? '👍 Would recommend' : '👎 Would not recommend'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {recentRatings.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-bold">No feedback yet</p>
              <p className="text-sm">Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">
            Share Your Experience!
          </div>
          <p className="text-gray-600 text-sm mt-4 font-bold">
            Click the ⭐ button in the corner to rate the app
          </p>
        </div>
      </div>
    </div>
  );
}
