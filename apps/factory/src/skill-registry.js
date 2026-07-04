import { access, cp, mkdir, readdir, readFile } from "node:fs/promises";
import { parseList } from "@ge/std/list";
import { homedir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import matter from "gray-matter";

export const OFFICIAL_AGENTS_CLI_SKILLS = [
  "google-agents-cli-workflow",
  "google-agents-cli-scaffold",
  "google-agents-cli-adk-code",
  "google-agents-cli-eval",
  "google-agents-cli-deploy",
  "google-agents-cli-publish",
  "google-agents-cli-observability",
];

export const FACTORY_SKILL_BINDINGS = [
  {
    capability: "factory_install",
    stages: ["install", "bootstrap", "setup", "provision", "first_proof"],
    skill: "installing-the-factory",
  },
  {
    capability: "factory_line",
    stages: [
      "user_interview",
      "spec_generation",
      "mission",
      "plan",
      "generate_workspace",
      "generate_data",
      "package_data",
      "harness_refine",
      "validate",
      "preview",
      "promote",
      "plan_deploy",
      "load_data",
      "deploy_runtime",
      "poll_runtime",
      "register_tools",
      "publish_enterprise",
      "verify_live",
      "console_operation",
      "evidence_learning",
    ],
    skill: "navigating-factory-line",
  },
  {
    capability: "spec_interview",
    stages: ["user_interview", "spec_generation", "interview", "brief", "create"],
    skill: "interviewing-specs",
  },
  {
    capability: "mission_planning",
    stages: ["mission", "plan", "deploy_plan", "publish_plan", "local_remote", "ownership"],
    skill: "planning-missions",
  },
  {
    capability: "factory_run",
    stages: ["generate_workspace", "harness_refine", "validate", "preview", "create", "scaffold", "agent", "implementation"],
    skill: "running-factory",
  },
  {
    capability: "simulator_build",
    stages: ["generate_data", "package_data", "mock_data", "data_plan", "tools", "simulation", "simulator", "simulator_seed", "simulator_validate", "mock.generate", "snowfakery.generate", "simulator.seed", "simulator.validate"],
    skill: "building-simulators",
  },
  {
    capability: "workspace_check",
    stages: ["harness_refine", "validate", "preview", "repair", "review", "refine", "local_ready"],
    skill: "checking-workspaces",
  },
  {
    capability: "release_run",
    stages: ["promote", "plan_deploy", "load_data", "deploy_runtime", "poll_runtime", "register_tools", "publish_enterprise", "verify_live", "deploy", "publish"],
    skill: "running-release",
  },
  {
    capability: "release_admission",
    stages: ["promote", "plan_deploy", "passport", "admission", "handoff", "deploy", "publish"],
    skill: "admitting-agents",
  },
  {
    capability: "live_proof",
    stages: ["verify_live", "drive", "bench", "live_proof", "cassette", "evalset_replay", "live_transcript"],
    skill: "driving-live-proof",
  },
  {
    capability: "console_operation",
    stages: ["console_operation", "status", "progress", "artifacts", "versions", "observe", "monitor"],
    skill: "operating-console",
  },
  {
    capability: "evidence_recording",
    stages: ["evidence_learning", "status", "progress", "artifacts", "versions", "observe", "monitor"],
    skill: "recording-evidence",
  },
  {
    capability: "factory_operation",
    stages: ["operate", "orchestrate", "drive", "autopilot", "converge", "decide_next", "console_operation"],
    skill: "operating-the-factory",
  },
  {
    capability: "platform_readiness",
    stages: ["doctor", "readiness", "preflight", "up", "data_up", "mcp_deploy", "plane", "infra", "standup"],
    skill: "standing-up-the-platform",
  },
  {
    capability: "control_plane_deploy",
    stages: ["build_image", "infra_apply", "install", "gateway", "console", "worker", "cloud_run", "image"],
    skill: "deploying-the-control-plane",
  },
  {
    capability: "document_grounding",
    stages: ["upload", "parse", "ground", "brd", "document", "spec_edit", "spec_canvas"],
    skill: "grounding-interviews-with-documents",
  },
  {
    capability: "access_control",
    stages: ["auth", "iap", "invoker", "firebase", "access", "project_target"],
    skill: "managing-access",
  },
  {
    capability: "run_triage",
    stages: ["triage", "blocker", "resume", "diagnose", "failed", "incident", "stuck"],
    skill: "triaging-runs",
  },
  {
    capability: "factory_safety",
    stages: ["safety", "guardrail", "confirm", "readonly", "cross_project", "reversibility"],
    skill: "guarding-the-factory",
  },
  {
    capability: "knowledge_format",
    stages: ["okf", "export_spec", "knowledge_bundle", "brd_authoring", "okf_export"],
    skill: "authoring-okf-specs",
  },
];

export const DEFAULT_SKILL_BINDINGS = [
  ...FACTORY_SKILL_BINDINGS,
  {
    capability: "agents_workflow",
    stages: ["create", "validate", "preview", "deploy", "publish", "observe"],
    skill: "google-agents-cli-workflow",
  },
  {
    capability: "agents_scaffold",
    stages: ["create", "scaffold"],
    skill: "google-agents-cli-scaffold",
  },
  {
    capability: "agents_adk_code",
    stages: ["create", "agent", "implementation", "adk", "local_ready", "review", "refine", "repair"],
    skill: "google-agents-cli-adk-code",
  },
  {
    capability: "agents_eval",
    stages: ["validate", "eval", "test", "iterate", "review", "refine", "repair"],
    skill: "google-agents-cli-eval",
  },
  {
    capability: "agents_deploy",
    stages: ["deploy", "deploy_plan", "deployment"],
    skill: "google-agents-cli-deploy",
  },
  {
    capability: "agents_publish",
    stages: ["publish", "publish_plan", "register", "gemini_enterprise"],
    skill: "google-agents-cli-publish",
  },
  {
    capability: "agents_observability",
    stages: ["observe", "monitor", "observability"],
    skill: "google-agents-cli-observability",
  },
  {
    capability: "brief_intake",
    stages: ["interview", "brief", "create"],
    skill: "interviewing-specs",
  },
  {
    capability: "create_agent",
    stages: ["create", "agent", "local_ready", "implementation", "adk", "review", "refine", "repair"],
    skill: "running-factory",
  },
  {
    capability: "mock_data",
    stages: ["create", "mock_data", "tools", "deploy", "register", "publish"],
    skill: "building-simulators",
  },
  {
    capability: "cloud_mock_data",
    stages: ["mock_data", "deploy", "register", "publish"],
    skill: "building-simulators",
  },
  {
    capability: "source_mapping",
    stages: ["brief", "mock_data", "data_plan"],
    skill: "building-simulators",
  },
  {
    capability: "structured_data",
    stages: ["mock_data", "data_plan", "generate"],
    skill: "building-simulators",
  },
  {
    capability: "oltp_packaging",
    stages: ["mock_data", "data_plan", "deploy"],
    skill: "building-simulators",
  },
  {
    capability: "olap_packaging",
    stages: ["mock_data", "data_plan", "deploy"],
    skill: "building-simulators",
  },
  {
    capability: "blob_packaging",
    stages: ["mock_data", "data_plan", "deploy"],
    skill: "building-simulators",
  },
  {
    capability: "api_service_adapter",
    stages: ["mock_data", "data_plan", "api", "mcp", "deploy"],
    skill: "building-simulators",
  },
  {
    capability: "validate",
    stages: ["validate", "iterate", "repair", "local_ready", "review", "refine"],
    skill: "checking-workspaces",
  },
  {
    capability: "track",
    stages: ["status", "progress", "artifacts", "versions"],
    skill: "recording-evidence",
  },
];

const CAPABILITY_ALIASES = {
  adk_build: ["factory_run", "agents_workflow", "agents_scaffold", "agents_adk_code", "create_agent"],
  implementation: ["factory_run", "agents_adk_code", "create_agent"],
  testing: ["workspace_check", "agents_eval", "validate"],
  review: ["workspace_check", "validate"],
  planning: ["factory_line", "spec_interview", "mission_planning", "agents_workflow", "brief_intake", "track"],
  google_fluency: ["factory_line", "agents_workflow", "simulator_build", "factory_run", "mock_data", "create_agent"],
  mock_data: ["simulator_build", "mock_data", "source_mapping", "structured_data"],
  simulation: ["simulator_build", "mock_data", "source_mapping", "structured_data", "api_service_adapter"],
  simulator: ["simulator_build", "mock_data", "source_mapping", "structured_data", "api_service_adapter"],
  simulator_seed: ["simulator_build", "mock_data", "structured_data"],
  simulator_validate: ["simulator_build", "validate"],
  "mock.generate": ["simulator_build", "mock_data", "source_mapping", "structured_data"],
  "snowfakery.generate": ["simulator_build", "structured_data"],
  "simulator.seed": ["simulator_build", "mock_data", "structured_data"],
  "simulator.validate": ["simulator_build", "validate"],
  cloud_mock_data: ["simulator_build", "cloud_mock_data", "source_mapping", "structured_data", "oltp_packaging", "olap_packaging", "blob_packaging", "api_service_adapter"],
  source_mapping: ["source_mapping"],
  data_plan: ["source_mapping", "structured_data", "cloud_mock_data", "api_service_adapter"],
  api: ["api_service_adapter"],
  rest: ["api_service_adapter"],
  grpc: ["api_service_adapter"],
  mcp: ["api_service_adapter"],
  service_adapter: ["api_service_adapter"],
  snowfakery: ["structured_data"],
  structured_data: ["structured_data"],
  oltp: ["oltp_packaging"],
  olap: ["olap_packaging"],
  alloydb: ["oltp_packaging"],
  firestore: ["oltp_packaging"],
  firebase: ["oltp_packaging"],
  bigtable: ["oltp_packaging"],
  bigquery: ["olap_packaging"],
  cloud_storage: ["blob_packaging"],
  unstructured_blobs: ["blob_packaging"],
  adk_agent: ["create_agent"],
  fixture_tools: ["mock_data"],
  smoke_tests: ["validate"],
  local_preview: ["validate"],
  deploy_plan: ["mission_planning", "release_run", "agents_deploy", "mock_data", "cloud_mock_data"],
  publish_plan: ["mission_planning", "release_run", "agents_publish", "mock_data"],
  deployment: ["release_run", "agents_deploy", "mock_data", "cloud_mock_data"],
  publishing: ["release_run", "agents_publish", "mock_data"],
  observability: ["console_operation", "evidence_recording", "agents_observability"],
  monitoring: ["console_operation", "evidence_recording", "agents_observability"],
  workspace: ["factory_line", "spec_interview", "workspace_check", "track"],
  // ── Operator layer: composition aliases. A single capability term pulls in
  // the conductor skill plus the sub-skills it delegates to. `operating` is the
  // full end-to-end "do what a console operator does" set.
  operating: [
    "factory_operation", "platform_readiness", "factory_line", "spec_interview", "document_grounding",
    "mission_planning", "factory_run", "workspace_check", "simulator_build", "release_run",
    "control_plane_deploy", "run_triage", "access_control", "factory_safety", "console_operation", "evidence_recording",
  ],
  operate: ["factory_operation", "factory_safety"],
  orchestrate: ["factory_operation"],
  autopilot: ["factory_operation", "run_triage", "factory_safety"],
  readiness: ["platform_readiness", "factory_safety"],
  platform_standup: ["platform_readiness", "factory_safety"],
  control_plane: ["control_plane_deploy", "access_control", "factory_safety"],
  install: ["control_plane_deploy", "access_control", "factory_safety"],
  grounding: ["document_grounding", "spec_interview"],
  brd: ["document_grounding", "spec_interview"],
  auth: ["access_control", "factory_safety"],
  iap: ["access_control", "factory_safety"],
  triage: ["run_triage", "evidence_recording", "console_operation"],
  safety: ["factory_safety"],
  guardrail: ["factory_safety"],
};

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  let data;
  try {
    data = matter(text).data || {};
  } catch {
    return {};
  }
  // Preserve the prior contract: scalar strings are trimmed. (A folded `>` YAML
  // scalar keeps a trailing newline that downstream code/tests don't expect.)
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") data[key] = value.trim();
  }
  return data;
}

