import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UPTIME_KUMA_BASE_URL = "https://uptime.kagen.dev/api/status-page";
const STATUS_PAGE_SLUG = "cloud-services";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch both status page config and heartbeat data in parallel
    const [statusResponse, heartbeatResponse] = await Promise.all([
      fetch(`${UPTIME_KUMA_BASE_URL}/${STATUS_PAGE_SLUG}`, {
        headers: { "Accept": "application/json" },
      }),
      fetch(`${UPTIME_KUMA_BASE_URL}/heartbeat/${STATUS_PAGE_SLUG}`, {
        headers: { "Accept": "application/json" },
      }),
    ]);

    if (!statusResponse.ok) {
      console.error(`Status API error: ${statusResponse.status}`);
      throw new Error("Failed to fetch status");
    }

    const statusData = await statusResponse.json();
    
    // Merge heartbeat data if available
    if (heartbeatResponse.ok) {
      const heartbeatData = await heartbeatResponse.json();
      statusData.heartbeatList = heartbeatData.heartbeatList;
      statusData.uptimeList = heartbeatData.uptimeList;
    }

    return new Response(JSON.stringify(statusData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error fetching uptime status:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch status. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
