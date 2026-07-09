#!/usr/bin/env bun
import { serve } from "bun";
import {
  getFactoryRunSnapshot,
  listAgents,
  preflightTarget,
  submitFactoryRun,
  watchRunEvents,
} from "../src/factory-gateway.js";

const PORT = Number(process.env.PORT || 8080);
const PROVISION_ENABLED = process.env.GE_ENABLE_AGENT_PROVISION === "true";
const CORS_ORIGIN = process.env.GE_GATEWAY_CORS_ORIGIN || "";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none';",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function corsHeaders(req) {
  const origin = req.headers.get("origin") || "";
  if (!CORS_ORIGIN || !origin) return {};
  if (CORS_ORIGIN !== "*" && CORS_ORIGIN !== origin) return {};
  return {
    "Access-Control-Allow-Origin": CORS_ORIGIN === "*" ? origin : CORS_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "authorization,content-type",
    "Vary": "Origin",
  };
}

function sendJson(req, status, data) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...corsHeaders(req),
      "Content-Type": "application/json",
    },
  });
}

function readBody(req) {
  return req.json().catch(() => ({})); // best-effort: malformed bodies degrade to handler validation errors.
}

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (req.method === "OPTIONS" && pathname.startsWith("/api/factory")) {
      return new Response(null, { status: 204, headers: { ...SECURITY_HEADERS, ...corsHeaders(req) } });
    }

    if (pathname === "/healthz") {
      return sendJson(req, 200, { ok: true, service: "ge-factory-gateway" });
    }

    if (!pathname.startsWith("/api/factory")) {
      return sendJson(req, 404, { ok: false, error: "Route not found" });
    }

    if (!PROVISION_ENABLED && req.method === "POST" &&
        (pathname === "/api/factory/usecase" || pathname === "/api/factory/preflight")) {
      return sendJson(req, 403, {
        ok: false,
        error: "Agent provisioning is disabled. Deploy into your own project via the installer (set GE_ENABLE_AGENT_PROVISION=true to re-enable).",
      });
    }

    try {
      if (req.method === "POST" && pathname === "/api/factory/preflight") {
        return sendJson(req, 200, await preflightTarget(await readBody(req)));
      }

      if (req.method === "GET" && pathname === "/api/factory/agents") {
        return sendJson(req, 200, await listAgents({
          projectId: url.searchParams.get("projectId"),
          location: url.searchParams.get("location"),
        }));
      }

      if (req.method === "POST" && pathname === "/api/factory/usecase") {
        return sendJson(req, 200, await submitFactoryRun(await readBody(req)));
      }

      if (req.method === "GET" && pathname.startsWith("/api/factory/runs/")) {
        const parts = pathname.split("/");
        const runId = parts[4];
        const isEvents = parts[5] === "events";
        if (!runId) return sendJson(req, 400, { ok: false, error: "Missing runId parameter" });

        if (!isEvents) return sendJson(req, 200, await getFactoryRunSnapshot(runId));

        const encoder = new TextEncoder();
        let cleanup;
        const stream = new ReadableStream({
          start(controller) {
            cleanup = watchRunEvents(runId, (event) => {
              try {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                if (event.type === "completed" || event.type === "error") {
                  cleanup?.();
                  controller.close();
                }
              } catch {
                cleanup?.();
                controller.close();
              }
            });
          },
          cancel() {
            cleanup?.();
          },
        });
        return new Response(stream, {
          headers: {
            ...SECURITY_HEADERS,
            ...corsHeaders(req),
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }

      return sendJson(req, 404, { ok: false, error: "Route not found" });
    } catch (error) {
      return sendJson(req, 500, { ok: false, error: error?.message || String(error) });
    }
  },
});

console.log(`GE factory gateway listening on http://localhost:${PORT}`);
