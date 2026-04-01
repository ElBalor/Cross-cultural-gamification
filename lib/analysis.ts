import { getAllSurveyResponses, getAllInterviewResponses } from "@/lib/db";
import { mlEncoder } from "@/lib/ml-encoder";

// ============================================
// STATISTICAL ANALYSIS FUNCTIONS
// ============================================

/**
 * Calculate Cronbach's Alpha for reliability analysis
 * Used to measure internal consistency of survey scales
 */
export function calculateCronbachsAlpha(items: number[][], allowStandardized = false): number {
  const n = items.length; // Number of items
  if (n < 2) return 0;
  
  const k = items[0]?.length || 0; // Number of respondents
  if (k < 2) return 0;
  
  // Calculate variance for each item
  const itemVariances = items.map(item => {
    const mean = item.reduce((a, b) => a + b, 0) / item.length;
    const variance = item.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (item.length - 1);
    return variance;
  });
  
  // Calculate total score for each respondent
  const totalScores = new Array(k).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < k; j++) {
      totalScores[j] += items[i][j] || 0;
    }
  }
  
  // Calculate variance of total scores
  const totalMean = totalScores.reduce((a, b) => a + b, 0) / k;
  const totalVariance = totalScores.reduce((sum, val) => sum + Math.pow(val - totalMean, 2), 0) / (k - 1);
  
  if (totalVariance === 0) return 0;
  
  // Sum of item variances
  const sumVariances = itemVariances.reduce((a, b) => a + b, 0);
  
  // Cronbach's Alpha formula
  const alpha = (k / (k - 1)) * (1 - (sumVariances / totalVariance));
  
  return Math.max(0, Math.min(1, alpha)); // Clamp between 0 and 1
}

/**
 * Calculate mean and standard deviation for an array of numbers
 */
export function calculateMeanAndSD(values: number[]): { mean: number; sd: number } {
  if (values.length === 0) return { mean: 0, sd: 0 };
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  const sd = Math.sqrt(variance);
  
  return { mean, sd };
}

/**
 * Independent samples t-test
 * Compares means between two groups
 */
export function independentTTest(group1: number[], group2: number[]): {
  t: number;
  df: number;
  pValue: number;
  significant: boolean;
} {
  const n1 = group1.length;
  const n2 = group2.length;
  
  if (n1 < 2 || n2 < 2) {
    return { t: 0, df: 0, pValue: 1, significant: false };
  }
  
  const mean1 = group1.reduce((a, b) => a + b, 0) / n1;
  const mean2 = group2.reduce((a, b) => a + b, 0) / n2;
  
  const var1 = group1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
  const var2 = group2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);
  
  const pooledSE = Math.sqrt((var1 / n1) + (var2 / n2));
  const t = (mean1 - mean2) / pooledSE;
  const df = n1 + n2 - 2;
  
  // Approximate p-value using normal distribution for large samples
  const pValue = 2 * (1 - normalCDF(Math.abs(t)));
  
  return {
    t,
    df,
    pValue,
    significant: pValue < 0.05
  };
}

/**
 * One-way ANOVA test
 * Compares means across multiple groups
 */
export function oneWayANOVA(groups: number[][]): {
  F: number;
  dfBetween: number;
  dfWithin: number;
  pValue: number;
  significant: boolean;
} {
  const k = groups.length; // Number of groups
  if (k < 2) return { F: 0, dfBetween: 0, dfWithin: 0, pValue: 1, significant: false };
  
  const allData = groups.flat();
  const N = allData.length;
  const grandMean = allData.reduce((a, b) => a + b, 0) / N;
  
  // Sum of squares between groups
  let ssBetween = 0;
  for (const group of groups) {
    const groupMean = group.reduce((a, b) => a + b, 0) / group.length;
    ssBetween += group.length * Math.pow(groupMean - grandMean, 2);
  }
  
  // Sum of squares within groups
  let ssWithin = 0;
  for (const group of groups) {
    const groupMean = group.reduce((a, b) => a + b, 0) / group.length;
    for (const val of group) {
      ssWithin += Math.pow(val - groupMean, 2);
    }
  }
  
  const dfBetween = k - 1;
  const dfWithin = N - k;
  
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  
  const F = msBetween / msWithin;
  const pValue = 1 - fDistributionCDF(F, dfBetween, dfWithin);
  
  return {
    F,
    dfBetween,
    dfWithin,
    pValue,
    significant: pValue < 0.05
  };
}

