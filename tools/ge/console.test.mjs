import { describe, expect, test } from "bun:test";
import { common } from "./shared.mjs";
import { consoleCommand } from "./console.mjs";

describe("ge console command registration", () => {
  test("leaf commands expose citty run handlers", () => {
    for (const name of ["deploy", "doctor"]) {
      expect(typeof consoleCommand.subCommands[name]?.run).toBe("function");
    }
  });

  test("deploy exposes tag/no-apply args alongside the shared flags (project/region/json)", () => {
    const deploy = consoleCommand.subCommands.deploy;
    expect(deploy.args.tag.type).toBe("string");
    expect(deploy.args["no-apply"].type).toBe("boolean");
    for (const key of Object.keys(common)) expect(deploy.args[key]).toBeDefined();
  });

  test("doctor is read-only: no args beyond the shared flags (project/region/json)", () => {
    const doctor = consoleCommand.subCommands.doctor;
    expect(Object.keys(doctor.args).sort()).toEqual(Object.keys(common).sort());
  });
});
