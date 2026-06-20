import { execFileSync } from "node:child_process";

const DEFAULT_IDENTITY_ARG_LIMIT = 8;
const REDACTED_VALUE = "<redacted>";

const SENSITIVE_FLAG_PATTERNS = [
  /token/i,
  /secret/i,
  /password/i,
  /credential/i,
  /key-file/i,
];

function toText(value) {
  if (value == null) return "";
  if (Buffer.isBuffer(value)) return value.toString("utf8");
  return String(value);
}

function firstLine(text) {
  return toText(text).split(/\r?\n/).find((line) => line.trim()) || "";
}

function isSensitiveFlag(arg) {
  return SENSITIVE_FLAG_PATTERNS.some((pattern) => pattern.test(arg));
}

function redactArgs(args = []) {
  const out = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = String(args[i]);
    const eq = arg.indexOf("=");
    if (eq > 0 && isSensitiveFlag(arg.slice(0, eq))) {
      out.push(`${arg.slice(0, eq + 1)}${REDACTED_VALUE}`);
      continue;
    }
    if (isSensitiveFlag(arg) && i + 1 < args.length) {
      out.push(arg, REDACTED_VALUE);
      i += 1;
      continue;
    }
    out.push(arg);
  }
  return out;
}

export function commandIdentity(command, args = [], { argLimit = DEFAULT_IDENTITY_ARG_LIMIT } = {}) {
  const safeArgs = redactArgs(args);
  const shown = safeArgs.slice(0, argLimit);
  const suffix = safeArgs.length > shown.length ? ` … +${safeArgs.length - shown.length} args` : "";
  return [command, ...shown].join(" ") + suffix;
}

export function normalizeCommandResult({ command, args = [], code = 0, signal = null, stdout = "", stderr = "", error = null } = {}) {
  const normalizedCode = Number.isInteger(code) ? code : 1;
  const normalizedStdout = toText(stdout);
  const normalizedStderr = toText(stderr || error?.stderr || error?.message);
  const ok = normalizedCode === 0 && !signal && !error;
  const identity = commandIdentity(command, args);
  const failureLine = firstLine(normalizedStderr) || firstLine(normalizedStdout) || firstLine(error?.message);
  return {
    ok,
    command,
    args: [...args],
    identity,
    code: normalizedCode,
    signal,
    stdout: normalizedStdout,
    stderr: normalizedStderr,
    error,
    failureLine,
    message: ok ? "" : `${identity} failed${signal ? ` (${signal})` : ""}: ${failureLine || "no output"}`,
  };
}

export function normalizeExecFileError(command, args = [], error) {
  return normalizeCommandResult({
    command,
    args,
    code: Number.isInteger(error?.status) ? error.status : 1,
    signal: error?.signal || null,
    stdout: error?.stdout,
    stderr: error?.stderr,
    error,
  });
}

export function runCommand(command, args = [], { cwd, env, capture = true, allowFail = false, timeoutMs } = {}) {
  try {
    const stdout = execFileSync(command, args, {
      cwd,
      env,
      timeout: timeoutMs,
      encoding: "utf8",
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    return normalizeCommandResult({ command, args, stdout });
  } catch (error) {
    const result = normalizeExecFileError(command, args, error);
    if (allowFail) return result;
    const wrapped = new Error(result.message);
    wrapped.cause = error;
    wrapped.result = result;
    throw wrapped;
  }
}
