// Router-level coverage for ge-api-router.mjs. The sibling ge-api.test.mjs
// exercises handleGeApi (the pure route table) and a few handleGeNodeRequest
// runtime-proxy paths; this file covers the request→response mapping the router
// itself owns and that was untested: the fetch (Bun Request) entrypoint
// handleGeFetchRequest, the non-API passthrough, the Firebase auth gate on the
// fetch path, the read-only gate + 405 fallthrough on the /api/systems and
// /api/interviews sub-handlers, and the daemon-unreachable graceful-degradation
// path. All assertions are pure request→response mapping — none needs a live
// daemon (the one runtime test points at a closed port and asserts the fallback).
import { test, expect } from "bun:test";
import { handleGeFetchRequest, handleGeNodeRequest } from "./ge-api-router.mjs";

function fetchReq(path, { method = "GET", headers = {}, body } = {}) {
  return new Request(`http://localhost${path}`, { method, headers, body });
}

// Node req/res doubles mirroring ge-api.test.mjs's makeNodeReqRes.
function nodeReqRes(path, { method = "GET", headers = {}, body } = {}) {
  const chunks = [];
  const req = {
    method,
    url: path,
    headers,
    on() {},
    async *[Symbol.asyncIterator]() {
      if (body) yield Buffer.from(body);
    },
  };
  const res = {
    statusCode: 200, writableEnded: false, destroyed: false, headersSent: false,
    setHeader() {},
    end(chunk) { this.headersSent = true; this.writableEnded = true; chunks.push(String(chunk || "")); },
    writeHead(status) { this.statusCode = status; this.headersSent = true; },
    write(chunk) { chunks.push(String(chunk || "")); },
  };
  return { req, res, chunks };
}

test("fetch path returns null for a non-API url (lets the caller fall through)", async () => {
  const res = await handleGeFetchRequest(fetchReq("/not-an-api-route"));
  expect(res).toBeNull();
});

test("node path calls next() for a non-API url", async () => {
  const { req, res } = nodeReqRes("/index.html");
  let nextCalled = false;
  await handleGeNodeRequest(req, res, () => { nextCalled = true; });
  expect(nextCalled).toBe(true);
  expect(res.headersSent).toBe(false);
});

test("fetch path: Firebase auth gate rejects a tokenless /api/ge request with 401", async () => {
  process.env.GE_AUTH_MODE = "firebase";
  try {
    const res = await handleGeFetchRequest(fetchReq("/api/ge/status"));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("unauthenticated");
  } finally {
    delete process.env.GE_AUTH_MODE;
  }
});

test("fetch path: /api/systems read-only gate blocks a mutating POST with 403", async () => {
  process.env.GE_CONSOLE_READONLY = "1";
  try {
    const res = await handleGeFetchRequest(
      fetchReq("/api/systems/synthesize", { method: "POST", body: "{}" }),
    );
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/read-only/);
  } finally {
    delete process.env.GE_CONSOLE_READONLY;
  }
});

test("fetch path: /api/systems returns 405 for an unsupported method", async () => {
  delete process.env.GE_CONSOLE_READONLY;
  const res = await handleGeFetchRequest(fetchReq("/api/systems", { method: "DELETE" }));
  expect(res.status).toBe(405);
  expect((await res.json()).error).toMatch(/method not allowed/);
});

test("fetch path: /api/interviews read-only gate blocks a document upload with 403", async () => {
  process.env.GE_CONSOLE_READONLY = "1";
  try {
    const res = await handleGeFetchRequest(
      fetchReq("/api/interviews/uc-1/documents", { method: "POST", body: "{}" }),
    );
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/read-only/);
  } finally {
    delete process.env.GE_CONSOLE_READONLY;
  }
});

test("fetch path: /api/interviews returns 405 for an unsupported method", async () => {
  delete process.env.GE_CONSOLE_READONLY;
  const res = await handleGeFetchRequest(
    fetchReq("/api/interviews/uc-1/documents", { method: "DELETE" }),
  );
  expect(res.status).toBe(405);
  expect((await res.json()).error).toMatch(/method not allowed/);
});

test("fetch path: /api/runtime/status degrades to a stopped payload when the daemon is unreachable", async () => {
  delete process.env.GE_CONSOLE_READONLY;
  const previousPort = process.env.GE_DAEMON_PORT;
  process.env.GE_DAEMON_PORT = "9"; // discard port — connection refused
  try {
    const res = await handleGeFetchRequest(fetchReq("/api/runtime/status"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.status).toBe("stopped");
    expect(body.port).toBe(9);
  } finally {
    if (previousPort === undefined) delete process.env.GE_DAEMON_PORT;
    else process.env.GE_DAEMON_PORT = previousPort;
  }
});

test("node path: /api/systems read-only gate blocks a mutating POST with 403", async () => {
  process.env.GE_CONSOLE_READONLY = "1";
  try {
    const { req, res, chunks } = nodeReqRes("/api/systems/synthesize", { method: "POST", body: "{}" });
    await handleGeNodeRequest(req, res, () => { throw new Error("should not fall through"); });
    expect(res.statusCode).toBe(403);
    expect(JSON.parse(chunks[0]).error).toMatch(/read-only/);
  } finally {
    delete process.env.GE_CONSOLE_READONLY;
  }
});
