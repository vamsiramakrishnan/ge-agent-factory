import { test, expect } from "bun:test";
import {
  commandIdentity,
  normalizeCommandResult,
  normalizeExecFileError,
  runCommand,
} from "./factory-exec.mjs";

test("commandIdentity preserves useful command shape without unbounded args", () => {
  const identity = commandIdentity("gcloud", [
    "run",
    "deploy",
    "service",
    "--project",
    "demo",
    "--region",
    "us-central1",
    "--image",
    "example",
    "--quiet",
  ]);
  expect(identity).toBe("gcloud run deploy service --project demo --region us-central1 --image … +2 args");
});

test("commandIdentity redacts sensitive flags and flag values", () => {
  expect(commandIdentity("tool", ["--token", "abc123", "--password=secret", "--name", "ok"])).toBe(
    "tool --token <redacted> --password=<redacted> --name ok",
  );
});

test("normalizeCommandResult keeps stdout, stderr, code, signal, and failure summary", () => {
  const result = normalizeCommandResult({
    command: "terraform",
    args: ["apply", "-auto-approve"],
    code: 1,
    stdout: "partial output\n",
    stderr: "\nError: quota exceeded\nmore detail\n",
  });
  expect(result.ok).toBe(false);
  expect(result.code).toBe(1);
  expect(result.stdout).toContain("partial output");
  expect(result.stderr).toContain("quota exceeded");
  expect(result.failureLine).toBe("Error: quota exceeded");
  expect(result.message).toContain("terraform apply -auto-approve failed");
});

test("normalizeExecFileError reads status/stdout/stderr from node exec errors", () => {
  const err = new Error("command failed");
  err.status = 7;
  err.stdout = Buffer.from("stdout text");
  err.stderr = Buffer.from("stderr text");
  const result = normalizeExecFileError("gcloud", ["projects", "describe", "demo"], err);
  expect(result.ok).toBe(false);
  expect(result.code).toBe(7);
  expect(result.stdout).toBe("stdout text");
  expect(result.stderr).toBe("stderr text");
  expect(result.failureLine).toBe("stderr text");
});

test("runCommand returns normalized failures when allowFail is true", () => {
  const result = runCommand("bash", ["-c", "echo out; echo err 1>&2; exit 4"], { allowFail: true });
  expect(result.ok).toBe(false);
  expect(result.code).toBe(4);
  expect(result.stdout).toContain("out");
  expect(result.stderr).toContain("err");
});

test("runCommand throws with normalized result when allowFail is false", () => {
  expect(() => runCommand("bash", ["-c", "echo no 1>&2; exit 5"])).toThrow("bash -c");
  try {
    runCommand("bash", ["-c", "echo no 1>&2; exit 5"]);
  } catch (error) {
    expect(error.result.ok).toBe(false);
    expect(error.result.code).toBe(5);
    expect(error.result.stderr).toContain("no");
  }
});

test("runCommand supports timeout normalization", () => {
  const result = runCommand("bash", ["-c", "sleep 1"], { timeoutMs: 25, allowFail: true });
  expect(result.ok).toBe(false);
  expect(result.code).toBe(1);
  expect(result.message).toContain("failed");
});
