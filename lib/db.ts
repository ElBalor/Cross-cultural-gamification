import { sql } from "@vercel/postgres";

export async function initDatabase() {
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
  try {
    const result = await sql`
      SELECT id, section_a, section_b, section_c, section_d, embeddings, ml_metadata, created_at
      FROM survey_responses
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    throw error;
  }
}

export async function getAllInterviewResponses() {
  try {
    const result = await sql`
      SELECT id, responses, embeddings, ml_metadata, created_at
      FROM interview_responses
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching interview responses:", error);
    throw error;
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
