import { useRef, useState, useEffect } from "react";
import { Camera, User } from "lucide-react";
import { resolveAssetUrl } from "../lib/api.js";

/**
 * Circular avatar picker. Calls onChange(file) with the raw File object
 * (or null if cleared) — the parent form decides what to do with it.
 */
export default function ImageUploadField({ existingUrl, onChange, label = "Photo" }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(existingUrl ? resolveAssetUrl(existingUrl) : "");

  useEffect(() => {
    setPreview(existingUrl ? resolveAssetUrl(existingUrl) : "");
  }, [existingUrl]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-dashed border-glassBorder bg-fg/5 flex items-center justify-center group"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <User size={22} className="text-muted" />
        )}
        <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={16} className="text-white" />
        </span>
      </button>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-accent hover:underline"
        >
          {preview ? "Change photo" : "Upload photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}
