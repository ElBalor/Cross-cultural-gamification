-- Database initialization script for Vercel Postgres
-- Run this in your Vercel Postgres database SQL editor

CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  section_a JSONB NOT NULL,
  section_b JSONB NOT NULL,
  section_c JSONB NOT NULL,
  section_d JSONB NOT NULL,
  embeddings JSONB,
  ml_metadata JSONB
);

CREATE TABLE IF NOT EXISTS interview_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responses JSONB NOT NULL,
  embeddings JSONB,
  ml_metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_created_at ON interview_responses(created_at);