/**
 * Pearson correlation coefficient
 */
export function pearsonCorrelation(x: number[], y: number[]): {
  r: number;
  pValue: number;
  significant: boolean;
} {
  if (x.length !== y.length || x.length < 3) {
    return { r: 0, pValue: 1, significant: false };
  }
  
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  let sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    sumXY += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }
  
  const r = sumXY / Math.sqrt(sumX2 * sumY2);
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const pValue = 2 * (1 - normalCDF(Math.abs(t)));
  
  return {
    r,
    pValue,
    significant: pValue < 0.05
  };
}

// Helper functions for statistical calculations
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

function fDistributionCDF(x: number, d1: number, d2: number): number {
  // Approximation using beta distribution
  const a = d1 / 2;
  const b = d2 / 2;
  const z = d1 * x / (d1 * x + d2);
  return incompleteBeta(z, a, b);
}

function incompleteBeta(x: number, a: number, b: number): number {
  // Simple approximation for incomplete beta function
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  const bt = Math.exp(
    lgamma(a + b) - lgamma(a) - lgamma(b) +
    a * Math.log(x) + b * Math.log(1 - x)
  );
  
  if (x < (a + 1) / (a + b + 2)) {
    return bt * betacf(x, a, b) / a;
  } else {
    return 1 - bt * betacf(1 - x, b, a) / b;
  }
}

function lgamma(x: number): number {
  // Log-gamma function approximation (Lanczos)
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * lgamma(1 - x));
  
  x -= 1;
  let y = c[0];
  for (let i = 1; i < g + 2; i++) y += c[i] / (x + i);
  
  const t = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(y);
}

function betacf(x: number, a: number, b: number): number {
  // Continued fraction for incomplete beta function
  const maxIter = 100;
  const eps = 3e-7;
  
  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  
  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    
    if (Math.abs(del - 1) < eps) break;
  }
  
  return h;
}

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

/**
 * Reliability Analysis using Cronbach's Alpha
 * Analyzes internal consistency of survey scales
 */
export async function analyzeReliability() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  
  if (surveys.length < 3) {
    return {
      message: "Need at least 3 responses for reliability analysis",
      scales: {}
    };
  }

  // Extract scale items for each construct
  // Motivation Scale (Section D): consistency, enjoyment, visualProgress, competition
  const motivationItems = [
    surveys.map((s: any) => s.section_d?.consistency || 0),
    surveys.map((s: any) => s.section_d?.enjoyment || 0),
    surveys.map((s: any) => s.section_d?.visualProgress || 0),
    surveys.map((s: any) => s.section_d?.competition || 0)
  ];

  // Gamification Features Scale (Section B): 8 features rated 1-5
  const gamificationItems = [
    surveys.map((s: any) => s.section_b?.pointsRewards || 0),
    surveys.map((s: any) => s.section_b?.leaderboards || 0),
    surveys.map((s: any) => s.section_b?.progressTracking || 0),
    surveys.map((s: any) => s.section_b?.achievements || 0),
    surveys.map((s: any) => s.section_b?.personalizedChallenges || 0),
    surveys.map((s: any) => s.section_b?.socialSharing || 0),
    surveys.map((s: any) => s.section_b?.dailyStreaks || 0),
    surveys.map((s: any) => s.section_b?.unlockableContent || 0)
  ];

  // Cultural Preference Scale (Section C): culturalMotivation coded as 1-3
  const culturalItems = [
    surveys.map((s: any) => {
      const cm = s.section_c?.culturalMotivation;
      return cm === 'Yes' ? 3 : cm === 'Maybe' ? 2 : 1;
    })
  ];

  // Calculate Cronbach's Alpha for each scale
  const motivationAlpha = calculateCronbachsAlpha(motivationItems);
  const gamificationAlpha = calculateCronbachsAlpha(gamificationItems);
  const culturalAlpha = calculateCronbachsAlpha(culturalItems);

  // Interpret reliability
  const interpretReliability = (alpha: number): string => {
    if (alpha >= 0.9) return "Excellent";
    if (alpha >= 0.8) return "Good";
    if (alpha >= 0.7) return "Acceptable";
    if (alpha >= 0.6) return "Questionable";
    if (alpha >= 0.5) return "Poor";
    return "Unacceptable";
  };

  return {
    totalResponses: surveys.length,
    scales: {
      motivation: {
        alpha: motivationAlpha,
        interpretation: interpretReliability(motivationAlpha),
        items: 4,
        description: "Motivation & Engagement Scale (consistency, enjoyment, visual progress, competition)"
      },
      gamification: {
        alpha: gamificationAlpha,
        interpretation: interpretReliability(gamificationAlpha),
        items: 8,
        description: "Gamification Features Scale (points, leaderboards, progress tracking, etc.)"
      },
      cultural: {
        alpha: culturalAlpha,
        interpretation: interpretReliability(culturalAlpha),
        items: 1,
        description: "Cultural Preference Scale (cultural motivation)",
        note: culturalAlpha === 0 ? "Single item scale - reliability not applicable" : undefined
      }
    }
  };
}

