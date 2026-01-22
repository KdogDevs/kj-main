import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.9";

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

    // Send emails via SMTP using nodemailer
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
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

    const statusText = isDown ? "DOWN" : "OPERATIONAL";
    const statusEmoji = isDown ? "🔴" : "🟢";
    const subject = `${statusEmoji} ${monitorName} is ${statusText}`;
    const timestamp = payload.heartbeat?.time || new Date().toISOString();
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">KAGEN CLOUD</h1>
                    <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px;">Status Alert</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Status Badge -->
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" style="width: 100%; background: ${isDown ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; border: 1px solid ${isDown ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}; border-radius: 16px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 32px;">${statusEmoji}</p>
                    <h2 style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: ${isDown ? '#ef4444' : '#22c55e'}; text-transform: uppercase; letter-spacing: 1.5px;">${statusText}</h2>
                    <p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">${monitorName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Details -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="width: 100%; background: rgba(255,255,255,0.04); border-radius: 12px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px;">Details</p>
                    <p style="margin: 0 0 16px; font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.5;">${message || 'No additional details available.'}</p>
                    <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.4);">
                      <span style="display: inline-block; margin-right: 8px;">🕐</span>${timestamp}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://kj-main.lovable.app/cloud-services" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">View Status Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05);">
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.35); text-align: center; line-height: 1.6;">
                You're receiving this because you subscribed to Kagen Cloud status alerts.<br>
                <a href="https://kj-main.lovable.app/cloud-services" style="color: rgba(255,255,255,0.5); text-decoration: underline;">Manage Preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports (STARTTLS)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: smtpFrom,
          to: subscriber.email,
          subject: subject,
          html: htmlBody,
        });
        sentCount++;
        console.log(`Email sent to ${subscriber.email}`);
      } catch (emailError: any) {
        console.error(`Failed to send to ${subscriber.email}:`, emailError);
        errors.push(subscriber.email);
      }
    }

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
