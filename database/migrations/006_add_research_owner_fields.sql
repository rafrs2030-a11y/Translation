-- Migration: 006_add_research_owner_fields
-- Description: Add research owner type and business type fields to submissions table
-- Date: 2025-01-XX

BEGIN;

-- Add research_owner_type field (أفراد or أعمال)
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS research_owner_type VARCHAR(20) CHECK (research_owner_type IN ('أفراد', 'أعمال'));

-- Add business_type field (only relevant when research_owner_type = 'أعمال')
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) CHECK (business_type IN ('جهة حكومية', 'هيئة', 'قطاع خاص', 'قطاع غير ربحي', 'جامعة حكومية', 'جامعة خاصة'));

-- Add comment to explain the fields
COMMENT ON COLUMN submissions.research_owner_type IS 'نوع مالك البحث: أفراد أو أعمال';
COMMENT ON COLUMN submissions.business_type IS 'نوع الأعمال (يظهر فقط عندما يكون research_owner_type = أعمال)';

COMMIT;