function normalizeStringList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return parseList(value, /[;,]/);
}

async function loadSkillRouting(registryRoot) {
  const routePath = join(registryRoot, "skills", "skill-routing.json");
  if (!await exists(routePath)) return {};
  try {
    const config = JSON.parse(await readFile(routePath, "utf8"));
    return config?.skills && typeof config.skills === "object" ? config.skills : {};
  } catch (error) {
    throw new Error(`Invalid skills/skill-routing.json: ${error.message}`);
  }
}

export async function loadSkillRegistry(repoRoot) {
  const requestedRoot = resolve(repoRoot);
  const registryRoot = await resolveCanonicalRepoRoot(requestedRoot);
  const repoSkillsRoot = join(registryRoot, "skills");
  const skillRouting = await loadSkillRouting(registryRoot);
  const legacyRepoSkillsRoots = Array.from(new Set([
    join(registryRoot, ".gemini", "skills"),
    join(requestedRoot, ".gemini", "skills"),
  ]));
  const skills = [
    ...await loadRepoSkills({
      repoRoot: registryRoot,
      skillsRoot: repoSkillsRoot,
      origin: "repository",
      rootLabel: "repository skills",
      routing: skillRouting,
    }),
    ...await Promise.all(legacyRepoSkillsRoots.map((skillsRoot) => loadRepoSkills({
      repoRoot: registryRoot,
      skillsRoot,
      origin: "legacy-repository",
      rootLabel: "legacy repository .gemini/skills",
    }))).then((groups) => groups.flat()),
    ...await loadInstalledAgentsCliSkills({ repoRoot: registryRoot }),
  ];
  return {
    root: repoSkillsRoot,
    repositoryRoots: [
      { path: repoSkillsRoot, relativePath: relative(registryRoot, repoSkillsRoot), origin: "repository" },
      ...legacyRepoSkillsRoots.map((skillsRoot) => ({
        path: skillsRoot,
        relativePath: relative(registryRoot, skillsRoot),
        origin: "legacy-repository",
      })),
    ],
    installedRoots: installedAgentsCliSkillRoots(),
    skills,
    bindings: DEFAULT_SKILL_BINDINGS.map((binding) => ({
      ...binding,
      skillPath: skills.find((skill) => skill.id === binding.skill)?.relativePath || defaultSkillPath(binding.skill),
    })),
  };
}

