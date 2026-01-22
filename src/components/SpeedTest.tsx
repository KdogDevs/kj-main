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

type TestStatus = "idle" | "loading" | "ready" | "running" | "finished" | "error";

const SpeedTest = () => {
  const [status, setStatus] = useState<TestStatus>("loading");
  const [results, setResults] = useState<SpeedTestResults>({
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
  });
  const [currentTest, setCurrentTest] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const workerBlobUrl = useRef<string | null>(null);
  const speedtestRef = useRef<any>(null);

  useEffect(() => {
    const loadSpeedTest = async () => {
      try {
        // Load the main speedtest.js script
        const scriptResponse = await fetch(`${SPEEDTEST_SERVER}/speedtest.js`);
        if (!scriptResponse.ok) throw new Error("Failed to load speedtest.js");
        const scriptText = await scriptResponse.text();
        
        // Load the worker script and create a blob URL
        const workerResponse = await fetch(`${SPEEDTEST_SERVER}/speedtest_worker.js`);
        if (!workerResponse.ok) throw new Error("Failed to load speedtest_worker.js");
        const workerText = await workerResponse.text();
        
        // Create blob URL for worker (bypasses same-origin restriction)
        const workerBlob = new Blob([workerText], { type: "application/javascript" });
        workerBlobUrl.current = URL.createObjectURL(workerBlob);
        
        // Execute the main script
        const scriptBlob = new Blob([scriptText], { type: "application/javascript" });
        const scriptUrl = URL.createObjectURL(scriptBlob);
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.onload = () => {
          console.log("LibreSpeed loaded");
          URL.revokeObjectURL(scriptUrl);
          setStatus("ready");
        };
        script.onerror = () => {
          throw new Error("Failed to execute speedtest.js");
        };
        document.body.appendChild(script);
        
      } catch (error) {
        console.error("Failed to load LibreSpeed:", error);
        setErrorMsg(error instanceof Error ? error.message : "Failed to load speed test");
        setStatus("error");
      }
    };
    
    loadSpeedTest();

    return () => {
      if (speedtestRef.current) {
        try {
          speedtestRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (workerBlobUrl.current) {
        URL.revokeObjectURL(workerBlobUrl.current);
      }
    };
  }, []);

  const startTest = () => {
    if (!(window as any).Speedtest) {
      console.error("Speedtest not loaded");
      setStatus("error");
      setErrorMsg("Speed test library not loaded");
      return;
    }

    if (!workerBlobUrl.current) {
      console.error("Worker not loaded");
      setStatus("error");
      setErrorMsg("Speed test worker not loaded");
      return;
    }

    setStatus("running");
    setResults({ download: 0, upload: 0, ping: 0, jitter: 0 });
    setProgress(0);
    setCurrentTest("Preparing...");

    const s = new (window as any).Speedtest();
    speedtestRef.current = s;

    // Patch the start method to use our blob worker URL
    const originalStart = s.start;
    s.start = function() {
      if (this._state == 3) throw "Test already running";
      
      // Create worker from our blob URL instead of relative path
      this.worker = new Worker(workerBlobUrl.current!);
      
      this.worker.onmessage = function(e: MessageEvent) {
        if (e.data === this._prevData) return;
        else this._prevData = e.data;
        const data = JSON.parse(e.data);
        try {
          if (this.onupdate) this.onupdate(data);
        } catch (err) {
          console.error("Speedtest onupdate event threw exception: " + err);
        }
        if (data.testState >= 4) {
          clearInterval(this.updater);
          this._state = 4;
          try {
            if (this.onend) this.onend(data.testState == 5);
          } catch (err) {
            console.error("Speedtest onend event threw exception: " + err);
          }
        }
      }.bind(this);

      this.updater = setInterval(
        function() {
          this.worker.postMessage("status");
        }.bind(this),
        200
      );

      if (this._state == 1)
        throw "When using multiple points of test, you must call selectServer before starting the test";
      
      if (this._state == 2) {
        this._settings.url_dl = this._selectedServer.server + this._selectedServer.dlURL;
        this._settings.url_ul = this._selectedServer.server + this._selectedServer.ulURL;
        this._settings.url_ping = this._selectedServer.server + this._selectedServer.pingURL;
        this._settings.url_getIp = this._selectedServer.server + this._selectedServer.getIpURL;
      }

      this._state = 3;
      this.worker.postMessage("start " + JSON.stringify(this._settings));
    };

    // Configure for single-server mode using setParameter (stays in state 0)
    s.setParameter("url_dl", `${SPEEDTEST_SERVER}/garbage.php`);
    s.setParameter("url_ul", `${SPEEDTEST_SERVER}/empty.php`);
    s.setParameter("url_ping", `${SPEEDTEST_SERVER}/empty.php`);
    s.setParameter("url_getIp", `${SPEEDTEST_SERVER}/getIP.php`);

    s.onupdate = (data: any) => {
      // testState: -1=not started, 0=starting, 1=download, 2=ping+jitter, 3=upload, 4=finished, 5=aborted
      const stateNames: Record<number, string> = {
        [-1]: "Preparing...",
        0: "Starting...",
        1: "download",
        2: "ping",
        3: "upload",
        4: "",
        5: "aborted"
      };
      
      setCurrentTest(stateNames[data.testState] || "");
      
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

      // Calculate progress based on individual test progress
      const dlProg = data.dlProgress || 0;
      const pingProg = data.pingProgress || 0;
      const ulProg = data.ulProgress || 0;
      const totalProgress = ((dlProg + pingProg + ulProg) / 3) * 100;
      setProgress(Math.round(totalProgress));
    };

    s.onend = (aborted: boolean) => {
      if (aborted) {
        setStatus("ready");
      } else {
        setStatus("finished");
        setProgress(100);
      }
      setCurrentTest("");
    };

    // Start the test
    s.start();
  };

  const resetTest = () => {
    if (speedtestRef.current) {
      try {
        speedtestRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
    setStatus("ready");
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
          disabled={status === "running" || status === "loading"}
          className="rounded-xl"
        >
          <Play className="w-4 h-4 mr-2" />
          {status === "loading" ? "Loading..." : status === "running" ? "Testing..." : "Start Test"}
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
          {errorMsg || "Failed to load speed test. Please check that the server is accessible."}
        </p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by LibreSpeed • Server: speed.kagen.dev
      </p>
    </div>
  );
};

export default SpeedTest;
