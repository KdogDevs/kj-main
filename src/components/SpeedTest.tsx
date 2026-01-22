import { useState, useRef, useEffect } from "react";
import { Play, Square, Globe, MapPin, Server, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const IpRow = ({ label, value }: { label: string; value: string | null }) => {
    const displayValue = loading ? "Loading..." : value || "Not available";
    const canCopy = !loading && value;

    return (
      <div className="flex items-center gap-2 min-w-0">
        <Globe className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm text-muted-foreground flex-shrink-0">{label}:</span>
        <span className="text-sm font-medium text-foreground truncate">{displayValue}</span>
        {canCopy && (
          <button
            onClick={() => copyToClipboard(value)}
            className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
            title="Copy to clipboard"
          >
            {copiedIp === value ? (
              <Check className="w-3 h-3 text-primary" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Network Info */}
      <div className="p-4 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm space-y-3 overflow-hidden">
        {/* IP Addresses */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <IpRow label="IPv4" value={networkInfo?.ipv4 ?? null} />
          <IpRow label="IPv6" value={networkInfo?.ipv6 ?? null} />
        </div>
        
        {/* Location and ISP */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground flex-shrink-0">Location:</span>
            <span className="text-sm font-medium text-foreground truncate">
              {loading ? "Loading..." : networkInfo ? `${networkInfo.city}, ${networkInfo.region}, ${networkInfo.country}` : "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Server className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground flex-shrink-0">ISP:</span>
            <span className="text-sm font-medium text-foreground truncate">
              {loading ? "Loading..." : networkInfo?.isp || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={startTest}
          disabled={isRunning}
          className="rounded-xl"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? "Running..." : "Start Test"}
        </Button>
        {isRunning && (
          <Button
            onClick={resetTest}
            variant="outline"
            className="rounded-xl"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}
      </div>

      {/* OpenSpeedTest Iframe - only shown after clicking Start */}
      {isRunning && (
        <div className="rounded-xl overflow-hidden border border-border/30 bg-background/50 backdrop-blur-sm">
          <iframe
            ref={iframeRef}
            src={`${SPEEDTEST_SERVER}/?Run`}
            className="w-full h-[500px] md:h-[550px]"
            title="Speed Test"
            scrolling="no"
            style={{ overflow: 'hidden' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by OpenSpeedTest • Virginia-based servers
      </p>
    </div>
  );
};

export default SpeedTest;
