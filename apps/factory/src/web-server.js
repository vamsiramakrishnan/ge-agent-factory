import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { controlAuthVerdict } from "../../../tools/lib/control-auth.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const WEB_ROOT = join(REPO_ROOT, "web");

function text(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "content-type": contentType });
  res.end(body);
}

function serveStatic(res, pathname) {
  const target = pathname === "/" ? join(WEB_ROOT, "index.html") : join(WEB_ROOT, pathname);
  const resolved = resolve(target);
  if (!resolved.startsWith(WEB_ROOT) || !existsSync(resolved) || !statSync(resolved).isFile()) {
    text(res, 404, "not found");
    return;
  }
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
  };
  text(res, 200, readFileSync(resolved), types[extname(resolved)] || "application/octet-stream");
}

async function proxyToDaemon(req, res, daemonUrl) {
  const target = new URL(req.url, daemonUrl);
  const headers = { ...req.headers };
  delete headers.host;
  const response = await fetch(target, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
    duplex: req.method === "GET" || req.method === "HEAD" ? undefined : "half",
  });
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  if (!response.body) {
    res.end();
    return;
  }
  for await (const chunk of response.body) {
    res.write(chunk);
  }
  res.end();
}

function adkProxyPathFromReferer(req, pathname, search = "") {
  const referer = req.headers.referer || req.headers.referrer || "";
  const match = String(referer).match(/\/api\/(?:workspaces|projects)\/([^/]+)\/adk-proxy(?:\/|$)/);
  if (!match) return null;
  if (pathname.startsWith("/dev/build_graph_image/")) {
    pathname = pathname.replace("/dev/build_graph_image/", "/dev/build_graph/");
  }
  return `/api/workspaces/${match[1]}/adk-proxy${pathname}${search || ""}`;
}

function isAdkRootRequest(pathname) {
  return pathname === "/list-apps"
    || pathname === "/run_sse"
    || pathname.startsWith("/apps/")
    || pathname.startsWith("/dev/");
}

export async function startWebServer({
  port = 17655,
  host = "127.0.0.1",
  daemonUrl = "http://127.0.0.1:17654",
  returnServer = false,
} = {}) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    try {
      // Guard privileged (state-changing / GCP-touching) routes. Static UI assets
      // stay open so the console can load; the daemon proxy + ADK routes require
      // a loopback Host (DNS-rebinding defense) or GE_CONTROL_TOKEN if configured.
      const privileged = url.pathname.startsWith("/api/") || isAdkRootRequest(url.pathname);
      if (privileged) {
        const verdict = controlAuthVerdict(req.headers);
        if (!verdict.ok) {
          text(res, verdict.status, verdict.message);
          return;
        }
      }
      if (url.pathname.startsWith("/api/")) {
        await proxyToDaemon(req, res, daemonUrl);
        return;
      }
      if (isAdkRootRequest(url.pathname)) {
        const proxyPath = adkProxyPathFromReferer(req, url.pathname, url.search);
        if (proxyPath) {
          req.url = proxyPath;
          await proxyToDaemon(req, res, daemonUrl);
          return;
        }
      }
      if (req.method === "GET" || req.method === "HEAD") {
        serveStatic(res, url.pathname);
        return;
      }
      text(res, 404, "not found");
    } catch (error) {
      if (!res.headersSent && !res.writableEnded) {
        res.writeHead(502, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error), daemonUrl }));
        return;
      }
      if (!res.writableEnded) res.destroy(error instanceof Error ? error : undefined);
    }
  });

  await new Promise((resolveListen) => server.listen(port, host, resolveListen));
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  const url = `http://${host}:${actualPort}`;
  if (returnServer) return { server, url };
  return url;
}