/**
 * Detailed Feature Analysis with Mean, SD, and Rankings
 */
export async function analyzeDetailedFeatures() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  
  if (surveys.length === 0) {
    return {
      message: "No survey data available",
      features: [],
      culturalDifferences: []
    };
  }

  const featureNames = [
    { key: 'pointsRewards', label: 'Points & Rewards' },
    { key: 'leaderboards', label: 'Leaderboards' },
    { key: 'progressTracking', label: 'Progress Tracking' },
    { key: 'achievements', label: 'Achievements / Badges' },
    { key: 'personalizedChallenges', label: 'Personalized Challenges' },
    { key: 'socialSharing', label: 'Social Sharing' },
    { key: 'dailyStreaks', label: 'Daily Streaks' },
    { key: 'unlockableContent', label: 'Unlockable Content' }
  ];

  const features = featureNames.map(({ key, label }) => {
    const values = surveys
      .map((s: any) => s.section_b?.[key])
      .filter((v: number) => typeof v === 'number' && v > 0);
    
    const { mean, sd } = calculateMeanAndSD(values);
    
    return {
      key,
      label,
      mean,
      sd,
      count: values.length,
      responses: values,
      rank: 0
    };
  });

  // Rank by mean score
  const ranked = [...features].sort((a, b) => b.mean - a.mean);
  ranked.forEach((f, i) => f.rank = i + 1);

  // Analyze cultural differences
  const countryGroups: Record<string, number[]> = {};
  
  surveys.forEach((survey: any) => {
    const country = survey.section_a?.country || 'Unknown';
    const totalScore = featureNames.reduce((sum, { key }) => {
      return sum + (survey.section_b?.[key] || 0);
    }, 0);
    
    if (!countryGroups[country]) countryGroups[country] = [];
    countryGroups[country].push(totalScore);
  });

  const culturalDifferences = Object.entries(countryGroups)
    .filter(([_, values]) => values.length >= 2)
    .map(([country, values]) => {
      const { mean, sd } = calculateMeanAndSD(values);
      return { country, mean, sd, count: values.length };
    });

  // ANOVA test for cultural differences
  const groupsData = Object.values(countryGroups).filter(g => g.length >= 2);
  const anova = groupsData.length >= 2 ? oneWayANOVA(groupsData) : null;

  return {
    features: ranked,
    culturalDifferences,
    anova,
    totalResponses: surveys.length
  };
}

/**
 * Engagement Analysis from survey data
 */