async function resolveCanonicalRepoRoot(startRoot) {
  let current = resolve(startRoot);
  for (let i = 0; i < 5; i += 1) {
    if (await exists(join(current, "skills", "navigating-factory-line", "SKILL.md"))) return current;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return startRoot;
}

async function loadRepoSkills({ repoRoot, skillsRoot, origin = "repository", rootLabel = "repository skills", routing = {} }) {
  const dirs = await readdir(skillsRoot, { withFileTypes: true }).catch(() => []); // best-effort: a repo without a skills dir simply has no repo skills
  const skills = [];
  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;
    const id = dirent.name;
    const path = join(skillsRoot, id, "SKILL.md");
    if (!await exists(path)) continue;
    const text = await readFile(path, "utf8");
    const frontmatter = parseFrontmatter(text);
    const route = routing[id] || {};
    const hasRoutedTriggers = Object.hasOwn(route, "triggers");
    const hasRoutedComposes = Object.hasOwn(route, "composes");
    const routedTriggers = normalizeStringList(route.triggers);
    const routedComposes = normalizeStringList(route.composes);
    skills.push({
      id,
      name: frontmatter.name || id,
      description: frontmatter.description || "",
      path,
      relativePath: relative(repoRoot, path),
      origin,
      rootLabel,
      triggers: hasRoutedTriggers ? routedTriggers : normalizeStringList(frontmatter.triggers),
      // Composition graph: sub-skills this one delegates to / hands off to.
      // Surfaced to the harness so an operator skill pulls in its sub-skills.
      composes: hasRoutedComposes ? routedComposes : normalizeStringList(frontmatter.composes),
      dirname: basename(join(skillsRoot, id)),
    });
  }
  return skills;
}

