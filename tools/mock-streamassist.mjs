#!/usr/bin/env bun
// Mock assist surface — serve a recorded cassette over HTTP with the REST
// streaming wire shape (a JSON array of StreamAssistResponse objects,
// delivered chunk-by-chunk with the recorded timing offsets).
//
// Lets anything that speaks the REST endpoint (console dev, curl, load
// tools) exercise the full live path with zero cloud calls:
//
//   bun tools/mock-streamassist.mjs --cassette tools/lib/live/fixtures/success.ndjson
//   curl -sN -X POST localhost:8199/v1/<assistant>:streamAssist -d '{"query":{"text":"hi"}}'
//
// Turn selection: requests without a session play turn 0; each request that
// carries the session returned by the previous turn advances to the next
// recorded turn. --speed scales the recorded delays (0 = no delays).
import { parseArgs } from "node:util";
import { readCassette } from "./lib/live/cassette.mjs";

const { values: args } = parseArgs({
  options: {
    cassette: { type: "string" },
    port: { type: "string", default: "8199" },
    speed: { type: "string", default: "1" },
  },
});

if (!args.cassette) {
  process.stderr.write("usage: bun tools/mock-streamassist.mjs --cassette <path> [--port 8199] [--speed 1|0]\n");
  process.exit(1);
}

const cassette = readCassette(args.cassette);
const speed = Number(args.speed);
const sessionTurns = new Map(); // session → next turn index

function turnIndexFor(session) {
  if (!session || session === "-") return 0;
  return sessionTurns.get(session) ?? 0;
}

const server = Bun.serve({
  port: Number(args.port),
  async fetch(request) {
    if (request.method !== "POST" || !request.url.includes(":streamAssist")) {
      return new Response(JSON.stringify({ error: "POST …:streamAssist only" }), { status: 404 });
    }
    let body = {};
    try {
      body = await request.json();
    } catch { /* best-effort: an empty/non-JSON body still plays turn 0, matching how replays ignore query text */ }
    const index = turnIndexFor(body.session);
    const turn = cassette.turns[index];
    if (!turn) return new Response(JSON.stringify({ error: `cassette has no turn ${index}` }), { status: 400 });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode("["));
        let previousAt = 0;
        for (let i = 0; i < turn.chunks.length; i += 1) {
          const { atMs, json } = turn.chunks[i];
          const delay = Math.max(0, (atMs - previousAt) * speed);
          previousAt = atMs;
          if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
          controller.enqueue(encoder.encode((i ? "," : "") + JSON.stringify(json)));
          const session = json?.sessionInfo?.session;
          if (session) sessionTurns.set(session, index + 1);
        }
        controller.enqueue(encoder.encode("]"));
        controller.close();
      },
    });
    return new Response(stream, { headers: { "content-type": "application/json" } });
  },
});

process.stderr.write(`mock assist surface on http://localhost:${server.port} — replaying ${args.cassette} (${cassette.turns.length} turn(s), speed ×${speed})\n`);
