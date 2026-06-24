export type RuntimeEvent = {
  runId?: string;
  agentId?: string;
  stage?: string;
  ts?: string;
  type: string;
  level: string;
  line?: string;
  data?: unknown;
};

export function makeEvent(input?: Partial<RuntimeEvent>): RuntimeEvent;
export function splitLines(): {
  push(chunk: unknown): string[];
  flush(): string[];
};
export function inferLevel(stream: string, line: string): "error" | "warn" | "info";
