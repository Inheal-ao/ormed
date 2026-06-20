/**
 * Otimiza uma URL de imagem do Cloudinary: formato automático (WebP/AVIF),
 * qualidade automática e largura máxima — reduz muito o tamanho e acelera o site.
 * URLs não-Cloudinary (ex.: /images/...) são devolvidas sem alteração.
 */
export function optImg(url: string | undefined | null, width = 800): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
}
