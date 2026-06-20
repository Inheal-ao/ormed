"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { api } from "@/lib/api";
import { Asset } from "@/lib/admin-types";

interface MultiImageUploadProps {
  label: string;
  value: Asset[];
  onChange: (assets: Asset[]) => void;
}

export function MultiImageUpload({ label, value, onChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError(null);
    setUploading(true);
    try {
      const uploaded: Asset[] = [];
      for (const file of Array.from(files)) {
        const asset = await api.upload<Asset>("/uploads", file, "image");
        uploaded.push({ url: asset.url, publicId: asset.publicId });
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((img, i) => (
            <div key={i} className="relative w-24 h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                aria-label="Remover"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold transition disabled:opacity-60"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "A carregar..." : "Adicionar fotos"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
