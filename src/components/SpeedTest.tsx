import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Square, ArrowDown, ArrowUp, Activity, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SpeedTestResult {
  download: string;
  upload: string;
  ping: string;
  jitter: string;
  clientIp: string;
  testState: number;
  progress: number;
}

const SPEEDTEST_SERVER = "https://speed.kagen.dev";

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testState, setTestState] = useState(-1);
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [ping, setPing] = useState("");
  const [jitter, setJitter] = useState("");
  const [progress, setProgress] = useState(0);
  const [clientIp, setClientIp] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== SPEEDTEST_SERVER) return;
      
      const data = event.data as SpeedTestResult;
      if (!data || typeof data.testState === 'undefined') return;

      setTestState(data.testState);
      if (data.download) setDownloadSpeed(data.download);
      if (data.upload) setUploadSpeed(data.upload);
      if (data.ping) setPing(data.ping);
      if (data.jitter) setJitter(data.jitter);
      if (data.clientIp) setClientIp(data.clientIp);
      if (typeof data.progress === 'number') setProgress(data.progress);

      // Test finished or aborted
      if (data.testState === 4 || data.testState === 5) {
        setIsRunning(false);
        if (data.testState === 4) setProgress(100);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const startTest = useCallback(() => {
    setDownloadSpeed("");
    setUploadSpeed("");
    setPing("");
    setJitter("");
    setProgress(0);
    setTestState(0);
    setIsRunning(true);

    // Send start command to iframe
    iframeRef.current?.contentWindow?.postMessage({ command: "start" }, SPEEDTEST_SERVER);
  }, []);

  const stopTest = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ command: "abort" }, SPEEDTEST_SERVER);
    setIsRunning(false);
    setTestState(-1);
    setProgress(0);
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
      {/* Hidden iframe for actual speed test */}
      <iframe
        ref={iframeRef}
        src={`${SPEEDTEST_SERVER}/iframe.html`}
        className="hidden"
        title="Speed Test Engine"
      />

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
    </div>
  );
};

export default SpeedTest;
