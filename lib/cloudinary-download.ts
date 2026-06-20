/**
 * Converte uma URL de imagem do Cloudinary numa URL que força o download
 * (em vez de abrir no browser), inserindo a flag fl_attachment.
 */
export function downloadUrl(url: string): string {
  if (!url.includes("/upload/")) return url;
  if (url.includes("fl_attachment")) return url;
  return url.replace("/upload/", "/upload/fl_attachment/");
}
