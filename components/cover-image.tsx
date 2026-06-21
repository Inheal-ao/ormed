import { optImg } from "@/lib/img";

/**
 * Mostra a imagem por completo (object-contain) sobre um fundo desfocado da
 * própria imagem — evita cortar cabeças/pessoas sem distorcer a proporção.
 */
export function CoverImage({
  src,
  alt,
  className = "",
  width = 800,
  lazy = true,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  lazy?: boolean;
}) {
  const url = optImg(src, width);
  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      {/* Fundo desfocado para preencher o espaço */}
      <img
        src={optImg(src, 200)}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-40"
      />
      {/* Imagem principal, sempre completa */}
      <img
        src={url}
        alt={alt}
        loading={lazy ? "lazy" : undefined}
        className="relative w-full h-full object-contain"
      />
    </div>
  );
}
