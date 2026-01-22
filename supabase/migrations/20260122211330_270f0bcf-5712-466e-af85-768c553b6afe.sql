-- Create table for uptime notification subscriptions
CREATE TABLE public.uptime_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.uptime_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to uptime notifications" 
ON public.uptime_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading own subscription (by email match - for unsubscribe)
CREATE POLICY "Users can view their own subscription" 
ON public.uptime_subscriptions 
FOR SELECT 
USING (true);