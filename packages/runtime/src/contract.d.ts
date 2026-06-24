export type ArtifactRef = {
  name: string;
  type: string;
  path: string | null;
  status: string;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
};

export type Blocker = {
  id: string;
  message: string;
  detail?: unknown;
  [key: string]: unknown;
};

export function normalizeBlocker(blocker?: unknown): Blocker;
export function normalizeArtifactRef(ref?: unknown): ArtifactRef;
export function normalizeRuntimeEvent(event?: unknown): Record<string, unknown>;
export function normalizeResumePlan(plan?: Record<string, unknown> | null, task?: Record<string, unknown>): Record<string, unknown>;
export function runtimeTaskPresentation(task?: Record<string, unknown>): Record<string, unknown>;
export function normalizeRuntimeTask(task?: Record<string, unknown>): Record<string, unknown>;
