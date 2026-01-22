import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiting (resets on function cold start, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max 5 requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// Email validation schema with proper constraints
const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .email({ message: "Invalid email format" })
  .max(320, { message: "Email too long" });

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("cf-connecting-ip") || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateCheck = checkRateLimit(clientIP);
    
    if (!rateCheck.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          status: 429, 
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": String(rateCheck.retryAfter),
            ...corsHeaders 
          } 
        }
      );
    }

    const body = await req.json();
    
    // Validate email using zod
    const emailResult = emailSchema.safeParse(body.email);
    if (!emailResult.success) {
      return new Response(
        JSON.stringify({ error: emailResult.error.errors[0]?.message || "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const email = emailResult.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert subscription
    const { error } = await supabase
      .from("uptime_subscriptions")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation - already subscribed
        return new Response(
          JSON.stringify({ message: "Already subscribed" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      console.error("Database error:", error);
      throw new Error("Database operation failed");
    }

    return new Response(
      JSON.stringify({ message: "Successfully subscribed" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Subscription error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
