"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { Asset, GalleryItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function GaleriaPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<GalleryItem[]>("/gallery/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleFiles = async (files: FileList) => {
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const asset = await api.upload<Asset>("/uploads", file, "image");
        const created = await api.post<GalleryItem>(
          "/gallery",
          { image: { url: asset.url, publicId: asset.publicId }, order: items.length },
          true,
        );
        setItems((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta foto da galeria?")) return;
    setDeleting(id);
    try {
      await api.delete(`/gallery/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader title="Galeria" description="Fotos mostradas na grelha pública (clicáveis para ampliar)." />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 bg-angola-gold text-angola-navy font-semibold px-4 py-2.5 rounded-lg hover:brightness-95 disabled:opacity-60 mb-2"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "A carregar..." : "Carregar fotos"}
      </button>
      <p className="text-xs text-gray-400 mb-6">Podes selecionar várias fotos de uma vez.</p>
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

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há fotos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item._id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image.url} alt={item.caption} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(item._id)}
                disabled={deleting === item._id}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                aria-label="Remover"
              >
                {deleting === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
