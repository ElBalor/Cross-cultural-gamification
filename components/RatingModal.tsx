'use client';

import { useState } from 'react';
import { submitAppRating } from '@/app/actions';

interface RatingModalProps {
  surveyResponseId?: number;
  activityType?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingModal({ surveyResponseId, activityType, isOpen, onClose }: RatingModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [easeOfUseRating, setEaseOfUseRating] = useState(0);
  const [featuresRating, setFeaturesRating] = useState(0);
  const [culturalRating, setCulturalRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (overallRating === 0) {
      alert('Please select an overall rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitAppRating({
        overallRating,
        easeOfUseRating: easeOfUseRating || undefined,
        featuresRating: featuresRating || undefined,
        culturalRelevanceRating: culturalRating || undefined,
        wouldRecommend: wouldRecommend || undefined,
        feedbackText,
        activityType,
        surveyResponseId
      });
      
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset form
        setOverallRating(0);
        setEaseOfUseRating(0);
        setFeaturesRating(0);
        setCulturalRating(0);
        setWouldRecommend(null);
        setFeedbackText('');
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your feedback helps improve our research.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-xl font-black uppercase tracking-widest">Rate Your Experience</h2>
              <p className="text-xs sm:text-sm opacity-80 mt-1">Help us improve the app!</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Overall Rating */}
              <div className="text-center">
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-4">
                  Overall Experience
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setOverallRating(rating)}
                      className={`text-4xl sm:text-5xl transition-all transform hover:scale-110 ${
                        rating <= (hoveredRating || overallRating)
                          ? 'text-yellow-400 drop-shadow-lg'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 font-bold">
                  {overallRating === 5 && 'Excellent!'}
                  {overallRating === 4 && 'Good'}
                  {overallRating === 3 && 'Okay'}
                  {overallRating === 2 && 'Poor'}
                  {overallRating === 1 && 'Very Poor'}
                </p>
              </div>

              {/* Additional Ratings */}
              <div className="space-y-6 bg-gray-50 rounded-2xl p-6">
                {/* Ease of Use */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
                    Ease of Use
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setEaseOfUseRating(rating)}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                          rating <= easeOfUseRating
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
                    Features Quality
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeaturesRating(rating)}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                          rating <= featuresRating
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cultural Relevance */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
                    Cultural Relevance
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setCulturalRating(rating)}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                          rating <= culturalRating
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Would Recommend */}
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-4">
                  Would you recommend this app?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setWouldRecommend(true)}
                    className={`py-4 rounded-2xl font-black transition-all ${
                      wouldRecommend === true
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    👍 Yes
                  </button>
                  <button
                    onClick={() => setWouldRecommend(false)}
                    className={`py-4 rounded-2xl font-black transition-all ${
                      wouldRecommend === false
                        ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    👎 No
                  </button>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">
                  Additional Feedback <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium text-sm"
                  placeholder="What did you like? What could be improved?"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || overallRating === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  isSubmitting || overallRating === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
