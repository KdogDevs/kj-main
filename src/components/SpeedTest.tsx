import { useState, useEffect, useRef, useCallback } from "react";
import { Gauge, Play, Square, ArrowDown, ArrowUp, Activity, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SpeedTestData {
  testState: number;
  dlStatus: string;
  ulStatus: string;
  pingStatus: string;
  jitterStatus: string;
  dlProgress: number;
  ulProgress: number;
  pingProgress: number;
  clientIp: string;
}

declare global {
  interface Window {
    Speedtest: new () => SpeedtestInstance;
  }
}

interface SpeedtestInstance {
  onupdate: ((data: SpeedTestData) => void) | null;
  onend: ((aborted: boolean) => void) | null;
  setParameter: (name: string, value: string | number | boolean) => void;
  start: () => void;
  abort: () => void;
}

const SPEEDTEST_SERVER = "https://speed.kagen.dev";

const SpeedTest = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testState, setTestState] = useState(-1);
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [ping, setPing] = useState("");
  const [jitter, setJitter] = useState("");
  const [progress, setProgress] = useState(0);
  const [clientIp, setClientIp] = useState("");
  const speedtestRef = useRef<SpeedtestInstance | null>(null);

  // Load the LibreSpeed script from the server
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${SPEEDTEST_SERVER}/speedtest.js`;
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load speed test script");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpdate = useCallback((data: SpeedTestData) => {
    setTestState(data.testState);
    
    if (data.dlStatus) setDownloadSpeed(data.dlStatus);
    if (data.ulStatus) setUploadSpeed(data.ulStatus);
    if (data.pingStatus) setPing(data.pingStatus);
    if (data.jitterStatus) setJitter(data.jitterStatus);
    if (data.clientIp) setClientIp(data.clientIp);

    // Calculate overall progress
    const dlProg = data.dlProgress || 0;
    const ulProg = data.ulProgress || 0;
    const pingProg = data.pingProgress || 0;
    
    let overallProgress = 0;
    if (data.testState === 1) {
      overallProgress = dlProg * 33;
    } else if (data.testState === 2) {
      overallProgress = 33 + pingProg * 33;
    } else if (data.testState === 3) {
      overallProgress = 66 + ulProg * 34;
    } else if (data.testState === 4) {
      overallProgress = 100;
    }
    setProgress(overallProgress);
  }, []);

  const handleEnd = useCallback((aborted: boolean) => {
    setIsRunning(false);
    if (aborted) {
      setTestState(-1);
      setProgress(0);
    }
  }, []);

  const startTest = useCallback(() => {
    if (!window.Speedtest) return;

    // Reset state
    setDownloadSpeed("");
    setUploadSpeed("");
    setPing("");
    setJitter("");
    setProgress(0);
    setTestState(0);

    const s = new window.Speedtest();
    speedtestRef.current = s;

    // Configure to use the remote server endpoints
    s.setParameter("url_dl", `${SPEEDTEST_SERVER}/garbage.php`);
    s.setParameter("url_ul", `${SPEEDTEST_SERVER}/empty.php`);
    s.setParameter("url_ping", `${SPEEDTEST_SERVER}/empty.php`);
    s.setParameter("url_getIp", `${SPEEDTEST_SERVER}/getIP.php`);
    s.setParameter("test_order", "IP_D_U");
    s.setParameter("time_dl_max", 10);
    s.setParameter("time_ul_max", 10);

    s.onupdate = handleUpdate;
    s.onend = handleEnd;

    setIsRunning(true);
    s.start();
  }, [handleUpdate, handleEnd]);

  const stopTest = useCallback(() => {
    if (speedtestRef.current) {
      speedtestRef.current.abort();
    }
  }, []);

  const getStatusText = () => {
    switch (testState) {
      case -1: return "Ready to test";
      case 0: return "Initializing...";
      case 1: return "Testing download speed...";
      case 2: return "Testing latency...";
      case 3: return "Testing upload speed...";
      case 4: return "Test complete";
      case 5: return "Test aborted";
      default: return "Ready";
    }
  };

  const formatSpeed = (speed: string) => {
    if (!speed || speed === "Fail") return "—";
    return speed;
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{getStatusText()}</p>
          {clientIp && testState === 4 && (
            <p className="text-xs text-muted-foreground/70 mt-1">Your IP: {clientIp}</p>
          )}
        </div>
        <Button
          onClick={isRunning ? stopTest : startTest}
          disabled={!isLoaded}
          variant={isRunning ? "destructive" : "default"}
          className="rounded-xl min-w-[140px]"
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop Test
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {testState === 4 ? "Test Again" : "Start Test"}
            </>
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}%</p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Download */}
        <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 text-center hover:bg-background/70 transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <ArrowDown className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Download</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {formatSpeed(downloadSpeed)}
          </p>
          <p className="text-xs text-muted-foreground">Mbps</p>
        </div>

        {/* Upload */}
        <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 text-center hover:bg-background/70 transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <ArrowUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Upload</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {formatSpeed(uploadSpeed)}
          </p>
          <p className="text-xs text-muted-foreground">Mbps</p>
        </div>

        {/* Ping */}
        <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 text-center hover:bg-background/70 transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ping</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {formatSpeed(ping)}
          </p>
          <p className="text-xs text-muted-foreground">ms</p>
        </div>

        {/* Jitter */}
        <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 text-center hover:bg-background/70 transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Wifi className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Jitter</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {formatSpeed(jitter)}
          </p>
          <p className="text-xs text-muted-foreground">ms</p>
        </div>
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading speed test...</p>
        </div>
      )}
    </div>
  );
};

export default SpeedTest;
