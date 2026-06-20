// Type surface for status.mjs.
export type RunStatus = "pending" | "running" | "blocked" | "done" | "failed";

export declare const RUN_STATUSES: readonly RunStatus[];
export declare const STATUS_MAP: Record<string, RunStatus>;
export declare function normalizeStatus(raw: string | null | undefined): RunStatus;
