import { sql } from "@vercel/postgres";

// Fallback for Neon: mapping DATABASE_URL to POSTGRES_URL for @vercel/postgres
if (!process.env.POSTGRES_URL) {
  if (process.env.DATABASE_URL) {
    process.env.POSTGRES_URL = process.env.DATABASE_URL;
    console.log("Mapped DATABASE_URL to POSTGRES_URL");
  } else if (process.env.PGHOST_UNPOOLED) {
    const user = process.env.PGUSER || "neondb_owner";
    const pass = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
    const host = process.env.PGHOST_UNPOOLED;
    const db = process.env.PGDATABASE || process.env.POSTGRES_DATABASE;
    process.env.POSTGRES_URL = `postgres://${user}:${pass}@${host}/${db}?sslmode=require`;
    console.log("Constructed POSTGRES_URL from individual variables");
  }
}

export async function initDatabase() {
  console.log("Initializing database... URL present:", !!process.env.POSTGRES_URL);
  try {
    // Create survey_responses table
    await sql`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        section_a JSONB NOT NULL,
        section_b JSONB NOT NULL,
        section_c JSONB NOT NULL,
        section_d JSONB NOT NULL,
        embeddings JSONB,
        ml_metadata JSONB
      )
    `;

    // Create interview_responses table
    await sql`
      CREATE TABLE IF NOT EXISTS interview_responses (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responses JSONB NOT NULL,
        embeddings JSONB,
        ml_metadata JSONB
      )
    `;

    // Create step_activity_logs table for tracking step counter data
    await sql`
      CREATE TABLE IF NOT EXISTS step_activity_logs (
        id SERIAL PRIMARY KEY,
        survey_response_id INTEGER REFERENCES survey_responses(id),
        session_id VARCHAR(255),
        steps INTEGER DEFAULT 0,
        distance_meters DECIMAL(10,2) DEFAULT 0,
        calories_burned DECIMAL(10,2) DEFAULT 0,
        duration_seconds INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      )
    `;

    // Create session_logs table for tracking user sessions and engagement
    await sql`
      CREATE TABLE IF NOT EXISTS session_logs (
        id SERIAL PRIMARY KEY,
        survey_response_id INTEGER REFERENCES survey_responses(id),
        session_id VARCHAR(255),
        page_path VARCHAR(500),
        event_type VARCHAR(100),
        event_data JSONB,
        duration_seconds INTEGER DEFAULT 0,
        user_agent TEXT,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create system_metrics table for performance monitoring
    await sql`
      CREATE TABLE IF NOT EXISTS system_metrics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(100),
        metric_value DECIMAL(15,4),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create app_ratings table for user feedback and ratings
    await sql`
      CREATE TABLE IF NOT EXISTS app_ratings (
        id SERIAL PRIMARY KEY,
        survey_response_id INTEGER REFERENCES survey_responses(id),
        overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
        ease_of_use_rating INTEGER CHECK (ease_of_use_rating >= 1 AND ease_of_use_rating <= 5),
        features_rating INTEGER CHECK (features_rating >= 1 AND features_rating <= 5),
        cultural_relevance_rating INTEGER CHECK (cultural_relevance_rating >= 1 AND cultural_relevance_rating <= 5),
        would_recommend BOOLEAN,
        feedback_text TEXT,
        activity_type VARCHAR(100),
        device_type VARCHAR(100),
        session_id VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes (these may fail if embeddings column doesn't support GIN, so we catch errors)
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_survey_embeddings ON survey_responses USING GIN (embeddings)
      `;
    } catch (indexError) {
      console.warn(
        "Could not create survey embeddings index (this is usually fine):",
        indexError
      );
    }

    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_interview_embeddings ON interview_responses USING GIN (embeddings)
      `;
    } catch (indexError) {
      console.warn(
        "Could not create interview embeddings index (this is usually fine):",
        indexError
      );
    }

    // Create basic indexes for created_at
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses(created_at)
      `;
    } catch (indexError) {
      console.warn("Could not create survey created_at index:", indexError);
    }

    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_interview_created_at ON interview_responses(created_at)
      `;
    } catch (indexError) {
      console.warn("Could not create interview created_at index:", indexError);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

export async function saveSurveyResponse(data: {
  sectionA: any;
  sectionB: any;
  sectionC: any;
  sectionD: any;
  embeddings?: any;
  mlMetadata?: any;
}) {
  try {
    const result = await sql`
      INSERT INTO survey_responses (section_a, section_b, section_c, section_d, embeddings, ml_metadata)
      VALUES (
        ${JSON.stringify(data.sectionA)}, 
        ${JSON.stringify(data.sectionB)}, 
        ${JSON.stringify(data.sectionC)}, 
        ${JSON.stringify(data.sectionD)},
        ${data.embeddings ? JSON.stringify(data.embeddings) : null},
        ${data.mlMetadata ? JSON.stringify(data.mlMetadata) : null}
      )
      RETURNING id
    `;
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error("Error saving survey response:", error);
    throw error;
  }
}

export async function saveInterviewResponse(data: {
  responses: any;
  embeddings?: any;
  mlMetadata?: any;
}) {
  try {
    const result = await sql`
      INSERT INTO interview_responses (responses, embeddings, ml_metadata)
      VALUES (
        ${JSON.stringify(data.responses)},
        ${data.embeddings ? JSON.stringify(data.embeddings) : null},
        ${data.mlMetadata ? JSON.stringify(data.mlMetadata) : null}
      )
      RETURNING id
    `;
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error("Error saving interview response:", error);
    throw error;
  }
}

export async function getAllSurveyResponses() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    console.warn("Database connection string missing. Returning empty array.");
    return [];
  }
  try {
    const result = await sql`
      SELECT id, section_a, section_b, section_c, section_d, embeddings, ml_metadata, created_at
      FROM survey_responses
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    return []; // Return empty instead of throwing
  }
}

