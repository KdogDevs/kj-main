-- Add unsubscribe_token column for secure unsubscription
ALTER TABLE public.uptime_subscriptions 
ADD COLUMN IF NOT EXISTS unsubscribe_token UUID DEFAULT gen_random_uuid() NOT NULL;

-- Create unique index on unsubscribe_token
CREATE UNIQUE INDEX IF NOT EXISTS idx_uptime_subscriptions_unsubscribe_token 
ON public.uptime_subscriptions(unsubscribe_token);

-- Drop the overly permissive DELETE policy
DROP POLICY IF EXISTS "Anyone can unsubscribe with their email" ON public.uptime_subscriptions;

-- Create a more restrictive DELETE policy that forces all deletes through the Edge Function with service role
-- The Edge Function will validate the token before deleting
CREATE POLICY "Token-based unsubscribe only"
  ON public.uptime_subscriptions
  FOR DELETE
  USING (false);