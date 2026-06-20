"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { Asset } from "@/lib/admin-types";

interface MediaUploadProps {
  label: string;
  kind: "image" | "pdf";
  value: Asset | null;
  onChange: (asset: Asset | null) => void;
}

export function MediaUpload({ label, kind, value, onChange }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const asset = await api.upload<Asset>("/uploads", file, kind);
      onChange({ url: asset.url, publicId: asset.publicId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {value?.url ? (
        <div className="relative inline-block">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.url}
              alt="pré-visualização"
              className="w-40 h-40 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-sm text-angola-navy"
            >
              <FileText className="w-5 h-5" />
              Ver PDF carregado
            </a>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            aria-label="Remover"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold transition disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "A carregar..." : `Carregar ${kind === "image" ? "imagem" : "PDF"}`}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={kind === "image" ? "image/*" : "application/pdf"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
