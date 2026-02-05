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

export interface ToolConfig {
  showLeaderboard: boolean;
  leaderboardVotes: number;
  showSocial: boolean;
  socialVotes: number;
  showRewards: boolean;
  rewardsVotes: number;
  theme: 'nigerian-vibrant' | 'minimalist' | 'classic' | 'western-modern' | 'pan-african';
  culturalContext: {
    leaderboardName: string;
    rewardName: string;
    musicGenre: string;
    locationSignal: string;
  };
  primaryFocus: string;
  suggestedMusic: string;
  totalParticipants: number;
}

function getContextByCountry(country: string = '') {
  const c = country.toLowerCase();
  
  if (c.includes('nigeria') || c.includes('naija')) {
    return {
      theme: 'nigerian-vibrant' as const,
      leaderboardName: 'Lagos Hustle',
      rewardName: 'Naija Giant',
      musicGenre: 'Afrobeats Motivation',
      locationSignal: 'West African Manifold'
    };
  }
  
  if (['ghana', 'kenya', 'south africa', 'ethiopia', 'africa'].some(name => c.includes(name))) {
    return {
      theme: 'pan-african' as const,
      leaderboardName: 'Pan-African Peak',
      rewardName: 'Savanna King',
      musicGenre: 'African Fusion',
      locationSignal: 'Continental Signal'
    };
  }

  if (['usa', 'uk', 'canada', 'europe', 'australia'].some(name => c.includes(name))) {
    return {
      theme: 'western-modern' as const,
      leaderboardName: 'Urban Sprint',
      rewardName: 'Peak Performer',
      musicGenre: 'Modern Pop Energy',
      locationSignal: 'Western Manifold'
    };
  }

  return {
    theme: 'classic' as const,
    leaderboardName: 'Global Rankings',
    rewardName: 'Top Tier',
    musicGenre: 'Global Top 50',
    locationSignal: 'Universal Protocol'
  };
}

export function getPrototypeConfig(surveyResponse: any): ToolConfig {
  const sb = surveyResponse.section_b || {};
  const sc = surveyResponse.section_c || {};
  const sd = surveyResponse.section_d || {};
  const country = surveyResponse.section_a?.country || '';

  const context = getContextByCountry(country);

  return {
    showLeaderboard: (sb.leaderboards || 0) >= 4,
    leaderboardVotes: 1, 
    showSocial: (sb.socialSharing || 0) >= 3,
    socialVotes: 1,
    showRewards: (sb.pointsRewards || 0) >= 4,
    rewardsVotes: 1,
    theme: context.theme,
    culturalContext: {
      leaderboardName: context.leaderboardName,
      rewardName: context.rewardName,
      musicGenre: context.musicGenre,
      locationSignal: context.locationSignal
    },
    primaryFocus: sd.visualProgress > sd.enjoyment ? 'Data Driven' : 'Experience Driven',
    suggestedMusic: context.musicGenre,
    totalParticipants: 1
  };
}

/**
 * Calculates the 'Consensus Design' based on aggregate research data.
 */
export async function getConsensusConfig(): Promise<ToolConfig> {
  const surveys = await getAllSurveyResponses();
  const interviews = await getAllInterviewResponses();
  const total = surveys.length + interviews.length;

  const [features, cultural] = await Promise.all([
    analyzeFeatureImportance(),
    analyzeCulturalPatterns()
  ]);

  // Majority country detection for consensus
  const topCountry = cultural.countries[0]?.country || 'Nigeria';
  const context = getContextByCountry(topCountry);

  const getVoteData = (name: string) => {
    const feature = features.features.find(f => f.name === name);
    return {
      show: (feature?.avg || 0) > 3.5,
      count: feature?.count || 0
    };
  };

  const leaderboard = getVoteData('leaderboards');
  const social = getVoteData('socialSharing');
  const rewards = getVoteData('pointsRewards');

  return {
    showLeaderboard: leaderboard.show,
    leaderboardVotes: Math.round((leaderboard.count / Math.max(total, 1)) * 100),
    showSocial: social.show,
    socialVotes: Math.round((social.count / Math.max(total, 1)) * 100),
    showRewards: rewards.show,
    rewardsVotes: Math.round((rewards.count / Math.max(total, 1)) * 100),
    theme: context.theme,
    culturalContext: {
      leaderboardName: context.leaderboardName,
      rewardName: context.rewardName,
      musicGenre: context.musicGenre,
      locationSignal: context.locationSignal
    },
    primaryFocus: 'Majority Choice',
    suggestedMusic: context.musicGenre,
    totalParticipants: total
  };
}
