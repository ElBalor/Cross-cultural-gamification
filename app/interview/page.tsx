"use client";

import { useState, FormEvent } from "react";
import { submitInterview } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      category: "1. User Motivation & Behavior",
      items: [
        {
          number: 1,
          question:
            "What motivates you to exercise or stops you from exercising regularly?",
          field: "motivation",
        },
        {
          number: 2,
          question:
            "Have you used any fitness apps before? What did you like or dislike about them?",
          field: "previousApps",
        },
      ],
    },
    {
      category: "2. Gamification Features",
      items: [
        {
          number: 3,
          question:
            "What specific features would make you want to open a fitness app every day?",
          field: "dailyFeatures",
        },
        {
          number: 4,
          question:
            "Do rewards, badges, or competition motivate you? Why or why not?",
          field: "rewardsOpinion",
        },
        {
          number: 5,
          question:
            "How do you feel about social features like leaderboards or friend challenges?",
          field: "socialFeatures",
        },
      ],
    },
    {
      category: "3. Cultural Adaptation / Nigerian Context",
      items: [
        {
          number: 6,
          question:
            "Do you think fitness apps should reflect culture? If yes, in what ways?",
          field: "cultureReflection",
        },
        {
          number: 7,
          question:
            "What Nigerian specific elements (music, language, challenges, themes) would you love to see?",
          field: "nigerianElements",
        },
      ],
    },
    {
      category: "4. Tool Implementation (Prototype Feedback)",
      items: [
        {
          number: 8,
          question:
            "If we created a simple prototype of the app, what features should be included first?",
          field: "prototypeFeatures",
        },
        {
          number: 9,
          question: "What would make the app easy or difficult to use?",
          field: "usability",
        },
      ],
    },
    {
      category: "5. Impact on Motivation & Activity Levels",
      items: [
        {
          number: 10,
          question:
            "How do you think a well-designed fitness tool could change your daily activity habits?",
          field: "habitChange",
        },
        {
          number: 11,
          question:
            "What kind of reminders or motivational nudges would work best for you?",
          field: "reminders",
        },
      ],
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitInterview(formData);

      if (result.success) {
        router.push("/interview/success");
      } else {
        console.error("Interview submission error:", result.message);
        alert(
          result.message ||
            "Failed to submit interview responses. Please try again."
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Unexpected error submitting interview:", error);
      alert(
        "An unexpected error occurred. Please check the console for details and try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            🎤 Interview Questions
          </h1>
          <p className="text-sm sm:text-lg opacity-95">
            More In-Depth Insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          <div className="mb-4 sm:mb-6 text-gray-600 text-sm sm:text-base">
            <p>
              These questions provide deeper insights into your experiences and
              preferences. Please share your thoughts in detail.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-10 max-h-[70vh] overflow-y-auto pr-2 sm:pr-4">
            {questions.map((category, catIndex) => (
              <section
                key={catIndex}
                className="pb-6 sm:pb-8 border-b border-gray-200 last:border-0"
              >
                <h3 className="text-lg sm:text-xl font-bold text-indigo-600 mb-4 sm:mb-6">
                  {category.category}
                </h3>

                {category.items.map((item) => (
                  <div key={item.number} className="mb-6 sm:mb-8">
                    <label className="block text-gray-700 font-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                      {item.number}. {item.question}
                    </label>
                    <textarea
                      name={item.field}
                      rows={5}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none resize-y"
                      placeholder="Share your thoughts in detail..."
                    />
                  </div>
                ))}
              </section>
            ))}
          </div>

          <div className="pt-6 sm:pt-8 border-t border-gray-200 mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-300 transition-all"
            >
              Skip Interview
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-12 py-3 rounded-lg font-semibold text-sm sm:text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Interview Responses"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
