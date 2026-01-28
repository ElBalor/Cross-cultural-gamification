"use client";

import { useState, FormEvent } from "react";
import { submitInterview } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50/50">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">
              Deep Interview
            </h1>
            <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">
              Qualitative Behavioral Analysis
            </p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          <div className="mb-10 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-indigo-700 text-sm font-medium italic">
              "Your detailed responses allow our neural engines to map cultural fitness motivations more accurately. Please be as descriptive as possible."
            </p>
          </div>

          <div className="space-y-12">
            {questions.map((category, catIndex) => (
              <section
                key={catIndex}
                className="pb-10 border-b border-gray-100 last:border-0"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-gray-200">
                  {category.category}
                </div>

                <div className="space-y-8">
                  {category.items.map((item) => (
                    <div key={item.number} className="space-y-4">
                      <label className="block text-gray-700 font-bold text-base sm:text-lg leading-tight">
                        <span className="text-indigo-600 mr-2">Q{item.number}.</span> {item.question}
                      </label>
                      <textarea
                        name={item.field}
                        rows={4}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium text-sm sm:text-base placeholder:text-gray-300"
                        placeholder="Neural signal processing requires text input here..."
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="pt-10 border-t border-gray-100 mt-10 flex flex-col sm:flex-row justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-center transition-all hover:bg-gray-200"
            >
              Abort Mission
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Uploading..." : "Submit Intelligence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
