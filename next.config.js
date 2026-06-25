/** @type {import('next').NextConfig} */

// Política de Segurança de Conteúdo (CSP) — permite as fontes necessárias
// (Cloudinary, YouTube, API) e bloqueia o resto. Mitiga XSS, clickjacking, etc.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  // Next.js precisa de inline/eval para hidratação; libs (framer/recharts) idem
  // googletagmanager/google-analytics para as estatísticas de visitas
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https://res.cloudinary.com",
  "connect-src 'self' https:",
  "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://res.cloudinary.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // O painel nunca deve ser indexado nem seguido por motores de busca.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
