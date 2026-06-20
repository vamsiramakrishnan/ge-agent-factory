#!/usr/bin/env node
import { createServer } from "node:http";
import { parseWorkerPayload, readPayloadArg, runFactoryWorker } from "../src/factory-worker.js";

function readRequestBody(req, { limitBytes = 100_000 } = {}) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
      if (Buffer.byteLength(body, "utf8") > limitBytes) {
        reject(new Error(`Request body exceeds ${limitBytes} bytes`));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function handleHttpRequest(req, res) {
  if (req.method === "GET" && (req.url === "/" || req.url === "/healthz")) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "ge-agent-factory-worker" }));
    return;
  }
  if (req.method !== "POST") {
    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Method Not Allowed. Use POST." }));
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const parsed = rawBody.trim() ? JSON.parse(rawBody) : {};
    const payload = parseWorkerPayload(parsed);
    console.log(`[factory-worker] start stage=${payload.stage} run=${payload.runId} item=${payload.itemId}`);
    const result = await runFactoryWorker(payload, { dryRun: false });
    const statusCode = result.status === "failed" ? 500 : 200;
    res.writeHead(statusCode, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: result.status !== "failed", ...result }));
  } catch (error) {
    console.error("[factory-worker] request failed", error);
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: error.message }));
  }
}

async function main() {
  if (process.env.PORT) {
    const port = Number(process.env.PORT);
    const server = createServer(handleHttpRequest);
    server.listen(port, () => {
      console.log(`[factory-worker] HTTP service listening on port ${port}`);
    });
    return;
  }

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || process.env.GE_AGENT_FACTORY_DRY_RUN === "true";
  const raw = await readPayloadArg(args);
  const payload = parseWorkerPayload(raw);
  const result = await runFactoryWorker(payload, { dryRun });
  console.log(JSON.stringify({ ok: result.status !== "failed", ...result }, null, 2));
  if (result.status === "failed") process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
