import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Security headers — single source of truth.
 *
 * At build time this emits:
 *   - dist/_headers  → HTTP response headers on Netlify (incl. frame-ancestors)
 *   - a <meta http-equiv="Content-Security-Policy"> tag in dist/index.html,
 *     so hosts that can't set headers (GitHub Pages) still get a CSP.
 *
 * If you add a new external script, font, image or API host, add it here.
 * Not applied to `npm run dev` (Vite's dev server needs inline scripts).
 */
const csp: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": ["'self'"],
  "style-src": ["'self'", "https://api.fontshare.com", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "data:", "https://cdn.fontshare.com", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "blob:"],
  "connect-src": ["'self'"],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "upgrade-insecure-requests": [],
};

const serializeCsp = (policy: Record<string, string[]>) =>
  Object.entries(policy)
    .map(([directive, values]) => [directive, ...values].join(" "))
    .join("; ");

// frame-ancestors is ignored inside <meta>, so it only goes in the HTTP header.
const metaCsp = serializeCsp(csp);
const headerCsp = serializeCsp({ ...csp, "frame-ancestors": ["'none'"] });

const headersFile = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin

/
  Content-Security-Policy: ${headerCsp}

/index.html
  Content-Security-Policy: ${headerCsp}

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;

function securityHeaders(): Plugin {
  return {
    name: "security-headers",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: metaCsp },
          injectTo: "head-prepend",
        },
      ];
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "_headers", source: headersFile });
    },
  };
}

export default defineConfig({
  plugins: [react(), securityHeaders()],
  base: "./",
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber"],
          motion: ["gsap", "lenis"],
        },
      },
    },
  },
});
