import { serve } from "bun";
import { join } from "node:path";
import { handleGeFetchRequest } from "./src/server/ge-api-router.mjs";

const PORT = process.env.PORT || 8080;
const DIST_DIR = join(import.meta.dirname, "dist");

// Security Headers Dictionary
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.google.internal ws://* wss://*; img-src 'self' data: https:;",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // 1. API Route Gateway for GE API
    const geApiResponse = await handleGeFetchRequest(req, { headers: SECURITY_HEADERS });
    if (geApiResponse) return geApiResponse;

    // 2. Serve Static Assets (Production dist/)
    let relativePath = decodeURIComponent(pathname.slice(1)) || "index.html";

    // Standard defense-in-depth security to prevent directory traversal
    if (relativePath.includes("..") || relativePath.startsWith("/")) {
      return new Response("Forbidden", { status: 403 });
    }

    let filePath = join(DIST_DIR, relativePath);
    let file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file, {
        headers: SECURITY_HEADERS
      });
    }

    // 3. Catch-all fallback to index.html for Single Page App client-side deep links
    const indexFile = Bun.file(join(DIST_DIR, "index.html"));
    if (await indexFile.exists()) {
      return new Response(indexFile, {
        headers: {
          ...SECURITY_HEADERS,
          "Content-Type": "text/html"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
});

console.log(`GE Agent Factory Console production server listening on http://localhost:${server.port}`);
