/**
 * Auth & environment setup module.
 *
 * Manages gcloud auth status, ADC credentials, project selection,
 * Gemini Enterprise app discovery, and .env configuration.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { resolveGcpProject } from "@ge/std/gcp-config";

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { timeout: opts.timeout || 15000 });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => { stdout += d; });
    child.stderr?.on("data", (d) => { stderr += d; });
    child.on("close", (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }));
    child.on("error", (e) => resolve({ code: 1, stdout: "", stderr: e.message }));
  });
}

export async function getAuthStatus() {
  const status = {};

  // gcloud account
  const account = await runCmd("gcloud", ["config", "get-value", "account"]);
  status.account = account.code === 0 && account.stdout !== "(unset)" ? account.stdout : null;

  // gcloud project
  const project = await runCmd("gcloud", ["config", "get-value", "project"]);
  status.project = project.code === 0 && project.stdout !== "(unset)" ? project.stdout : null;

  // ADC valid
  const adcPath = join(process.env.HOME || "/root", ".config", "gcloud", "application_default_credentials.json");
  status.adcExists = existsSync(adcPath);
  if (status.adcExists) {
    const adc = await runCmd("gcloud", ["auth", "application-default", "print-access-token"], { timeout: 8000 });
    status.adcValid = adc.code === 0 && adc.stdout.startsWith("ya29.");
  } else {
    status.adcValid = false;
  }

  // agents-cli
  const agentsCli = await runCmd("agents-cli", ["--version"], { timeout: 5000 });
  status.agentsCliInstalled = agentsCli.code === 0;

  // Overall
  status.authenticated = !!(status.account && status.adcValid);
  status.ready = status.authenticated && !!status.project;

  return status;
}

export async function listGeminiEnterpriseApps(projectId) {
  if (!projectId) return [];
  const result = await runCmd("agents-cli", ["publish", "gemini-enterprise", "--list"], { timeout: 30000 });
  if (result.code !== 0) return [];

  const lines = (result.stdout + result.stderr).split("\n");
  const apps = [];
  for (const line of lines) {
    const match = line.match(/│\s*(.+?)\s*│\s*(\w+)\s*│\s*(.+?)\s*│/);
    if (match && !match[1].includes("Display Name") && !line.includes("━") && !line.includes("─")) {
      const name = match[1].trim();
      const loc = match[2].trim();
      const resource = match[3].trim();
      if (name && name !== "Display Name") {
        const idMatch = resource.match(/engines\/([^/\s…]+)/);
        apps.push({ displayName: name, location: loc, resourceName: resource, appId: idMatch?.[1] || name });
      }
    }
  }
  return apps;
}

export async function listProjects() {
  const result = await runCmd("gcloud", ["projects", "list", "--format=json", "--limit=20"], { timeout: 15000 });
  if (result.code !== 0) return [];
  try {
    return JSON.parse(result.stdout).map((p) => ({
      id: p.projectId,
      name: p.name,
      number: p.projectNumber,
    }));
  } catch { return []; }
}

export async function setProject(projectId) {
  const result = await runCmd("gcloud", ["config", "set", "project", projectId]);
  return result.code === 0;
}

export async function readEnvFile(dir) {
  const envPath = join(dir, ".env");
  if (!existsSync(envPath)) return {};
  const content = await readFile(envPath, "utf8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    vars[key] = val;
  }
  return vars;
}

export async function writeEnvFile(dir, vars) {
  const envPath = join(dir, ".env");
  const existing = await readEnvFile(dir);
  const merged = { ...existing, ...vars };
  const lines = [
    "# GE Agent Studio environment configuration",
    "# Auto-generated — edit as needed",
    "",
    "# Google Cloud",
    `GOOGLE_CLOUD_PROJECT=${merged.GOOGLE_CLOUD_PROJECT || ""}`,
    "",
    "# Agent Runtime deployment region (global, us-central1, europe-west1, etc.)",
    `GOOGLE_CLOUD_LOCATION=${merged.GOOGLE_CLOUD_LOCATION || "global"}`,
    "",
    "# Vertex AI / Gemini CLI location",
    `GOOGLE_GENAI_USE_VERTEXAI=${merged.GOOGLE_GENAI_USE_VERTEXAI || "1"}`,
    `GOOGLE_GENAI_LOCATION=${merged.GOOGLE_GENAI_LOCATION || merged.GOOGLE_CLOUD_LOCATION || "global"}`,
    "",
    "# Gemini Enterprise (user-selected: us, eu, global, or specific region)",
    `GEMINI_ENTERPRISE_LOCATION=${merged.GEMINI_ENTERPRISE_LOCATION || "global"}`,
    `GEMINI_ENTERPRISE_APP_ID=${merged.GEMINI_ENTERPRISE_APP_ID || ""}`,
    "",
  ];
  // Preserve any extra vars
  for (const [k, v] of Object.entries(merged)) {
    if (!["GOOGLE_CLOUD_PROJECT", "GOOGLE_CLOUD_LOCATION", "GOOGLE_GENAI_USE_VERTEXAI", "GOOGLE_GENAI_LOCATION", "GEMINI_ENTERPRISE_LOCATION", "GEMINI_ENTERPRISE_APP_ID"].includes(k)) {
      lines.push(`${k}=${v}`);
    }
  }
  await writeFile(envPath, lines.join("\n") + "\n", "utf8");
  return merged;
}

export async function getFullSetupStatus(dataDir) {
  const auth = await getAuthStatus();
  const env = await readEnvFile(dataDir);
  const projectId = env.GOOGLE_CLOUD_PROJECT || resolveGcpProject() || auth.project;
  return {
    auth,
    env: {
      GOOGLE_CLOUD_PROJECT: projectId || null,
      GOOGLE_CLOUD_LOCATION: env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_CLOUD_LOCATION || "global",
      GEMINI_ENTERPRISE_APP_ID: env.GEMINI_ENTERPRISE_APP_ID || process.env.GEMINI_ENTERPRISE_APP_ID || null,
      GOOGLE_GENAI_USE_VERTEXAI: env.GOOGLE_GENAI_USE_VERTEXAI || "1",
      GOOGLE_GENAI_LOCATION: env.GOOGLE_GENAI_LOCATION || process.env.GOOGLE_GENAI_LOCATION || env.GOOGLE_CLOUD_LOCATION || "global",
      GEMINI_ENTERPRISE_LOCATION: env.GEMINI_ENTERPRISE_LOCATION || process.env.GEMINI_ENTERPRISE_LOCATION || "global",
    },
    projectId,
  };
}
