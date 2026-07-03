// LiveTarget resolution contract: a live command can only drive a deployed
// agent, and a missing target must fail with the structured four-field error
// (plus stable GELIVE code), never a bare throw.
import { test, expect } from "bun:test";
import { resolveLiveTarget, describeLiveTarget, assistApiEndpoint } from "./target.mjs";
import { isLiveError } from "./errors.mjs";
import { isDxError } from "../errors/dx-error.mjs";

const ENGINE = "projects/p/locations/global/collections/default_collection/engines/my-engine";

test("resolves a full engine resource from geAppId as-is", () => {
  const target = resolveLiveTarget({ geAppId: ENGINE, geLocation: "global", project: "p" });
  expect(target.engine).toBe(ENGINE);
  expect(target.name).toBe(`${ENGINE}/assistants/default_assistant`);
  expect(target.apiEndpoint).toBe("discoveryengine.googleapis.com");
  expect(target.url).toBe(`https://discoveryengine.googleapis.com/v1/${ENGINE}/assistants/default_assistant:streamAssist`);
});

test("expands a bare engine id using project/location/collection defaults", () => {
  const target = resolveLiveTarget({ geAppId: "my-engine", geLocation: "eu", project: "p" });
  expect(target.engine).toBe("projects/p/locations/eu/collections/default_collection/engines/my-engine");
  expect(target.apiEndpoint).toBe("eu-discoveryengine.googleapis.com");
});

test("regional endpoints get the location prefix", () => {
  expect(assistApiEndpoint("global")).toBe("discoveryengine.googleapis.com");
  expect(assistApiEndpoint("us")).toBe("us-discoveryengine.googleapis.com");
});

test("missing geAppId fails with GELIVE001 and a literal fix command", () => {
  let thrown;
  try {
    resolveLiveTarget({ project: "p" });
  } catch (error) {
    thrown = error;
  }
  expect(isLiveError(thrown)).toBe(true);
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.code).toBe("GELIVE001");
  expect(thrown.fix).toBe("ge init");
  expect(thrown.retryable).toBe(false);
});

test("bare engine id without a project fails with GELIVE001", () => {
  let thrown;
  try {
    resolveLiveTarget({ geAppId: "my-engine" });
  } catch (error) {
    thrown = error;
  }
  expect(thrown.code).toBe("GELIVE001");
  expect(thrown.fix).toBe("ge config explain");
});

test("describeLiveTarget never throws — it reports the blocker", () => {
  const blocked = describeLiveTarget({});
  expect(blocked.ok).toBe(false);
  expect(blocked.blocker.code).toBe("GELIVE001");
  const ready = describeLiveTarget({ geAppId: ENGINE });
  expect(ready.ok).toBe(true);
  expect(ready.target.engine).toBe(ENGINE);
});

test("overrides win over config", () => {
  const target = resolveLiveTarget({ geAppId: ENGINE, geLocation: "global" }, { assistant: "support_assistant", expectedAgentId: "agent-7" });
  expect(target.assistant).toBe("support_assistant");
  expect(target.expectedAgentId).toBe("agent-7");
});
