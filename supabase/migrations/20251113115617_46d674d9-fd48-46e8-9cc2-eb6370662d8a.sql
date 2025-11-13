-- Add utm_params column to professionals table
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS utm_params JSONB;

-- Add utm_params column to contact_inquiries table
ALTER TABLE contact_inquiries 
ADD COLUMN IF NOT EXISTS utm_params JSONB;

-- Add indexes for better query performance on UTM parameters
CREATE INDEX IF NOT EXISTS idx_professionals_utm_params ON professionals USING GIN (utm_params);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_utm_params ON contact_inquiries USING GIN (utm_params);

-- Add comments for documentation
COMMENT ON COLUMN professionals.utm_params IS 'UTM tracking parameters (utm_source, utm_medium, utm_campaign, etc.) stored as JSON';
COMMENT ON COLUMN contact_inquiries.utm_params IS 'UTM tracking parameters (utm_source, utm_medium, utm_campaign, etc.) stored as JSON';