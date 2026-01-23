import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Square, Globe, MapPin, Server, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TiltCard3D from "./TiltCard3D";

const SPEEDTEST_SERVER = "https://speed.kagen.dev";

interface NetworkInfo {
  ipv4: string | null;
  ipv6: string | null;
  city: string;
  region: string;
  country: string;
  isp: string;
}

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const [ipv4Result, ipv6Result, locationResult] = await Promise.allSettled([
          fetch("https://api.ipify.org?format=json").then(r => r.json()),
          fetch("https://api64.ipify.org?format=json").then(r => r.json()),
          fetch("https://ipapi.co/json/").then(r => r.json()),
        ]);

        const ipv4 = ipv4Result.status === "fulfilled" ? ipv4Result.value.ip : null;
        const ipv6Raw = ipv6Result.status === "fulfilled" ? ipv6Result.value.ip : null;
        const ipv6 = ipv6Raw && ipv6Raw !== ipv4 && ipv6Raw.includes(":") ? ipv6Raw : null;
        
        const location = locationResult.status === "fulfilled" ? locationResult.value : {};

        setNetworkInfo({
          ipv4,
          ipv6,
          city: location.city || "Unknown",
          region: location.region || "",
          country: location.country_name || "Unknown",
          isp: location.org || "Unknown",
        });
      } catch (error) {
        console.error("Failed to fetch network info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkInfo();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIp(text);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedIp(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const startTest = () => {
    setIsRunning(true);
  };

  const resetTest = () => {
    setIsRunning(false);
  };

  const IpRow = ({ label, value, index }: { label: string; value: string | null; index: number }) => {
    const displayValue = loading ? "Loading..." : value || "Not available";
    const canCopy = !loading && value;

    return (
      <motion.div 
        className="flex items-center gap-2 min-w-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <motion.div
          animate={{ rotate: loading ? 360 : 0 }}
          transition={{ duration: 2, repeat: loading ? Infinity : 0, ease: "linear" }}
        >
          <Globe className="w-4 h-4 text-primary flex-shrink-0" />
        </motion.div>
        <span className="text-sm text-muted-foreground flex-shrink-0">{label}:</span>
        <span className="text-sm font-medium text-foreground truncate">{displayValue}</span>
        {canCopy && (
          <motion.button
            onClick={() => copyToClipboard(value)}
            className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
            title="Copy to clipboard"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {copiedIp === value ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Check className="w-3 h-3 text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Network Info */}
      <TiltCard3D intensity={5}>
        <motion.div 
          className="p-4 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm space-y-3 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* IP Addresses */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <IpRow label="IPv4" value={networkInfo?.ipv4 ?? null} index={0} />
            <IpRow label="IPv6" value={networkInfo?.ipv6 ?? null} index={1} />
          </div>
          
          {/* Location and ISP */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <motion.div 
              className="flex items-center gap-2 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              </motion.div>
              <span className="text-sm text-muted-foreground flex-shrink-0">Location:</span>
              <span className="text-sm font-medium text-foreground truncate">
                {loading ? "Loading..." : networkInfo ? `${networkInfo.city}, ${networkInfo.region}, ${networkInfo.country}` : "Unknown"}
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Server className="w-4 h-4 text-primary flex-shrink-0" />
              </motion.div>
              <span className="text-sm text-muted-foreground flex-shrink-0">ISP:</span>
              <span className="text-sm font-medium text-foreground truncate">
                {loading ? "Loading..." : networkInfo?.isp || "Unknown"}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </TiltCard3D>

      {/* Controls */}
      <motion.div 
        className="flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={startTest}
            disabled={isRunning}
            className="rounded-xl"
          >
            <motion.span
              className="mr-2"
              animate={isRunning ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRunning ? Infinity : 0, ease: "linear" }}
            >
              <Play className="w-4 h-4" />
            </motion.span>
            {isRunning ? "Running..." : "Start Test"}
          </Button>
        </motion.div>
        
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={resetTest}
                variant="outline"
                className="rounded-xl"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* OpenSpeedTest Iframe */}
      <AnimatePresence>
        {isRunning && (
          <motion.div 
            className="rounded-xl overflow-hidden border border-border/30 bg-background/50 backdrop-blur-sm"
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <iframe
              ref={iframeRef}
              src={`${SPEEDTEST_SERVER}/?Run`}
              className="w-full h-[500px] md:h-[550px]"
              title="Speed Test"
              scrolling="no"
              style={{ overflow: 'hidden' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p 
        className="text-xs text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Powered by OpenSpeedTest • Virginia-based servers
      </motion.p>
    </div>
  );
};

export default SpeedTest;
