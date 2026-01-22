import { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Globe, MapPin, Server, Copy, Check } from "lucide-react";
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
  dns: string[];
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
        // Fetch IPv4, IPv6, and location info in parallel
        const [ipv4Result, ipv6Result, locationResult, dnsResult] = await Promise.allSettled([
          // IPv4
          fetch("https://api.ipify.org?format=json").then(r => r.json()),
          // IPv6 (may fail if not available)
          fetch("https://api64.ipify.org?format=json").then(r => r.json()),
          // Location info
          fetch("https://ipapi.co/json/").then(r => r.json()),
          // DNS leak test
          fetch("https://www.cloudflare.com/cdn-cgi/trace").then(r => r.text()),
        ]);

        const ipv4 = ipv4Result.status === "fulfilled" ? ipv4Result.value.ip : null;
        const ipv6Raw = ipv6Result.status === "fulfilled" ? ipv6Result.value.ip : null;
        // Only show IPv6 if it's different from IPv4 (api64 returns IPv4 if no IPv6)
        const ipv6 = ipv6Raw && ipv6Raw !== ipv4 && ipv6Raw.includes(":") ? ipv6Raw : null;
        
        const location = locationResult.status === "fulfilled" ? locationResult.value : {};
        
        // Parse DNS from Cloudflare trace (extracts resolver info)
        let dns: string[] = [];
        if (dnsResult.status === "fulfilled") {
          // Cloudflare trace doesn't directly show DNS, but we can show the resolver location
          const lines = dnsResult.value.split("\n");
          const colo = lines.find((l: string) => l.startsWith("colo="))?.split("=")[1];
          if (colo) {
            dns.push(`Cloudflare ${colo}`);
          }
        }

        setNetworkInfo({
          ipv4,
          ipv6,
          city: location.city || "Unknown",
          region: location.region || "",
          country: location.country_name || "Unknown",
          isp: location.org || "Unknown",
          dns,
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

  const InfoRow = ({ icon: Icon, label, value, copyable = false }: { 
    icon: any; 
    label: string; 
    value: string; 
    copyable?: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
      {copyable && value !== "Not available" && value !== "Loading..." && (
        <button
          onClick={() => copyToClipboard(value)}
          className="p-1 hover:bg-muted rounded transition-colors"
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

  return (
    <div className="space-y-4">
      {/* Network Info */}
      <div className="p-4 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow 
            icon={Globe} 
            label="IPv4" 
            value={loading ? "Loading..." : networkInfo?.ipv4 || "Not available"}
            copyable
          />
          <InfoRow 
            icon={Globe} 
            label="IPv6" 
            value={loading ? "Loading..." : networkInfo?.ipv6 || "Not available"}
            copyable
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow 
            icon={MapPin} 
            label="Location" 
            value={loading ? "Loading..." : networkInfo ? `${networkInfo.city}, ${networkInfo.region}, ${networkInfo.country}` : "Unknown"}
          />
          <InfoRow 
            icon={Server} 
            label="ISP" 
            value={loading ? "Loading..." : networkInfo?.isp || "Unknown"}
          />
        </div>
        {networkInfo?.dns && networkInfo.dns.length > 0 && (
          <InfoRow 
            icon={Server} 
            label="DNS Resolver" 
            value={networkInfo.dns.join(", ")}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
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
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
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
        Powered by OpenSpeedTest • Server: speed.kagen.dev
      </p>
    </div>
  );
};

export default SpeedTest;
