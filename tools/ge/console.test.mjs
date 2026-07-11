import { describe, expect, test } from "bun:test";
import { parseArgs } from "citty";
import { common } from "./shared.mjs";
import { consoleCommand } from "./console.mjs";

describe("ge console command registration", () => {
  test("leaf commands expose citty run handlers", () => {
    for (const name of ["deploy", "doctor"]) {
      expect(typeof consoleCommand.subCommands[name]?.run).toBe("function");
    }
  });

  test("deploy exposes tag/apply args alongside the shared flags (project/region/json)", () => {
    const deploy = consoleCommand.subCommands.deploy;
    expect(deploy.args.tag.type).toBe("string");
    expect(deploy.args.apply.type).toBe("boolean");
    expect(deploy.args.apply.default).toBe(true);
    for (const key of Object.keys(common)) expect(deploy.args[key]).toBeDefined();
  });

  test("citty parses the documented --no-apply flag as apply=false", () => {
    const deploy = consoleCommand.subCommands.deploy;
    expect(parseArgs(["--no-apply"], deploy.args).apply).toBe(false);
  });

  test("doctor is read-only: no args beyond the shared flags (project/region/json)", () => {
    const doctor = consoleCommand.subCommands.doctor;
    expect(Object.keys(doctor.args).sort()).toEqual(Object.keys(common).sort());
  });
});
