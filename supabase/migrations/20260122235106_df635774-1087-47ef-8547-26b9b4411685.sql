-- Create a public storage bucket for site assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- Allow public read access to assets bucket
CREATE POLICY "Public read access for assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');