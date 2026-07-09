import { serve } from "bun";
import { join } from "node:path";
import { loadAuthConfigFromEnv, verifyGatewayRequest } from "./src/server/iap-jwt.js";

const PORT = process.env.PORT || 8080;
const DIST_DIR = join(import.meta.dirname, "dist");
const AUTH_CONFIG = loadAuthConfigFromEnv();
if (AUTH_CONFIG.requireIap) {
  if (!AUTH_CONFIG.iapAudience) {
    console.warn("REQUIRE_IAP=true but IAP_EXPECTED_AUDIENCE is empty — IAP-signed requests will be rejected.");
  }
  console.log(`IAP middleware ON (audience=${AUTH_CONFIG.iapAudience || "<unset>"}, oidc audiences=${AUTH_CONFIG.oidcAudiences.length})`);
} else {
  console.log("IAP middleware OFF (REQUIRE_IAP != true)");
}

// Security Headers Dictionary
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.google.internal ws://* wss://*; img-src 'self' data: https:;",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

function runtimeConfigScript() {
  const config = {
    factoryApiBase: process.env.VITE_FACTORY_API_BASE || process.env.API_GATEWAY_URL || ""
  };
  return `<script>window.__GE_FACTORY_API_BASE__=${JSON.stringify(config.factoryApiBase)};</script>`;
}

async function serveIndex() {
  const indexFile = Bun.file(join(DIST_DIR, "index.html"));
  if (!(await indexFile.exists())) return null;
  const html = await indexFile.text();
  return new Response(html.replace("</head>", `${runtimeConfigScript()}</head>`), {
    headers: {
      ...SECURITY_HEADERS,
      "Content-Type": "text/html"
    }
  });
}

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (AUTH_CONFIG.requireIap) {
      try {
        await verifyGatewayRequest(req, AUTH_CONFIG);
      } catch (err) {
        return new Response(JSON.stringify({ error: "unauthorized", reason: err.message }), {
          status: 401,
          headers: { ...SECURITY_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ ok: false, error: "Presentation is UI-only; use the console/API gateway for runtime tasks." }), {
        status: 404,
        headers: { ...SECURITY_HEADERS, "Content-Type": "application/json" }
      });
    }

    // Serve Static Assets (Production dist/)
    let relativePath = decodeURIComponent(pathname.slice(1)) || "index.html";

    // Standard defense-in-depth security to prevent directory traversal
    if (relativePath.includes("..") || relativePath.startsWith("/")) {
      return new Response("Forbidden", { status: 403 });
    }

    let filePath = join(DIST_DIR, relativePath);
    let file = Bun.file(filePath);

    if (await file.exists()) {
      if (relativePath === "index.html") {
        const indexResponse = await serveIndex();
        if (indexResponse) return indexResponse;
      }
      return new Response(file, { headers: SECURITY_HEADERS });
    }

    // Catch-all fallback to index.html for Single Page App client-side deep links
    const indexResponse = await serveIndex();
    if (indexResponse) return indexResponse;

    return new Response("Not Found", { status: 404 });
  }
});

console.log(`Bun presentation UI server listening on http://localhost:${server.port}`);
