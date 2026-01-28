import { getAllSurveyResponses, getAllInterviewResponses } from "@/lib/db";
import { mlEncoder } from "@/lib/ml-encoder";

export async function getOverview() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  const interviews = await getAllInterviewResponses().catch(() => []);

  const totalResponses = surveys.length + interviews.length;
  const avgSentiment = calculateAverageSentiment(surveys, interviews);
  const culturalMentions = countCulturalMentions(surveys, interviews);

  return {
    totalResponses,
    surveyCount: surveys.length,
    interviewCount: interviews.length,
    averageSentiment: avgSentiment,
    culturalMentions,
    timestamp: new Date().toISOString(),
  };
}

export async function analyzeClusters() {
  const surveys = await getAllSurveyResponses().catch(() => []);

  const embeddings = surveys
    .filter((s: any) => s.embeddings?.responseVector?.values)
    .map((s: any) => ({
      values: s.embeddings.responseVector.values,
      dimension: s.embeddings.responseVector.dimension,
    }));

  if (embeddings.length < 3) {
    return {
      clusters: [],
      message: "Need at least 3 responses for clustering",
    };
  }

  const k = Math.min(5, Math.floor(embeddings.length / 3));
  const clusterAssignments = await mlEncoder.clusterResponses(embeddings, k);

  const clusters = Array.from({ length: k }, (_, i) => {
    const clusterIndices = clusterAssignments
      .map((cluster, idx) => (cluster === i ? idx : -1))
      .filter((idx) => idx !== -1);

    const clusterSurveys = clusterIndices.map((idx) => surveys[idx]);

    return {
      clusterId: i,
      size: clusterIndices.length,
      characteristics: analyzeClusterCharacteristics(clusterSurveys),
      surveys: clusterIndices,
    };
  });

  return {
    clusters,
    totalClusters: k,
    totalResponses: embeddings.length,
  };
}

export async function analyzeFeatureImportance() {
  const surveys = await getAllSurveyResponses().catch(() => []);

  const featureScores: Record<
    string,
    { sum: number; count: number; avg: number }
  > = {
    pointsRewards: { sum: 0, count: 0, avg: 0 },
    leaderboards: { sum: 0, count: 0, avg: 0 },
    progressTracking: { sum: 0, count: 0, avg: 0 },
    achievements: { sum: 0, count: 0, avg: 0 },
    personalizedChallenges: { sum: 0, count: 0, avg: 0 },
    socialSharing: { sum: 0, count: 0, avg: 0 },
    dailyStreaks: { sum: 0, count: 0, avg: 0 },
    unlockableContent: { sum: 0, count: 0, avg: 0 },
  };

  surveys.forEach((survey: any) => {
    const sectionB = survey.section_b;
    Object.keys(featureScores).forEach((feature: string) => {
      if (sectionB[feature] && typeof sectionB[feature] === "number") {
        featureScores[feature].sum += sectionB[feature] as number;
        featureScores[feature].count++;
      }
    });
  });

  Object.keys(featureScores).forEach((feature) => {
    if (featureScores[feature].count > 0) {
      featureScores[feature].avg =
        featureScores[feature].sum / featureScores[feature].count;
    }
  });

  const sortedFeatures = Object.entries(featureScores)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.avg - a.avg);

  return {
    features: sortedFeatures,
    mostImportant: sortedFeatures[0]?.name,
    leastImportant: sortedFeatures[sortedFeatures.length - 1]?.name,
  };
}

export async function analyzeCulturalPatterns() {
  const surveys = await getAllSurveyResponses().catch(() => []);

  const culturalKeywords: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const culturalMotivation: Record<string, number> = {
    Yes: 0,
    No: 0,
    Maybe: 0,
  };

  surveys.forEach((survey: any) => {
    if (survey.section_a?.country) {
      countries[survey.section_a.country] =
        (countries[survey.section_a.country] || 0) + 1;
    }

    if (survey.section_c?.culturalMotivation) {
      culturalMotivation[survey.section_c.culturalMotivation] =
        (culturalMotivation[survey.section_c.culturalMotivation] || 0) + 1;
    }

    if (survey.ml_metadata?.culturalKeywords) {
      survey.ml_metadata.culturalKeywords.forEach((keyword: string) => {
        culturalKeywords[keyword] = (culturalKeywords[keyword] || 0) + 1;
      });
    }
  });

  return {
    culturalKeywords: Object.entries(culturalKeywords)
      .sort(([, a], [, b]) => b - a)
      .map(([keyword, count]) => ({ keyword, count })),
    countries: Object.entries(countries)
      .sort(([, a], [, b]) => b - a)
      .map(([country, count]) => ({ country, count })),
    culturalMotivation,
    totalResponses: surveys.length,
  };
}

export async function analyzeSentiment() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  const interviews = await getAllInterviewResponses().catch(() => []);

  const sentimentDistribution = { positive: 0, neutral: 0, negative: 0 };
  let totalSentiment = 0;
  let count = 0;

  const allResponses = [...surveys, ...interviews];
  allResponses.forEach((response: any) => {
    if (response.ml_metadata?.sentiment) {
      const sentiment = response.ml_metadata.sentiment;
      const label = sentiment.label as keyof typeof sentimentDistribution;
      if (label in sentimentDistribution) {
        sentimentDistribution[label]++;
      }
      totalSentiment += sentiment.score;
      count++;
    }
  });

  return {
    distribution: sentimentDistribution,
    averageScore: count > 0 ? totalSentiment / count : 0,
    totalAnalyzed: count,
  };
}

function calculateAverageSentiment(surveys: any[], interviews: any[]): number {
  let total = 0;
  let count = 0;

  const allResponses = [...surveys, ...interviews];
  allResponses.forEach((response) => {
    if (response.ml_metadata?.sentiment?.score !== undefined) {
      total += response.ml_metadata.sentiment.score;
      count++;
    }
  });

  return count > 0 ? total / count : 0;
}

function countCulturalMentions(surveys: any[], interviews: any[]): number {
  let count = 0;

  const allResponses = [...surveys, ...interviews];
  allResponses.forEach((response) => {
    if (response.ml_metadata?.culturalKeywords) {
      count += response.ml_metadata.culturalKeywords.length;
    }
  });

  return count;
}

function analyzeClusterCharacteristics(clusterSurveys: any[]) {
  if (clusterSurveys.length === 0) return {};

  const avgActivity =
    clusterSurveys
      .map((s: any) => {
        const freq = s.section_a?.activityFrequency;
        if (freq === "5+ days") return 5;
        if (freq === "3-4 days") return 3.5;
        if (freq === "1-2 days") return 1.5;
        return 0;
      })
      .reduce((a: number, b: number) => a + b, 0) / clusterSurveys.length;

  const avgEngagement =
    clusterSurveys
      .map((s: any) => {
        const sectionD = s.section_d || {};
        return (
          ((sectionD.consistency || 0) +
            (sectionD.enjoyment || 0) +
            (sectionD.visualProgress || 0) +
            (sectionD.competition || 0)) /
          4
        );
      })
      .reduce((a: number, b: number) => a + b, 0) / clusterSurveys.length;

  const culturalInterest =
    clusterSurveys.filter((s: any) => s.section_c?.culturalMotivation === "Yes")
      .length / clusterSurveys.length;

  return {
    averageActivityLevel: avgActivity,
    averageEngagement: avgEngagement,
    culturalInterestRate: culturalInterest,
    size: clusterSurveys.length,
  };
}
