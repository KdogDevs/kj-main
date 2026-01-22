import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Upload, XCircle } from "lucide-react";

// Import the bundled assets
import profilePhoto from "@/assets/profile-photo.jpg";
import projectShift2stream from "@/assets/project-shift2stream.png";
import projectSchedulespx from "@/assets/project-schedulespx.png";

const assets = [
  { name: "profile-photo.jpg", url: profilePhoto, type: "image/jpeg" },
  { name: "project-shift2stream.png", url: projectShift2stream, type: "image/png" },
  { name: "project-schedulespx.png", url: projectSchedulespx, type: "image/png" },
];

type UploadStatus = "pending" | "uploading" | "success" | "error";

const SetupAssets = () => {
  const [statuses, setStatuses] = useState<Record<string, UploadStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const uploadAsset = async (asset: typeof assets[0]) => {
    setStatuses(prev => ({ ...prev, [asset.name]: "uploading" }));
    
    try {
      // Fetch the image from the bundled URL
      const response = await fetch(asset.url);
      const blob = await response.blob();
      
      // Upload to Supabase storage
      const { error } = await supabase.storage
        .from("assets")
        .upload(asset.name, blob, {
          contentType: asset.type,
          upsert: true,
        });

      if (error) throw error;
      
      setStatuses(prev => ({ ...prev, [asset.name]: "success" }));
    } catch (err) {
      setStatuses(prev => ({ ...prev, [asset.name]: "error" }));
      setErrors(prev => ({ ...prev, [asset.name]: err instanceof Error ? err.message : "Upload failed" }));
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);
    for (const asset of assets) {
      await uploadAsset(asset);
    }
    setIsUploading(false);
  };

  const getIcon = (status: UploadStatus) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const allDone = assets.every(a => statuses[a.name] === "success");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8">
        <h1 className="text-2xl font-bold mb-2">Setup Assets</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Upload bundled images to storage. Run this once.
        </p>

        <div className="space-y-3 mb-6">
          {assets.map((asset) => (
            <div
              key={asset.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
            >
              {getIcon(statuses[asset.name] || "pending")}
              <span className="font-mono text-sm flex-1">{asset.name}</span>
              {errors[asset.name] && (
                <span className="text-xs text-red-500">{errors[asset.name]}</span>
              )}
            </div>
          ))}
        </div>

        {allDone ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-500 font-medium">All assets uploaded!</p>
            <p className="text-muted-foreground text-sm mt-2">
              You can now delete this page and the src/assets folder.
            </p>
          </div>
        ) : (
          <Button
            onClick={uploadAll}
            disabled={isUploading}
            className="w-full gap-2"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload All Assets
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SetupAssets;
