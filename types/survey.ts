export interface SurveyData {
  sectionA: {
    age: string
    gender: string
    country: string
    activityFrequency: string
  }
  sectionB: {
    pointsRewards: number
    leaderboards: number
    progressTracking: number
    achievements: number
    personalizedChallenges: number
    socialSharing: number
    dailyStreaks: number
    unlockableContent: number
    favoriteFeatures: string
  }
  sectionC: {
    culturalMotivation: string
    culturalElements: string
    barriers: string[]
    otherBarriers: string
  }
  sectionD: {
    consistency: number
    enjoyment: number
    visualProgress: number
    competition: number
    likelihood: string
  }
}