async function loadInstalledAgentsCliSkills({ repoRoot }) {
  const skills = [];
  const seen = new Set();
  for (const root of installedAgentsCliSkillRoots()) {
    for (const id of OFFICIAL_AGENTS_CLI_SKILLS) {
      if (seen.has(id)) continue;
      const path = join(root, id, "SKILL.md");
      if (!await exists(path)) continue;
      const text = await readFile(path, "utf8");
      const frontmatter = parseFrontmatter(text);
      seen.add(id);
      skills.push({
        id,
        name: frontmatter.name || id,
        description: frontmatter.description || "",
        path,
        relativePath: path,
        repoRelativePath: path.startsWith(`${repoRoot}/`) ? relative(repoRoot, path) : null,
        origin: "agents-cli",
        rootLabel: "installed Agents CLI skills",
        triggers: Array.isArray(frontmatter.triggers) ? frontmatter.triggers : [],
        dirname: basename(join(root, id)),
      });
    }
  }
  return skills;
}

function installedAgentsCliSkillRoots() {
  return Array.from(new Set([
    process.env.AGENTS_CLI_SKILLS_DIR,
    process.env.AGENTS_SKILLS_DIR,
    process.env.AGENTS_HOME ? join(process.env.AGENTS_HOME, "skills") : "",
    join(homedir(), ".agents", "skills"),
  ].filter(Boolean)));
}

