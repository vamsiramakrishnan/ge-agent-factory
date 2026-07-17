import { describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeBinding } from "@ge/byo-systems";
import { dialChecks } from "./systems-dial.mjs";

const okFetch = async (url, init) => new Response(init?.method === "HEAD" ? null : "{}", { status: 200 });
const publicResolver = async () => [{ address: "93.184.216.34", family: 4 }];

describe("dialChecks", () => {
  test("no bindings — one passing informational check, zero dials", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-dial-"));
    try {
      let dialed = 0;
      const result = await dialChecks({
        bindingsDir: dir,
        fetchImpl: async () => {
          dialed++;
          return new Response(null, { status: 200 });
        },
      });
      expect(result.ok).toBe(true);
      expect(result.checks).toHaveLength(1);
      expect(dialed).toBe(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("rest binding: dispatch decision + probe check; only read methods leave", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-dial-"));
    try {
      await writeBinding({
        dir,
        binding: { system: "crm", boundTo: "https://crm.example.com", kind: "rest", mode: "live_first" },
      });
      const methods = [];
      const result = await dialChecks({
        bindingsDir: dir,
        resolveHost: publicResolver,
        fetchImpl: async (url, init) => {
          methods.push(init.method);
          return new Response(null, { status: 200 });
        },
      });
      expect(result.ok).toBe(true);
      const names = result.checks.map((c) => c.name);
      expect(names).toEqual(["dispatch:crm", "dial:crm"]);
      expect(result.checks[0].detail).toContain("reads → live (live_first)");
      expect(result.checks[0].detail).toContain("writes → twin");
      for (const method of methods) expect(["GET", "HEAD"]).toContain(method);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("unauthorized probe fails the check and names the auth env var fix", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-dial-"));
    try {
      await writeBinding({
        dir,
        binding: {
          system: "crm",
          boundTo: "https://crm.example.com",
          kind: "rest",
          mode: "twin_first",
          config: { authEnv: "CRM_TOKEN" },
        },
      });
      const result = await dialChecks({
        bindingsDir: dir,
        env: { CRM_TOKEN: "expired" },
        resolveHost: publicResolver,
        fetchImpl: async () => new Response("{}", { status: 401 }),
      });
      expect(result.ok).toBe(false);
      const dial = result.checks.find((c) => c.name === "dial:crm");
      expect(dial.status).toBe("fail");
      expect(dial.fix).toContain("CRM_TOKEN");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("non-rest bindings are skipped, never dialed", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-dial-"));
    try {
      await writeBinding({ dir, binding: { system: "erp", boundTo: "erp-twin", kind: "twin", mode: "twin_only" } });
      let dialed = 0;
      const result = await dialChecks({
        bindingsDir: dir,
        fetchImpl: async () => {
          dialed++;
          return new Response(null, { status: 200 });
        },
      });
      expect(result.ok).toBe(true);
      expect(result.checks.find((c) => c.name === "dial:erp").detail).toContain("not dialable");
      expect(dialed).toBe(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
