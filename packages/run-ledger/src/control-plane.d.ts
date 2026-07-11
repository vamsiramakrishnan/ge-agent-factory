import type { RunStatus } from "./status";

export declare const CONTROL_PLANE_VERSION: 1;
export declare const RUN_LEDGER_COLLECTION: "factoryRuns";
export declare const FACTORY_STAGE_IDS: readonly string[];
export declare const DEFAULT_FACTORY_STAGE_ORDER: readonly string[];

export declare function stableJson(value: unknown): string;
export declare function contentHash(
  value: unknown,
  options?: { algorithm?: string; length?: number; prefix?: string },
): string;
export declare function cacheKey(
  kind: string,
  material: unknown,
  options?: { version?: string; length?: number },
): string;
export declare function cacheRecord(options?: {
  kind?: string;
  key?: string;
  uri?: string | null;
  hit?: boolean;
  enabled?: boolean;
  material?: unknown;
  now?: string;
}): {
  kind: string;
  key: string;
  uri: string | null;
  hit: boolean;
  enabled: boolean;
  material: unknown;
  checkedAt: string;
};

export declare function cloudTaskId(
  value: string,
  options?: { maxBase?: number; hashLength?: number },
): string;
export declare function stageAttemptKey(input?: {
  runId?: string;
  itemId?: string;
  stage?: string;
  attempt?: number;
}): string;
export declare function deterministicStageTaskId(input?: {
  runId?: string;
  itemId?: string;
  stage?: string;
  attempt?: number;
}): string;

export interface StageFanoutTask {
  key: string;
  taskId: string;
  runId?: string;
  itemId: string;
  workspaceId: string;
  stage?: string;
  attempt: number;
  targetStage?: string | null;
  payload: Record<string, any>;
}

export declare function buildStageFanout(options?: {
  runId?: string;
  stage?: string;
  workItems?: Array<string | Record<string, any>>;
  attempt?: number;
  targetStage?: string | null;
  payloadFor?: ((item: Record<string, any>, base: Record<string, any>) => Record<string, any>) | null;
}): {
  kind: "stage_fanout";
  version: 1;
  runId?: string;
  stage?: string;
  attempt: number;
  targetStage?: string | null;
  total: number;
  tasks: StageFanoutTask[];
};

export declare function summarizeFanIn(options?: {
  items?: Array<Record<string, any> & { status?: string }>;
  targetStage?: string | null;
}): {
  kind: "fan_in_summary";
  version: 1;
  targetStage: string | null;
  total: number;
  done: number;
  failed: number;
  blocked: number;
  running: number;
  pending: number;
  status: RunStatus;
  terminal: boolean;
  ok: boolean | null;
};

export declare function cloudDaemonSnapshot(options?: {
  workers?: Array<Record<string, any> & { status?: string }>;
  queues?: Array<Record<string, any> & { status?: string }>;
  caches?: Array<Record<string, any> & { enabled?: boolean; hit?: boolean }>;
  now?: string;
}): {
  kind: "cloud_daemon_snapshot";
  version: 1;
  status: "healthy" | "degraded";
  checkedAt: string;
  workers: { total: number; ready: number; unhealthy: number };
  queues: { total: number; unhealthy: number };
  caches: { total: number; misses: number };
};
