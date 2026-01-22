import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UptimeKumaWebhook {
  heartbeat?: {
    status: number; // 0 = down, 1 = up
    msg: string;
    time: string;
  };
  monitor?: {
    name: string;
    url?: string;
  };
  msg?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = req.headers.get("Authorization");
    const expectedKey = Deno.env.get("UPTIME_KUMA_API_KEY");
    
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      console.log("Unauthorized webhook attempt");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const payload: UptimeKumaWebhook = await req.json();
    console.log("Received webhook:", JSON.stringify(payload));

    const monitorName = payload.monitor?.name || "Unknown Service";
    const status = payload.heartbeat?.status;
    const message = payload.heartbeat?.msg || payload.msg || "";
    const isDown = status === 0;

    // Only notify on status changes (down events primarily)
    if (status === undefined) {
      return new Response(
        JSON.stringify({ message: "No status change to report" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get all subscribers
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: subscribers, error: fetchError } = await supabase
      .from("uptime_subscriptions")
      .select("email");

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers to notify");
      return new Response(
        JSON.stringify({ message: "No subscribers" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send emails via SMTP
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT") || "587";
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const smtpFrom = Deno.env.get("SMTP_FROM") || "noreply@kagen.dev";

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP not configured");
      return new Response(
        JSON.stringify({ error: "SMTP not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const statusText = isDown ? "🔴 DOWN" : "🟢 UP";
    const subject = `${statusText}: ${monitorName}`;
    const htmlBody = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isDown ? '#ef4444' : '#22c55e'};">${statusText}</h2>
        <h3>${monitorName}</h3>
        <p>${message}</p>
        <p style="color: #666; font-size: 14px;">Time: ${payload.heartbeat?.time || new Date().toISOString()}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          You're receiving this because you subscribed to Kagen Cloud status updates.
          <br><a href="https://uptime.kagen.dev/status/cloud-services">View Status Page</a>
        </p>
      </div>
    `;

    // Use Deno's smtp client
    const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
    
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: parseInt(smtpPort),
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        await client.send({
          from: smtpFrom,
          to: subscriber.email,
          subject: subject,
          content: "auto",
          html: htmlBody,
        });
        sentCount++;
        console.log(`Email sent to ${subscriber.email}`);
      } catch (emailError: any) {
        console.error(`Failed to send to ${subscriber.email}:`, emailError);
        errors.push(subscriber.email);
      }
    }

    await client.close();

    return new Response(
      JSON.stringify({ 
        message: `Notified ${sentCount} subscribers`,
        errors: errors.length > 0 ? errors : undefined 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
