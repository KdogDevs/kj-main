import { useState, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPEEDTEST_SERVER = "https://speed.kagen.dev";

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const startTest = () => {
    setIsRunning(true);
    if (iframeRef.current) {
      iframeRef.current.src = `${SPEEDTEST_SERVER}/?Run`;
    }
  };

  const resetTest = () => {
    setIsRunning(false);
    if (iframeRef.current) {
      iframeRef.current.src = SPEEDTEST_SERVER;
    }
  };

  return (
    <div className="space-y-4">
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