export async function getAllInterviewResponses() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    console.warn("Database connection string missing. Returning empty array.");
    return [];
  }
  try {
    const result = await sql`
      SELECT id, responses, embeddings, ml_metadata, created_at
      FROM interview_responses
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching interview responses:", error);
    return []; // Return empty instead of throwing
  }
}

export async function getSurveyResponseById(id: number) {
  try {
    const result = await sql`
      SELECT id, section_a, section_b, section_c, section_d, embeddings, ml_metadata, created_at
      FROM survey_responses
      WHERE id = ${id}
    `;
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching survey response ${id}:`, error);
    return null;
  }
}

export async function getInterviewResponseById(id: number) {
  try {
    const result = await sql`
      SELECT id, responses, embeddings, ml_metadata, created_at
      FROM interview_responses
      WHERE id = ${id}
    `;
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching interview response ${id}:`, error);
    return null;
  }
}

export async function findSimilarResponses(
  embedding: number[],
  limit: number = 5
) {
  try {
    const result = await sql`
      SELECT
        id,
        section_a,
        section_b,
        section_c,
        section_d,
        embeddings,
        ml_metadata,
        created_at,
        1 - (
          embeddings->'responseVector'->>'values'::jsonb <-> ${JSON.stringify(
            embedding
          )}::jsonb
        ) as similarity
      FROM survey_responses
      WHERE embeddings IS NOT NULL
      ORDER BY similarity DESC
      LIMIT ${limit}
    `;
    return result.rows;
  } catch (error) {
    console.error("Error finding similar responses:", error);
    throw error;
  }
}

// ============================================
// STEP ACTIVITY LOGGING FUNCTIONS
// ============================================

export async function saveStepActivity(data: {
  surveyResponseId?: number;
  sessionId: string;
  steps: number;
  distance: number;
  calories: number;
  duration: number;
  metadata?: any;
}) {
  try {
    const result = await sql`
      INSERT INTO step_activity_logs (survey_response_id, session_id, steps, distance_meters, calories_burned, duration_seconds, metadata)
      VALUES (
        ${data.surveyResponseId || null},
        ${data.sessionId},
        ${data.steps},
        ${data.distance},
        ${data.calories},
        ${data.duration},
        ${data.metadata ? JSON.stringify(data.metadata) : null}
      )
      RETURNING id
    `;
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error("Error saving step activity:", error);
    throw error;
  }
}

export async function getStepActivityBySession(sessionId: string) {
  try {
    const result = await sql`
      SELECT * FROM step_activity_logs
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching step activity:", error);
    return [];
  }
}

export async function getAllStepActivity() {
  try {
    const result = await sql`
      SELECT * FROM step_activity_logs
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching all step activity:", error);
    return [];
  }
}

// ============================================
// SESSION LOGGING FUNCTIONS
// ============================================

export async function logSession(data: {
  surveyResponseId?: number;
  sessionId: string;
  pagePath: string;
  eventType: string;
  eventData?: any;
  duration?: number;
  userAgent?: string;
  ipAddress?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO session_logs (survey_response_id, session_id, page_path, event_type, event_data, duration_seconds, user_agent, ip_address)
      VALUES (
        ${data.surveyResponseId || null},
        ${data.sessionId},
        ${data.pagePath},
        ${data.eventType},
        ${data.eventData ? JSON.stringify(data.eventData) : null},
        ${data.duration || 0},
        ${data.userAgent || null},
        ${data.ipAddress || null}
      )
      RETURNING id
    `;
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error("Error logging session:", error);
    throw error;
  }
}

