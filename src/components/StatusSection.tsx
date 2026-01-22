import { useState, useEffect } from "react";
import { Activity, CheckCircle, AlertTriangle, XCircle, ExternalLink, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MonitorStatus {
  id: number;
  name: string;
  status: number; // 0 = down, 1 = up, 2 = pending
}

interface HeartbeatData {
  monitorID: number;
  status: number;
}

interface UptimeData {
  publicGroupList?: Array<{
    id: number;
    name: string;
    monitorList: MonitorStatus[];
  }>;
  heartbeatList?: Record<string, HeartbeatData[]>;
}

const StatusSection = () => {
  const [statusData, setStatusData] = useState<UptimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { toast } = useToast();

  const fetchStatus = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const { data, error } = await supabase.functions.invoke("uptime-status");
      
      if (error) throw error;
      setStatusData(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch status:", err);
      setError("Unable to load status");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus(true);
    
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(() => fetchStatus(false), 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubscribing(true);
      const { data, error } = await supabase.functions.invoke("uptime-subscribe", {
        body: { email: email.trim() },
      });

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "You'll receive notifications when services go down.",
      });
      setEmail("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: err.message || "Please try again later.",
      });
    } finally {
      setSubscribing(false);
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 0:
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Operational";
      case 0:
        return "Down";
      default:
        return "Checking...";
    }
  };

  const getOverallStatus = () => {
    if (!statusData?.publicGroupList) return null;
    
    const allMonitors = statusData.publicGroupList.flatMap(g => g.monitorList || []);
    const latestStatuses = allMonitors.map(m => {
      const heartbeats = statusData.heartbeatList?.[m.id.toString()];
      return heartbeats?.[heartbeats.length - 1]?.status ?? 1;
    });
    
    if (latestStatuses.some(s => s === 0)) return { status: 0, text: "Some services are down", color: "text-red-500" };
    if (latestStatuses.some(s => s === 2)) return { status: 2, text: "Some services degraded", color: "text-yellow-500" };
    return { status: 1, text: "All systems operational", color: "text-green-500" };
  };

  const overall = getOverallStatus();

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Service Status</h2>
        </div>
        <Button variant="ghost" size="sm" className="rounded-xl" asChild>
          <a 
            href="https://uptime.kagen.dev/status/cloud-services" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Full Status Page
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden">
        {/* Overall Status Banner */}
        <div className="p-6 border-b border-border/30 bg-secondary/30">
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-muted-foreground">Checking status...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="text-muted-foreground">{error}</span>
            </div>
          ) : overall ? (
            <div className="flex items-center gap-3">
              {getStatusIcon(overall.status)}
              <span className={`font-medium ${overall.color}`}>{overall.text}</span>
            </div>
          ) : null}
        </div>

        {/* Monitor List */}
        {!loading && !error && statusData?.publicGroupList && (
          <div className="divide-y divide-border/30">
            {statusData.publicGroupList.flatMap(group => 
              (group.monitorList || []).map(monitor => {
                const heartbeats = statusData.heartbeatList?.[monitor.id.toString()];
                const latestStatus = heartbeats?.[heartbeats.length - 1]?.status ?? 1;
                
                return (
                  <div 
                    key={monitor.id} 
                    className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                  >
                    <span className="font-medium">{monitor.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {getStatusText(latestStatus)}
                      </span>
                      {getStatusIcon(latestStatus)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Notification Signup */}
        <div className="p-6 bg-secondary/20 border-t border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4" />
            <span className="font-medium text-sm">Get notified when services go down</span>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl"
              required
            />
            <Button 
              type="submit" 
              disabled={subscribing}
              className="rounded-xl"
            >
              {subscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default StatusSection;
