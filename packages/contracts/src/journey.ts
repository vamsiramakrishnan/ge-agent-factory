// The canonical lifecycle + fleet shapes shared across GE front-ends and tools.
// Lifted verbatim from apps/console/src/services/geClient.ts (which now re-exports
// these). Keep this PURE: types only, no runtime imports.

export interface FleetBlocker { id: string; message: string; raw?: any }

export interface MissionArtifactRef {
  name?: string;
  type?: string;
  path?: string;
  status?: "missing" | "present" | "invalid" | string;
  error?: string;
  metadata?: {
    size?: number;
    entries?: number;
    files?: number;
    csvFiles?: number;
    rowCount?: number;
    mtime?: string;
    sha256?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FleetActionPlan {
  kind: string;
  label: string;
  owner: string;
  safeToRun: boolean;
  commands: string[];
  route?: string;
  artifactPath?: string;
  taskId?: string;
  agentIds?: string[];
  workspaceIds?: string[];
}

export interface FleetAgent {
  id: string;
  title: string;
  department: string;
  status: string;
  runId: string | null;
  workspaceId: string | null;
  error: string | null;
  stage?: string;
  healthStatus?: string;
  blocker?: FleetBlocker | null;
  nextAction?: string;
  owner?: string;
  runtimeTaskId?: string;
  source?: string;
  actionPlan?: FleetActionPlan;
}

export interface FleetHealth {
  stages: string[];
  byStage: Record<string, number>;
  byHealth: Record<string, number>;
  byOwner: Record<string, number>;
  blocked: number;
  repairable: number;
  bottlenecks: Array<{ id: string; stage: string; blockerId: string; message: string; count: number; owner: string; agentIds: string[]; actionPlan?: FleetActionPlan | null }>;
  agents: FleetAgent[];
}

export interface Fleet { total: number; byDept: Record<string, number>; byStatus: Record<string, number>; agents: FleetAgent[]; health?: FleetHealth }

export interface JourneyStage {
  id: string;
  label: string;
  owner: string;
  status: string;
  blocker?: FleetBlocker | null;
  taskId?: string | null;
  nodeIds?: string[];
  artifacts?: MissionArtifactRef[];
  actionPlan?: FleetActionPlan | null;
}

export interface JourneyPlan {
  kind: "ge.journey.plan";
  version: number;
  id: string;
  mode: string;
  targetStage: string;
  input: { scenario?: string | null; spec?: string | null; usecaseId?: string | null; systems: string[]; ids: string[] };
  status: string;
  next?: JourneyStage | null;
  counts: Record<string, number>;
  stages: JourneyStage[];
  implementation?: Record<string, any>;
}
