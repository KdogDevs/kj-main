import { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPEEDTEST_SERVER = "https://speed.kagen.dev";

interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
}

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Fetch user's IP and location
    const fetchIpInfo = async () => {
      try {
        const response = await fetch("https://ip-api.com/json/?fields=query,city,regionName,country,isp");
        if (response.ok) {
          const data = await response.json();
          setIpInfo({
            ip: data.query,
            city: data.city,
            region: data.regionName,
            country: data.country,
            isp: data.isp,
          });
        }
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
      } finally {
        setIpLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  const startTest = () => {
    setIsRunning(true);
  };

  const resetTest = () => {
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {/* IP and Location Info */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">IP:</span>
          <span className="text-sm font-medium text-foreground">
            {ipLoading ? "Loading..." : ipInfo?.ip || "Unknown"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Location:</span>
          <span className="text-sm font-medium text-foreground">
            {ipLoading ? "Loading..." : ipInfo ? `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}` : "Unknown"}
          </span>
        </div>
        {ipInfo?.isp && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">ISP:</span>
            <span className="text-sm font-medium text-foreground">{ipInfo.isp}</span>
          </div>
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
