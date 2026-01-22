import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Download, Upload, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPEEDTEST_SERVER = "https://speed.kagen.dev";

interface SpeedTestResults {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

type TestStatus = "idle" | "running" | "finished" | "error";

const SpeedTest = () => {
  const [status, setStatus] = useState<TestStatus>("idle");
  const [results, setResults] = useState<SpeedTestResults>({
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
  });
  const [currentTest, setCurrentTest] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const speedtestRef = useRef<any>(null);

  useEffect(() => {
    // Load LibreSpeed script
    const script = document.createElement("script");
    script.src = `${SPEEDTEST_SERVER}/speedtest.js`;
    script.async = true;
    script.onload = () => {
      console.log("LibreSpeed loaded");
    };
    script.onerror = () => {
      console.error("Failed to load LibreSpeed");
      setStatus("error");
    };
    document.body.appendChild(script);

    return () => {
      if (speedtestRef.current) {
        speedtestRef.current.abort();
      }
      document.body.removeChild(script);
    };
  }, []);

  const startTest = () => {
    if (!(window as any).Speedtest) {
      console.error("Speedtest not loaded");
      setStatus("error");
      return;
    }

    setStatus("running");
    setResults({ download: 0, upload: 0, ping: 0, jitter: 0 });
    setProgress(0);

    const s = new (window as any).Speedtest();
    speedtestRef.current = s;

    // Configure to use your server
    s.setParameter("url_dl", `${SPEEDTEST_SERVER}/garbage.php`);
    s.setParameter("url_ul", `${SPEEDTEST_SERVER}/empty.php`);
    s.setParameter("url_ping", `${SPEEDTEST_SERVER}/empty.php`);
    s.setParameter("url_getIp", `${SPEEDTEST_SERVER}/getIP.php`);

    s.onupdate = (data: any) => {
      setCurrentTest(data.testState === 1 ? "download" : data.testState === 3 ? "upload" : data.testState === 2 ? "ping" : "");
      
      if (data.dlStatus) {
        setResults(prev => ({ ...prev, download: parseFloat(data.dlStatus) || 0 }));
      }
      if (data.ulStatus) {
        setResults(prev => ({ ...prev, upload: parseFloat(data.ulStatus) || 0 }));
      }
      if (data.pingStatus) {
        setResults(prev => ({ ...prev, ping: parseFloat(data.pingStatus) || 0 }));
      }
      if (data.jitterStatus) {
        setResults(prev => ({ ...prev, jitter: parseFloat(data.jitterStatus) || 0 }));
      }

      // Calculate progress based on test state
      const stateProgress: Record<number, number> = { 1: 25, 2: 50, 3: 75, 4: 100 };
      setProgress(stateProgress[data.testState] || 0);
    };

    s.onend = () => {
      setStatus("finished");
      setProgress(100);
      setCurrentTest("");
    };

    s.start();
  };

  const resetTest = () => {
    if (speedtestRef.current) {
      speedtestRef.current.abort();
    }
    setStatus("idle");
    setResults({ download: 0, upload: 0, ping: 0, jitter: 0 });
    setProgress(0);
    setCurrentTest("");
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    isActive 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    unit: string; 
    isActive: boolean;
  }) => (
    <div className={`relative p-4 rounded-xl border transition-all duration-300 ${
      isActive 
        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
        : "border-border/30 bg-background/50"
    } backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${isActive ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">
          {value.toFixed(value < 10 ? 2 : 1)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={startTest}
          disabled={status === "running"}
          className="rounded-xl"
        >
          <Play className="w-4 h-4 mr-2" />
          {status === "running" ? "Testing..." : "Start Test"}
        </Button>
        {(status === "running" || status === "finished") && (
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

      {/* Progress Bar */}
      {status === "running" && (
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center capitalize">
            {currentTest ? `Testing ${currentTest}...` : "Preparing..."}
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={Download} 
          label="Download" 
          value={results.download} 
          unit="Mbps"
          isActive={currentTest === "download"}
        />
        <StatCard 
          icon={Upload} 
          label="Upload" 
          value={results.upload} 
          unit="Mbps"
          isActive={currentTest === "upload"}
        />
        <StatCard 
          icon={Activity} 
          label="Ping" 
          value={results.ping} 
          unit="ms"
          isActive={currentTest === "ping"}
        />
        <StatCard 
          icon={Zap} 
          label="Jitter" 
          value={results.jitter} 
          unit="ms"
          isActive={currentTest === "ping"}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive text-center">
          Failed to load speed test. Please check that the server is accessible.
        </p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by LibreSpeed • Server: speed.kagen.dev
      </p>
    </div>
  );
};

export default SpeedTest;