export async function getSessionLogs(filters?: {
  surveyResponseId?: number;
  sessionId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    // For now, fetch all and filter in memory (can be optimized later)
    const result = await sql`SELECT * FROM session_logs ORDER BY created_at DESC`;
    
    let rows = result.rows;
    
    if (filters?.surveyResponseId) {
      rows = rows.filter((r: any) => r.survey_response_id === filters.surveyResponseId);
    }
    if (filters?.sessionId) {
      rows = rows.filter((r: any) => r.session_id === filters.sessionId);
    }
    if (filters?.eventType) {
      rows = rows.filter((r: any) => r.event_type === filters.eventType);
    }
    if (filters?.startDate) {
      rows = rows.filter((r: any) => new Date(r.created_at) >= filters.startDate!);
    }
    if (filters?.endDate) {
      rows = rows.filter((r: any) => new Date(r.created_at) <= filters.endDate!);
    }
    
    return rows;
  } catch (error) {
    console.error("Error fetching session logs:", error);
    return [];
  }
}

export async function getEngagementMetrics() {
  try {
    const result = await sql`
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(DISTINCT survey_response_id) as unique_users,
        COUNT(*) as total_events,
        AVG(duration_seconds) as avg_duration,
        event_type,
        COUNT(*) as event_count
      FROM session_logs
      GROUP BY event_type
      UNION ALL
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(DISTINCT survey_response_id) as unique_users,
        COUNT(*) as total_events,
        AVG(duration_seconds) as avg_duration,
        'TOTAL' as event_type,
        COUNT(*) as event_count
      FROM session_logs
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return [];
  }
}

// ============================================
// SYSTEM METRICS FUNCTIONS
// ============================================

export async function logSystemMetric(metricName: string, metricValue: number, metadata?: any) {
  try {
    await sql`
      INSERT INTO system_metrics (metric_name, metric_value, metadata)
      VALUES (
        ${metricName},
        ${metricValue},
        ${metadata ? JSON.stringify(metadata) : null}
      )
    `;
    return { success: true };
  } catch (error) {
    console.error("Error logging system metric:", error);
    throw error;
  }
}

export async function getSystemMetrics(metricName?: string, limit: number = 100) {
  try {
    // Fetch all and filter in memory
    const result = await sql`SELECT * FROM system_metrics ORDER BY created_at DESC LIMIT ${limit}`;
    
    let rows = result.rows;
    
    if (metricName) {
      rows = rows.filter((r: any) => r.metric_name === metricName);
    }
    
    return rows;
  } catch (error) {
    console.error("Error fetching system metrics:", error);
    return [];
  }
}

export async function getPerformanceMetrics() {
  try {
    const result = await sql`
      SELECT 
        metric_name,
        AVG(metric_value) as avg_value,
        MIN(metric_value) as min_value,
        MAX(metric_value) as max_value,
        COUNT(*) as sample_count
      FROM system_metrics
      GROUP BY metric_name
      ORDER BY metric_name
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return [];
  }
}

// ============================================
// APP RATINGS FUNCTIONS
// ============================================

export async function saveAppRating(data: {
  surveyResponseId?: number;
  overallRating: number;
  easeOfUseRating?: number;
  featuresRating?: number;
  culturalRelevanceRating?: number;
  wouldRecommend?: boolean;
  feedbackText?: string;
  activityType?: string;
  deviceType?: string;
  sessionId?: string;
  metadata?: any;
}) {
  try {
    const result = await sql`
      INSERT INTO app_ratings (
        survey_response_id,
        overall_rating,
        ease_of_use_rating,
        features_rating,
        cultural_relevance_rating,
        would_recommend,
        feedback_text,
        activity_type,
        device_type,
        session_id,
        metadata
      )
      VALUES (
        ${data.surveyResponseId || null},
        ${data.overallRating},
        ${data.easeOfUseRating || null},
        ${data.featuresRating || null},
        ${data.culturalRelevanceRating || null},
        ${data.wouldRecommend || null},
        ${data.feedbackText || null},
        ${data.activityType || null},
        ${data.deviceType || null},
        ${data.sessionId || null},
        ${data.metadata ? JSON.stringify(data.metadata) : null}
      )
      RETURNING id
    `;
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error("Error saving app rating:", error);
    throw error;
  }
}

export async function getAllAppRatings() {
  try {
    const result = await sql`
      SELECT * FROM app_ratings
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching app ratings:", error);
    return [];
  }
}

export async function getAppRatingsSummary() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_ratings,
        AVG(overall_rating) as avg_overall,
        AVG(ease_of_use_rating) as avg_ease_of_use,
        AVG(features_rating) as avg_features,
        AVG(cultural_relevance_rating) as avg_cultural,
        COUNT(CASE WHEN would_recommend = true THEN 1 END) as recommend_count,
        COUNT(CASE WHEN would_recommend = false THEN 1 END) as not_recommend_count
      FROM app_ratings
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching ratings summary:", error);
    return null;
  }
}

export async function getRatingsByActivity() {
  try {
    const result = await sql`
      SELECT 
        activity_type,
        COUNT(*) as count,
        AVG(overall_rating) as avg_rating
      FROM app_ratings
      WHERE activity_type IS NOT NULL
      GROUP BY activity_type
      ORDER BY count DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching ratings by activity:", error);
    return [];
  }
}
