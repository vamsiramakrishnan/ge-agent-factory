import { UseCaseGenerationSpec } from "../types/architecture";
import { authEnabled, getToken } from "../auth/firebase";

export type FactoryStage =
  | "validate"
  | "preview"
  | "plan_deploy"
  | "load_data"
  | "deploy_runtime"
  | "poll_runtime"
  | "register_tools"
  | "publish_enterprise"
  | "verify_live";

export interface TargetProfile {
  projectId: string;
  projectNumber?: string;
  runtimeRegion: string;
  dataRegion?: string;
  genaiLocation: string;
  geminiEnterpriseLocation: string;
  geminiEnterpriseAppId?: string;
  artifactBucket?: string;
  serviceAccount?: string;
}

export interface FactoryRunRequest {
  title: string;
  useCaseId?: string;
  usecaseId?: string;
  department?: string;
  systems?: string[];
  rows?: number | string;
  targetStage?: FactoryStage;
  generationSpec?: UseCaseGenerationSpec;
  /**
   * GCS URI (gs://...) of a console-prebuilt workspace archive. When supplied the
   * bridge skips scaffolding and consumes the archive as-is — pair with
   * `startStage: "load_data"` to begin past the build boundary.
   */
  prebuiltArchive?: string;
  /**
   * Pipeline stage to start from. Defaults are derived server-side
   * (`load_data` for a prebuiltArchive). Passthrough only — the bridge owns the default.
   */
  startStage?: FactoryStage;
  target?: TargetProfile;
}

export interface FactoryRun {
  ok: boolean;
  runId: string;
  workspaceId: string;
  artifactPrefix: string;
  targetStage: FactoryStage;
  project?: string;
  region?: string;
}

export interface FactoryRunStatus {
  ok: boolean;
  run: FactoryRun;
  artifacts: Partial<Record<FactoryStage, {
    status?: string;
    stage?: string;
    nextStage?: string | null;
    error?: string;
    operation?: string;
    buildStatus?: string;
  }>>;
}

export type PreflightCheckStatus = "pass" | "fail" | "skipped";

export interface PreflightCheck {
  id: string;
  label: string;
  status: PreflightCheckStatus;
  detail?: string;
}

export interface PreflightResult {
  ok: boolean;
  message: string;
  /** Structured per-check results from `preflightTarget`. Always present for a successful response. */
  checks?: PreflightCheck[];
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  // When opt-in Firebase auth is on, attach the user's ID token. No-op otherwise.
  const authHeaders: Record<string, string> = {};
  if (authEnabled) {
    const token = await getToken();
    if (token) authHeaders.authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...authHeaders,
      ...(init?.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Factory request failed with HTTP ${response.status}`);
  }
  return data as T;
}

export function startFactoryRun(request: FactoryRunRequest) {
  return jsonFetch<FactoryRun>("/api/factory/usecase", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getFactoryRunStatus(runId: string) {
  return jsonFetch<FactoryRunStatus>(`/api/factory/runs/${encodeURIComponent(runId)}`);
}

export function startPreflight(target: Partial<TargetProfile>) {
  return jsonFetch<PreflightResult>("/api/factory/preflight", {
    method: "POST",
    body: JSON.stringify(target),
  });
}

export function getGeminiAgents(projectId: string, location: string) {
  return jsonFetch<{ ok: boolean; agents: Array<{ id: string; displayName: string }>; error?: string }>(
    `/api/factory/agents?projectId=${encodeURIComponent(projectId)}&location=${encodeURIComponent(location)}`
  );
}
