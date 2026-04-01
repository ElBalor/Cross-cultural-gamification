import { sql } from '@vercel/postgres';

/**
 * Timezone Inference Engine
 * 
 * Analyzes user activity patterns to infer their timezone based on:
 * - Peak activity hours
 * - Consistent login times
 * - Session frequency patterns
 * - Weekend vs weekday behavior
 */

interface TimezoneInference {
  inferredTimezone: string;
  confidence: number; // 0-1
  peakHours: {
    start: number; // 0-23
    end: number;   // 0-23
  };
  activeDays: number[]; // 0-6 (Sunday-Saturday)
  totalActivities: number;
}

/**
 * Maps hour ranges to likely timezones
 * Using array of objects to avoid duplicate key issues
 */
const TIMEZONE_MAPPINGS: { hours: string; timezones: string[] }[] = [
  // Africa
  { hours: '0-8', timezones: ['Africa/Lagos', 'Africa/Accra', 'Africa/Casablanca'] }, // WAT, GMT
  { hours: '1-9', timezones: ['Africa/Cairo', 'Africa/Johannesburg', 'Africa/Nairobi'] }, // EAT, SAST
  // Europe
  { hours: '0-8', timezones: ['Europe/London', 'Europe/Dublin', 'Europe/Lisbon'] }, // GMT
  { hours: '1-9', timezones: ['Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'] }, // CET
  { hours: '2-10', timezones: ['Europe/Helsinki', 'Europe/Athens', 'Europe/Moscow'] }, // EET
  // Americas
  { hours: '5-13', timezones: ['America/New_York', 'America/Toronto', 'America/Montreal'] }, // EST
  { hours: '6-14', timezones: ['America/Chicago', 'America/Mexico_City'] }, // CST
  { hours: '7-15', timezones: ['America/Denver', 'America/Phoenix'] }, // MST
  { hours: '8-16', timezones: ['America/Los_Angeles', 'America/Vancouver'] }, // PST
  { hours: '9-17', timezones: ['America/Anchorage'] }, // AKST
  // Asia
  { hours: '0-8', timezones: ['Asia/Dubai', 'Asia/Muscat'] }, // GST
  { hours: '1-9', timezones: ['Asia/Kolkata', 'Asia/Colombo'] }, // IST
  { hours: '2-10', timezones: ['Asia/Dhaka'] }, // BST
  { hours: '3-11', timezones: ['Asia/Bangkok', 'Asia/Jakarta'] }, // ICT
  { hours: '4-12', timezones: ['Asia/Singapore', 'Asia/Kuala_Lumpur', 'Asia/Manila'] }, // SGT
  { hours: '5-13', timezones: ['Asia/Hong_Kong', 'Asia/Shanghai', 'Asia/Taipei'] }, // CST
  { hours: '6-14', timezones: ['Asia/Tokyo', 'Asia/Seoul'] }, // JST
  // Oceania
  { hours: '7-15', timezones: ['Australia/Brisbane'] }, // AEST
  { hours: '8-16', timezones: ['Australia/Sydney', 'Australia/Melbourne'] }, // AEDT
  { hours: '9-17', timezones: ['Pacific/Auckland'] }, // NZDT
];

/**
 * Infers timezone from user's activity logs
 */
export async function inferTimezoneFromActivity(
  surveyResponseId: number
): Promise<TimezoneInference> {
  try {
    // Fetch all activity logs for this user
    const result = await sql`
      SELECT timestamp, activity_type, metadata
      FROM activity_logs
      WHERE survey_response_id = ${surveyResponseId}
      ORDER BY timestamp DESC
      LIMIT 100
    `;

    if (result.rows.length === 0) {
      // Fallback: try to infer from session login times
      return inferFromSessions(surveyResponseId);
    }

    // Analyze activity patterns
    const hourDistribution = new Array(24).fill(0);
    const dayDistribution = new Array(7).fill(0);

    result.rows.forEach((row: any) => {
      const date = new Date(row.timestamp);
      const hour = date.getUTCHours();
      const day = date.getUTCDay();

      hourDistribution[hour]++;
      dayDistribution[day]++;
    });

    // Find peak activity window
    const peakHours = findPeakWindow(hourDistribution);
    const activeDays = dayDistribution
      .map((count, day) => ({ day, count }))
      .filter(({ count }) => count > 0)
      .map(({ day }) => day);

    // Map peak hours to timezone
    const inferredTimezone = mapHoursToTimezone(peakHours.start, peakHours.end);

    // Calculate confidence based on sample size and pattern clarity
    const confidence = calculateConfidence(
      result.rows.length,
      hourDistribution,
      peakHours
    );

    return {
      inferredTimezone,
      confidence,
      peakHours,
      activeDays,
      totalActivities: result.rows.length,
    };
  } catch (error) {
    console.error('Error inferring timezone:', error);
    return getDefaultInference();
  }
}

