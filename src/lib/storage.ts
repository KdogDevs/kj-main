// Helper to get public storage URLs
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const getAssetUrl = (filename: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/assets/${filename}`;
};

// Asset filenames - these must match the files uploaded to storage
export const ASSETS = {
  profilePhoto: "profile-photo.jpg",
  projectShift2stream: "project-shift2stream.png",
  projectSchedulespx: "project-schedulespx.png",
} as const;
