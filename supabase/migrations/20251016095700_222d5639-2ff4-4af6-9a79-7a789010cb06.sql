-- Add business_license_number column to professionals table
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS business_license_number TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.professionals.business_license_number IS 'מספר עוסק מורשה/פטור/ח.פ - שדה חובה מספרי';