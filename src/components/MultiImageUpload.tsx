"use client";

import { useState } from "react";
import { ArrowUpFromLine, TrashBin } from "@gravity-ui/icons";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({ values, onChange, maxImages = 3 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (values.length >= maxImages) {
      setError(`Maximum ${maxImages} additional images.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success || !result.data?.url) {
        throw new Error("Upload failed.");
      }

      onChange([...values, result.data.url]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm text-neutral-300 mb-1">
        Additional photos <span className="text-neutral-500">(optional, up to {maxImages})</span>
      </label>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {values.map((url, i) => (
          <div key={i} className="relative rounded-lg overflow-hidden border border-neutral-700 h-20">
            <img src={url} alt={`Extra ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 rounded bg-neutral-900/80 p-1 text-neutral-200 hover:bg-neutral-900"
            >
              <TrashBin width={12} height={12} />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <label className="flex items-center justify-center h-20 rounded-lg border border-dashed border-neutral-700 bg-neutral-800/40 cursor-pointer hover:bg-neutral-800/60 transition">
            {uploading ? (
              <span className="text-xs text-neutral-400">...</span>
            ) : (
              <ArrowUpFromLine width={18} height={18} className="text-neutral-400" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}