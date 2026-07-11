import { describe, expect, test } from "bun:test";
import { createGatewayClient } from "./gateway-client.mjs";

describe("gateway client transport", () => {
  test("noProxy uses authenticated direct gateway transport", async () => {
    const calls = [];
    const logs = [];
    const client = createGatewayClient({
      run: (bin, args) => {
        calls.push([bin, args]);
        return { ok: true, out: "id-token\n", err: "" };
      },
    });

    const result = await client.withGateway(
      { gatewayUrl: "https://gateway.example", gatewayTransport: "proxy" },
      async (url, ctx) => ({ url, headers: ctx.headers }),
      { noProxy: true, log: (line) => logs.push(line) },
    );

    expect(result).toEqual({
      url: "https://gateway.example",
      headers: { Authorization: "Bearer id-token" },
    });
    expect(calls).toEqual([["gcloud", ["auth", "print-identity-token", "--audiences=https://gateway.example"]]]);
    expect(logs).toContain("direct gateway https://gateway.example (no proxy)");
  });
});
