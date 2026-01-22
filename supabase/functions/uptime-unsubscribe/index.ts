import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max 10 unsubscribe attempts per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// Validation schemas
const tokenSchema = z.string().uuid({ message: "Invalid unsubscribe token" });
const emailSchema = z.string().trim().toLowerCase().email().max(320);

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
    const { token, email } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Token-based unsubscribe (preferred, secure method)
    if (token) {
      const tokenResult = tokenSchema.safeParse(token);
      if (!tokenResult.success) {
        return new Response(
          JSON.stringify({ error: "Invalid unsubscribe token" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error, count } = await supabase
        .from("uptime_subscriptions")
        .delete()
        .eq("unsubscribe_token", tokenResult.data);

      if (error) {
        console.error("Unsubscribe error:", error);
        throw new Error("Failed to process unsubscribe");
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: count && count > 0 ? "Successfully unsubscribed" : "Subscription not found"
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email-based unsubscribe (fallback, requires email verification in future)
    if (email) {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error, count } = await supabase
        .from("uptime_subscriptions")
        .delete()
        .eq("email", emailResult.data);

      if (error) {
        console.error("Unsubscribe error:", error);
        throw new Error("Failed to process unsubscribe");
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: count && count > 0 ? "Successfully unsubscribed" : "Email not found in subscriptions"
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Email or unsubscribe token required" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Unsubscribe error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