function defaultSkillPath(skillId) {
  if (OFFICIAL_AGENTS_CLI_SKILLS.includes(skillId)) return `${join(homedir(), ".agents", "skills", skillId, "SKILL.md")}`;
  if (FACTORY_SKILL_BINDINGS.some((binding) => binding.skill === skillId)) return `skills/${skillId}/SKILL.md`;
  return `.gemini/skills/${skillId}/SKILL.md`;
}

export function selectSkillsForContext({ registry, capabilities = [], stages = [], message = "" } = {}) {
  const selected = new Map();
  const expandedCapabilities = new Set(capabilities);
  for (const capability of capabilities) {
    for (const alias of CAPABILITY_ALIASES[capability] || []) expandedCapabilities.add(alias);
  }
  const stageSet = new Set(stages);
  const text = String(message || "").toLowerCase();

  for (const binding of registry?.bindings || []) {
    const capabilityMatch = expandedCapabilities.has(binding.capability);
    const stageMatch = binding.stages?.some((stage) => stageSet.has(stage));
    if (capabilityMatch || stageMatch) {
      const skill = registry.skills.find((item) => item.id === binding.skill);
      if (skill) selected.set(skill.id, { ...skill, capability: binding.capability, stages: binding.stages });
    }
  }

  for (const skill of registry?.skills || []) {
    if (skill.triggers?.some((trigger) => text.includes(String(trigger).toLowerCase()))) {
      if (!selected.has(skill.id)) selected.set(skill.id, { ...skill, capability: "trigger", stages: [] });
    }
  }

  return Array.from(selected.values());
}

export function renderSkillInstructions(skills = []) {
  if (!skills.length) return "";
  return [
    "## Capability Skills",
    "Before acting, read and follow the relevant local skill files below. Repository skills own the GE factory line: interview, spec, mission, build, simulator data, workspace checks, release, console operation, and evidence learning. Installed Agents CLI skills own ADK mechanics where needed.",
    ...skills.map((skill) => `- ${skill.id}: ${skill.relativePath}${skill.workspaceRelativePath ? `; workspace mirror: ${skill.workspaceRelativePath}` : ""}${skill.capability ? ` (${skill.capability})` : ""}${skill.composes?.length ? ` — composes: ${skill.composes.join(", ")}` : ""}`),
  ].join("\n");
}

export async function materializeSkillsForWorkspace({ skills = [], workspaceDir } = {}) {
  if (!workspaceDir || !Array.isArray(skills) || !skills.length) return skills;
  const mirrored = [];
  for (const skill of skills) {
    const source = skill.path;
    if (!source) {
      mirrored.push(skill);
      continue;
    }
    const workspaceRelativePath = join(".ge-harness", "skills", skill.id, "SKILL.md");
    const destinationDir = join(workspaceDir, ".ge-harness", "skills", skill.id);
    const destination = join(workspaceDir, workspaceRelativePath);
    await mkdir(destinationDir, { recursive: true });
    await cp(dirname(source), destinationDir, { recursive: true, force: true });
    mirrored.push({
      ...skill,
      workspaceRelativePath,
      workspacePath: destination,
    });
  }
  return mirrored;
}
