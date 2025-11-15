-- Migration: 002_submissions_table
-- Description: Create submissions table and related indexes
-- Date: 2025-11-15

BEGIN;

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  research_type VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  main_researcher VARCHAR(255) NOT NULL,
  general_specialization VARCHAR(255) NOT NULL,
  detailed_specialization VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  admin_comment TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  is_draft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT submissions_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision', 'draft')),
  CONSTRAINT submissions_gender_check CHECK (gender IN ('ذكر', 'أنثى'))
);

-- Create indexes
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_reference_number ON submissions(reference_number);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

COMMIT;

