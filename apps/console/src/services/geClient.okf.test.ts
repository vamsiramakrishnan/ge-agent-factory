import { afterEach, expect, test } from "bun:test";
import { ge, type SpecOkfBundle } from "./geClient";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("ge.interviewOkf GETs the okf route and returns the path->markdown bundle", async () => {
  const bundle: SpecOkfBundle = {
    id: "hr-onboarding",
    conceptCount: 2,
    files: {
      "index.md": "# Onboarding\n",
      "concepts/query-1.md": "## Query\n",
    },
  };
  let calledUrl: string | null = null;
  let calledMethod: string | undefined;
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    calledUrl = String(url);
    calledMethod = init?.method;
    return new Response(JSON.stringify(bundle), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  const result = await ge.interviewOkf("hr-onboarding");

  expect(calledUrl).toBe("/api/interviews/hr-onboarding/okf");
  // j() defaults to GET (no method on init for a plain read).
  expect(calledMethod).toBeUndefined();
  expect(result).toEqual(bundle);
  expect(Object.keys(result.files)).toContain("index.md");
});

test("ge.interviewOkf URL-encodes the use case id", async () => {
  let calledUrl: string | null = null;
  globalThis.fetch = (async (url: string) => {
    calledUrl = String(url);
    return new Response(JSON.stringify({ id: "x", conceptCount: 0, files: {} }), { status: 200 });
  }) as typeof fetch;

  await ge.interviewOkf("acme/hr team");
  expect(calledUrl).toBe("/api/interviews/acme%2Fhr%20team/okf");
});

test("ge.interviewOkf surfaces a typed error when the spec is absent (404)", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ error: "no agent-spec available to convert to OKF for this use case" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    })) as typeof fetch;

  let caught: any = null;
  try {
    await ge.interviewOkf("missing");
  } catch (err) {
    caught = err;
  }
  expect(caught).not.toBeNull();
  expect(caught.status).toBe(404);
  expect(caught.detail).toContain("no agent-spec available");
});
