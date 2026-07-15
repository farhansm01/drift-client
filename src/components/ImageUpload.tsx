"use client";

import { useState } from "react";
import { ArrowUpFromLine, Picture, TrashBin } from "@gravity-ui/icons";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

interface ImgbbResponse {
  data?: {
    url?: string;
  };
  success: boolean;
  error?: {
    message?: string;
  };
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      if (!apiKey) {
        throw new Error("imgbb API key is not configured.");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result: ImgbbResponse = await response.json();

      if (!result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Upload failed. Please try again.");
      }

      onChange(result.data.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange("");
    setError(null);
  }

  return (
    <div>
      <label className="block text-sm text-neutral-300 mb-1">
        Image <span className="text-neutral-500">(optional)</span>
      </label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-neutral-700">
          <img src={value} alt="Uploaded preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-lg bg-neutral-900/80 p-2 text-neutral-200 hover:bg-neutral-900 transition"
            aria-label="Remove image"
          >
            <TrashBin width={16} height={16} />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-800/40 h-48 cursor-pointer hover:bg-neutral-800/60 transition ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {uploading ? (
            <p className="text-sm text-neutral-400">Uploading...</p>
          ) : (
            <>
              <ArrowUpFromLine width={22} height={22} className="text-neutral-400" />
              <p className="text-sm text-neutral-400">Click to upload an image</p>
              <p className="text-xs text-neutral-500">PNG, JPG up to 5MB</p>
            </>
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

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}