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
      <label className="block text-sm font-semibold text-[#232c33] mb-1.5">
        Additional photos <span className="text-[#9a8f97] font-normal">(optional, up to {maxImages})</span>
      </label>

      <div className="grid grid-cols-3 gap-3 mb-2">
        {values.map((url, i) => (
          <div key={i} className="relative rounded-lg overflow-hidden border border-[#b2b2b2] h-24 shadow-sm">
            <img src={url} alt={`Extra ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1.5 right-1.5 rounded bg-[#232c33]/80 p-1.5 text-white hover:bg-[#232c33] transition"
            >
              <TrashBin width={14} height={14} />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <label className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed border-[#b2b2b2] bg-[#e9e3e6]/40 cursor-pointer hover:bg-[#e9e3e6]/80 hover:border-[#232c33] transition text-[#232c33]">
            {uploading ? (
              <span className="text-xs font-medium text-[#9a8f97]">Uploading...</span>
            ) : (
              <>
                <ArrowUpFromLine width={20} height={20} className="text-[#232c33]" />
                <span className="text-xs font-semibold text-[#232c33] mt-1">Add photo</span>
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
      </div>

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}