export async function analyzeEngagement() {
  const surveys = await getAllSurveyResponses().catch(() => []);
  
  if (surveys.length === 0) {
    return {
      message: "No survey data available",
      metrics: {}
    };
  }

  // Calculate engagement scores from Section D
  const engagementScores = surveys.map((s: any) => {
    const sd = s.section_d || {};
    return (
      (sd.consistency || 0) +
      (sd.enjoyment || 0) +
      (sd.visualProgress || 0) +
      (sd.competition || 0)
    ) / 4;
  });

  const { mean: avgEngagement, sd: engagementSD } = calculateMeanAndSD(engagementScores);

  // Activity level distribution
  const activityDistribution: Record<string, number> = {
    '0 days': 0,
    '1–2 days': 0,
    '3–4 days': 0,
    '5+ days': 0
  };

  surveys.forEach((s: any) => {
    const freq = s.section_a?.activityFrequency;
    if (freq && activityDistribution.hasOwnProperty(freq)) {
      activityDistribution[freq]++;
    }
  });

  // Adoption likelihood
  const adoptionDistribution: Record<string, number> = {
    'Not likely': 0,
    'Maybe': 0,
    'Very likely': 0
  };

  surveys.forEach((s: any) => {
    const likelihood = s.section_d?.likelihood;
    if (likelihood && adoptionDistribution.hasOwnProperty(likelihood)) {
      adoptionDistribution[likelihood]++;
    }
  });

  return {
    totalResponses: surveys.length,
    metrics: {
      averageEngagement: avgEngagement,
      engagementSD: engagementSD,
      engagementLevel: avgEngagement >= 4 ? 'High' : avgEngagement >= 3 ? 'Moderate' : 'Low'
    },
    activityDistribution,
    adoptionDistribution
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
    isDiaspora?: boolean;
    countryOfOrigin?: string;
    currentResidence?: string;
  };
  primaryFocus: string;
  suggestedMusic: string;
  totalParticipants: number;
}

/**
 * Three-Layer Cultural Adaptation
 * 
 * Layer 1: Self-reported country of origin (PRIMARY)
 * Layer 2: ML-detected cultural keywords
 * Layer 3: Diaspora status (origin != residence)
 */
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

/**
 * Enhanced cultural context with three-layer validation
 */
export function getCulturalContext(surveyResponse: any) {
  // Layer 1: Self-reported country of ORIGIN (not current residence!)
  const countryOfOrigin = surveyResponse.section_a?.countryOfOrigin || 
                          surveyResponse.section_a?.country || 
                          '';
  
  // Layer 2: ML-detected cultural keywords
  const culturalKeywords = surveyResponse.ml_metadata?.culturalKeywords || [];
  
  // Layer 3: Diaspora status
  const currentResidence = surveyResponse.section_a?.currentResidence || '';
  const isDiaspora = surveyResponse.ml_metadata?.isDiaspora || 
                    (countryOfOrigin && currentResidence && 
                     countryOfOrigin.toLowerCase() !== currentResidence.toLowerCase());

  // Get base context from country of origin
  const context = getContextByCountry(countryOfOrigin);

  // Calculate diaspora confidence
  let diasporaConfidence: 'high' | 'medium' | 'low' = 'low';
  if (isDiaspora) {
    if (culturalKeywords.length >= 2) {
      diasporaConfidence = 'high';
    } else if (culturalKeywords.length === 1) {
      diasporaConfidence = 'medium';
    }
  }

  return {
    ...context,
    isDiaspora,
    diasporaConfidence,
    countryOfOrigin,
    currentResidence,
    culturalKeywords,
  };
}

export function getPrototypeConfig(surveyResponse: any): ToolConfig {
  const sb = surveyResponse.section_b || {};
  const sc = surveyResponse.section_c || {};
  const sd = surveyResponse.section_d || {};

  // Use three-layer cultural context
  const culturalContext = getCulturalContext(surveyResponse);

  return {
    showLeaderboard: (sb.leaderboards || 0) >= 4,
    leaderboardVotes: 1,
    showSocial: (sb.socialSharing || 0) >= 3,
    socialVotes: 1,
    showRewards: (sb.pointsRewards || 0) >= 4,
    rewardsVotes: 1,
    theme: culturalContext.theme,
    culturalContext: {
      leaderboardName: culturalContext.leaderboardName,
      rewardName: culturalContext.rewardName,
      musicGenre: culturalContext.musicGenre,
      locationSignal: culturalContext.locationSignal,
      isDiaspora: culturalContext.isDiaspora,
      countryOfOrigin: culturalContext.countryOfOrigin,
      currentResidence: culturalContext.currentResidence,
    },
    primaryFocus: sd.visualProgress > sd.enjoyment ? 'Data Driven' : 'Experience Driven',
    suggestedMusic: culturalContext.musicGenre,
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
