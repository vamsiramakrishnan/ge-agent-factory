import { serve } from "bun";
import { join } from "node:path";
import {
  preflightTarget,
  submitFactoryRun,
  getFactoryRunSnapshot,
  watchRunEvents,
  listAgents
} from "./src/server/factory-bridge.js";
import { loadAuthConfigFromEnv, verifyGatewayRequest } from "./src/server/iap-jwt.js";
import { firebaseAuthMode, bearerFrom, verifyFirebaseIdToken } from "./src/server/firebase-auth.mjs";

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

    // Optional opt-in Firebase auth. Inert unless GE_AUTH_MODE=firebase.
    // Gates only /api/* (not static SPA assets); the IAP path above is unchanged.
    if (firebaseAuthMode() && pathname.startsWith("/api/")) {
      try {
        const token = bearerFrom(req.headers.get("authorization"), req.url);
        if (!token) throw new Error("missing token");
        await verifyFirebaseIdToken(token);
      } catch {
        return new Response(JSON.stringify({ error: "unauthenticated" }), {
          status: 401,
          headers: { ...SECURITY_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    // 1. API Route Gateway for Factory Bridge
    if (pathname.startsWith("/api/factory")) {
      const sendJson = (status, data) => {
        return new Response(JSON.stringify(data, null, 2), {
          status,
          headers: {
            ...SECURITY_HEADERS,
            "Content-Type": "application/json"
          }
        });
      };

      // Per-agent cloud provisioning is DISABLED by default — it would deploy into a
      // target GCP project from the central worker (a cross-project surface). The
      // supported path is the self-service installer (deploy into your own project).
      // Opt back in for a trusted env with GE_ENABLE_AGENT_PROVISION=true.
      const PROVISION_ENABLED = process.env.GE_ENABLE_AGENT_PROVISION === "true";
      if (!PROVISION_ENABLED && req.method === "POST" &&
          (pathname === "/api/factory/usecase" || pathname === "/api/factory/preflight")) {
        return sendJson(403, {
          ok: false,
          error: "Agent provisioning is disabled. Deploy into your own project via the installer (set GE_ENABLE_AGENT_PROVISION=true to re-enable).",
        });
      }

      try {
        if (req.method === "POST" && pathname === "/api/factory/preflight") {
          const body = await req.json().catch(() => ({}));
          const result = await preflightTarget(body);
          return sendJson(200, result);
        }

        if (req.method === "GET" && pathname === "/api/factory/agents") {
          const projectId = url.searchParams.get("projectId");
          const location = url.searchParams.get("location");
          const result = await listAgents({ projectId, location });
          return sendJson(200, result);
        }

        if (req.method === "POST" && pathname === "/api/factory/usecase") {
          const body = await req.json().catch(() => ({}));
          const result = await submitFactoryRun(body);
          return sendJson(200, result);
        }

        if (req.method === "GET" && pathname.startsWith("/api/factory/runs/")) {
          const parts = pathname.split("/");
          const runId = parts[4];
          const isEvents = parts[5] === "events";

          if (!runId) {
            return sendJson(400, { error: "Missing runId parameter" });
          }

          if (isEvents) {
            const encoder = new TextEncoder();
            let cleanup;
            const stream = new ReadableStream({
              start(controller) {
                cleanup = watchRunEvents(runId, (event) => {
                  try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                    if (event.type === "completed" || event.type === "error") {
                      cleanup();
                      controller.close();
                    }
                  } catch (err) {
                    cleanup();
                    controller.close();
                  }
                });
              },
              cancel() {
                if (cleanup) cleanup();
              }
            });

            return new Response(stream, {
              headers: {
                ...SECURITY_HEADERS,
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
              }
            });
          } else {
            const result = await getFactoryRunSnapshot(runId);
            return sendJson(200, result);
          }
        }

        return sendJson(404, { error: "Route not found" });
      } catch (error) {
        return sendJson(500, { ok: false, error: error.message });
      }
    }

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

console.log(`Bun presentation production server listening on http://localhost:${server.port}`);