/**
 * Fallback: Infer from session login times
 */
async function inferFromSessions(
  surveyResponseId: number
): Promise<TimezoneInference> {
  try {
    const result = await sql`
      SELECT login_time
      FROM user_sessions
      WHERE survey_response_id = ${surveyResponseId}
      ORDER BY login_time DESC
      LIMIT 50
    `;

    if (result.rows.length === 0) {
      return getDefaultInference();
    }

    const hourDistribution = new Array(24).fill(0);

    result.rows.forEach((row: any) => {
      const date = new Date(row.login_time);
      const hour = date.getUTCHours();
      hourDistribution[hour]++;
    });

    const peakHours = findPeakWindow(hourDistribution);
    const inferredTimezone = mapHoursToTimezone(peakHours.start, peakHours.end);
    const confidence = Math.min(0.5, result.rows.length / 100); // Lower confidence for sessions

    return {
      inferredTimezone,
      confidence,
      peakHours,
      activeDays: [1, 2, 3, 4, 5], // Assume weekdays
      totalActivities: result.rows.length,
    };
  } catch (error) {
    console.error('Error inferring from sessions:', error);
    return getDefaultInference();
  }
}

/**
 * Find the peak activity window (consecutive hours with highest activity)
 */
function findPeakWindow(distribution: number[]): { start: number; end: number } {
  let maxSum = 0;
  let maxStart = 9; // Default to 9 AM
  let maxEnd = 17;  // Default to 5 PM

  // Sliding window of 8 hours (typical work day)
  for (let start = 0; start < 24; start++) {
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += distribution[(start + i) % 24];
    }

    if (sum > maxSum) {
      maxSum = sum;
      maxStart = start;
      maxEnd = (start + 8) % 24;
    }
  }

  return { start: maxStart, end: maxEnd };
}

/**
 * Map peak hours to most likely timezone
 */
function mapHoursToTimezone(start: number, end: number): string {
  const key = `${start}-${end}`;
  
  // Find first matching entry
  const match = TIMEZONE_MAPPINGS.find(m => m.hours === key);
  if (match) {
    return match.timezones[0];
  }

  // Fallback: try to find closest match
  for (const mapping of TIMEZONE_MAPPINGS) {
    const [hStart] = mapping.hours.split('-').map(Number);
    if (Math.abs(hStart - start) <= 2) {
      return mapping.timezones[0];
    }
  }

  // Default to UTC
  return 'UTC';
}

/**
 * Calculate confidence score based on data quality
 */
function calculateConfidence(
  sampleSize: number,
  distribution: number[],
  peakHours: { start: number; end: number }
): number {
  // Base confidence from sample size
  const sampleConfidence = Math.min(1.0, sampleSize / 50);

  // Pattern clarity (how concentrated is activity in peak hours?)
  const totalActivity = distribution.reduce((a, b) => a + b, 0);
  const peakActivity = distribution
    .slice(peakHours.start, peakHours.end > peakHours.start ? peakHours.end : 24)
    .reduce((a, b) => a + b, 0);

  const patternClarity = totalActivity > 0 ? peakActivity / totalActivity : 0;

  // Combined confidence
  return Math.round((sampleConfidence * 0.6 + patternClarity * 0.4) * 100) / 100;
}

/**
 * Get default inference when no data available
 */
function getDefaultInference(): TimezoneInference {
  return {
    inferredTimezone: 'UTC',
    confidence: 0,
    peakHours: { start: 9, end: 17 },
    activeDays: [1, 2, 3, 4, 5],
    totalActivities: 0,
  };
}

/**
 * Get current local time for a timezone
 */
export function getLocalTime(timezone: string): Date {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
    
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    
    const local = new Date(now);
    local.setUTCHours(hour, minute, 0, 0);
    
    return local;
  } catch {
    return new Date();
  }
}

/**
 * Check if current time is within user's active hours
 */
export function isActiveHours(
  timezone: string,
  peakHours: { start: number; end: number }
): boolean {
  const localHour = getLocalTime(timezone).getUTCHours();
  
  if (peakHours.end > peakHours.start) {
    return localHour >= peakHours.start && localHour < peakHours.end;
  } else {
    // Wraps around midnight
    return localHour >= peakHours.start || localHour < peakHours.end;
  }
}
