import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity, CheckCircle, AlertTriangle, XCircle, ExternalLink, Bell, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TiltCard3D from "./TiltCard3D";

interface MonitorStatus {
  id: number;
  name: string;
  status: number;
}

interface HeartbeatData {
  monitorID: number;
  status: number;
  time: string;
  msg?: string;
}

interface UptimeData {
  publicGroupList?: Array<{
    id: number;
    name: string;
    monitorList: MonitorStatus[];
  }>;
  heartbeatList?: Record<string, HeartbeatData[]>;
  uptimeList?: Record<string, number>;
}

const StatusSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusData, setStatusData] = useState<UptimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [actionMode, setActionMode] = useState<"subscribe" | "unsubscribe">("subscribe");
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
    const unsubscribeToken = searchParams.get("unsubscribe");
    if (unsubscribeToken) {
      const handleTokenUnsubscribe = async () => {
        try {
          const { error } = await supabase.functions.invoke("uptime-unsubscribe", {
            body: { token: unsubscribeToken },
          });

          if (error) throw error;

          toast({
            title: "Unsubscribed",
            description: "You will no longer receive status notifications.",
          });
        } catch (err: any) {
          toast({
            variant: "destructive",
            title: "Unsubscribe failed",
            description: "Invalid or expired unsubscribe link.",
          });
        } finally {
          searchParams.delete("unsubscribe");
          setSearchParams(searchParams, { replace: true });
        }
      };
      handleTokenUnsubscribe();
    }
  }, [searchParams, setSearchParams, toast]);

  useEffect(() => {
    fetchStatus(true);
    const interval = setInterval(() => fetchStatus(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubscribing(true);
      
      if (actionMode === "subscribe") {
        const { data, error } = await supabase.functions.invoke("uptime-subscribe", {
          body: { email: email.trim() },
        });

        if (error) throw error;

        toast({
          title: "Subscribed!",
          description: "You'll receive notifications when services go down.",
        });
      } else {
        const { data, error } = await supabase.functions.invoke("uptime-unsubscribe", {
          body: { email: email.trim() },
        });

        if (error) throw error;

        toast({
          title: "Unsubscribed",
          description: "You will no longer receive status notifications.",
        });
      }
      
      setEmail("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: actionMode === "subscribe" ? "Subscription failed" : "Unsubscribe failed",
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

  const getAverageUptime = () => {
    if (!statusData?.uptimeList) return null;
    
    const uptimes30d = Object.entries(statusData.uptimeList)
      .filter(([key]) => key.endsWith("_720"))
      .map(([, value]) => value);
    
    if (uptimes30d.length === 0) return null;
    
    const average = uptimes30d.reduce((sum, val) => sum + val, 0) / uptimes30d.length;
    return (average * 100).toFixed(1);
  };

  const getLastIncident = () => {
    if (!statusData?.heartbeatList || !statusData?.publicGroupList) return null;
    
    const monitorNames: Record<number, string> = {};
    statusData.publicGroupList.forEach(group => {
      (group.monitorList || []).forEach(m => {
        monitorNames[m.id] = m.name;
      });
    });

    let lastIncident: { name: string; time: Date; endTime?: Date } | null = null;

    Object.entries(statusData.heartbeatList).forEach(([monitorId, heartbeats]) => {
      const name = monitorNames[parseInt(monitorId)] || "Unknown";
      
      for (let i = heartbeats.length - 1; i >= 0; i--) {
        if (heartbeats[i].status === 0) {
          const downTime = new Date(heartbeats[i].time);
          
          let endTime: Date | undefined;
          for (let j = i + 1; j < heartbeats.length; j++) {
            if (heartbeats[j].status === 1) {
              endTime = new Date(heartbeats[j].time);
              break;
            }
          }
          
          if (!lastIncident || downTime > lastIncident.time) {
            lastIncident = { name, time: downTime, endTime };
          }
          break;
        }
      }
    });

    return lastIncident;
  };

  const formatIncidentTime = (incident: { name: string; time: Date; endTime?: Date }) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
    
    const dateStr = incident.time.toLocaleDateString("en-US", options);
    const startTime = incident.time.toLocaleTimeString("en-US", timeOptions);
    
    if (incident.endTime) {
      const endTime = incident.endTime.toLocaleTimeString("en-US", timeOptions);
      return `${incident.name} – ${dateStr}, ${startTime}–${endTime}`;
    }
    return `${incident.name} – ${dateStr}, ${startTime}`;
  };

  const overall = getOverallStatus();
  const averageUptime = getAverageUptime();
  const lastIncident = getLastIncident();

  return (
    <motion.section 
      className="mb-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-6 h-6" />
          </motion.div>
          <h2 className="text-2xl font-bold">Service Status</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
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
        </motion.div>
      </div>

      <TiltCard3D intensity={3}>
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden">
          {/* Overall Status Banner */}
          <motion.div 
            className="p-6 border-b border-border/30 bg-secondary/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <span className="text-muted-foreground">Checking status...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-muted-foreground">{error}</span>
              </div>
            ) : overall ? (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={overall.status === 1 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getStatusIcon(overall.status)}
                </motion.div>
                <span className={`font-medium ${overall.color}`}>{overall.text}</span>
              </motion.div>
            ) : null}
          </motion.div>

          {/* Uptime Stats */}
          <AnimatePresence>
            {!loading && !error && (averageUptime || lastIncident) && (
              <motion.div 
                className="px-6 py-4 border-b border-border/30 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {averageUptime && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="font-medium text-foreground">Past 30 days:</span>{" "}
                    {averageUptime}% uptime across all services.
                  </motion.span>
                )}
                {averageUptime && lastIncident && (
                  <span className="hidden sm:inline text-border">•</span>
                )}
                {lastIncident && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="font-medium text-foreground">Last incident:</span>{" "}
                    {formatIncidentTime(lastIncident)}
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Monitor List */}
          <AnimatePresence>
            {!loading && !error && statusData?.publicGroupList && (
              <div className="divide-y divide-border/30">
                {statusData.publicGroupList.flatMap((group, groupIndex) => 
                  (group.monitorList || []).map((monitor, monitorIndex) => {
                    const heartbeats = statusData.heartbeatList?.[monitor.id.toString()];
                    const latestStatus = heartbeats?.[heartbeats.length - 1]?.status ?? 1;
                    
                    return (
                      <motion.div 
                        key={monitor.id} 
                        className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (groupIndex + monitorIndex) }}
                        whileHover={{ x: 5 }}
                      >
                        <span className="font-medium">{monitor.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {getStatusText(latestStatus)}
                          </span>
                          <motion.div
                            animate={latestStatus === 1 ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity, delay: monitorIndex * 0.2 }}
                          >
                            {getStatusIcon(latestStatus)}
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Notification Signup */}
          <motion.div 
            className="p-6 bg-secondary/20 border-t border-border/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bell className="w-4 h-4" />
              </motion.div>
              <span className="font-medium text-sm">
                {actionMode === "subscribe" 
                  ? "Get notified when services go down" 
                  : "Unsubscribe from status notifications"}
              </span>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl"
                required
              />
              <div className="flex">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={subscribing}
                    className="rounded-l-xl rounded-r-none border-r-0"
                  >
                    {subscribing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      actionMode === "subscribe" ? "Subscribe" : "Unsubscribe"
                    )}
                  </Button>
                </motion.div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button"
                      variant="default" 
                      className="rounded-l-none rounded-r-xl px-2 border-l border-primary-foreground/20"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActionMode("subscribe")}>
                      Subscribe
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionMode("unsubscribe")}>
                      Unsubscribe
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </form>
          </motion.div>
        </div>
      </TiltCard3D>
    </motion.section>
  );
};

export default StatusSection;
