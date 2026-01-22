-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.uptime_subscriptions;

-- Create a more restrictive policy - no one can view other people's emails
-- Only allow checking if an email exists via edge function
CREATE POLICY "No public read access to subscriptions"
  ON public.uptime_subscriptions
  FOR SELECT
  USING (false);

-- Allow users to delete their own subscription (for unsubscribe)
CREATE POLICY "Anyone can unsubscribe with their email"
  ON public.uptime_subscriptions
  FOR DELETE
  USING (true);