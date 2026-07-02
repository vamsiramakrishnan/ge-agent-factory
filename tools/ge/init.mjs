// tools/ge/init.mjs — `ge init` (discover config → .ge.json), including the
// interactive project-resolution prompt. Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core } from "./shared.mjs";

// The one error core.init() throws when discovery finds nothing to work with
// (no terraform outputs, no active gcloud project, no --project flag). This is
// a "missing", not "ambiguous", case — core.init's discovery order (terraform
// outputs → single active gcloud config) never produces multiple candidates.
export const GE_INIT_NO_PROJECT_MESSAGE = "No project. Pass --project or run `gcloud config set project …`.";

// Pure: should `ge init` try to interactively resolve a missing project
// instead of just failing? Only when: discovery actually failed on the "no
// project" case, we're at a real TTY, the user hasn't already passed
// --project (nothing to resolve then — the failure means something else), and
// --json wasn't requested (machine callers must never block on a prompt).
export function shouldPromptForInitProject(error, args, { isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY) } = {}) {
  if (!isTTY) return false;
  if (args?.json) return false;
  if (args?.project) return false;
  return Boolean(error) && error.message === GE_INIT_NO_PROJECT_MESSAGE;
}

// Interactive boundary: the only place that touches @clack/prompts. Offers a
// select() among discovered gcloud projects when listing succeeds with
// candidates, otherwise falls back to a free-text prompt. Ctrl+C cancels
// cleanly (clack's documented isCancel() pattern).
async function promptForInitProject() {
  const clack = await import("@clack/prompts");
  clack.intro("ge init");
  clack.log.warn("No GCP project detected from terraform outputs or `gcloud config`.");

  const listed = core.run("gcloud", ["projects", "list", "--format=value(projectId)"], { allowFail: true });
  const candidates = listed.ok ? listed.out.split("\n").map((line) => line.trim()).filter(Boolean) : [];

  let project;
  if (candidates.length) {
    project = await clack.select({
      message: "Select a GCP project",
      options: candidates.map((value) => ({ value, label: value })),
    });
  } else {
    project = await clack.text({
      message: "GCP project id",
      placeholder: "my-gcp-project",
    });
  }
  if (clack.isCancel(project)) {
    clack.cancel("Cancelled.");
    process.exit(1);
  }

  clack.outro(`Using project ${project}`);
  return project;
}

export const init = defineCommand({
  meta: { name: "init", description: "Discover config (terraform outputs → gcloud) → .ge.json" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    let res;
    try {
      res = await core.init(cfgFrom(args), { log: elog });
    } catch (e) {
      if (!shouldPromptForInitProject(e, args)) throw e;
      const project = await promptForInitProject();
      res = await core.init(cfgFrom({ ...args, project }), { log: elog });
    }
    emit(args, res, (cfg) => {
      out(pc.bold(`Wrote .ge.json — ${pc.cyan(cfg.project)}`));
      for (const [k, v] of Object.entries(cfg)) out(`  ${k.padEnd(16)} ${v ? pc.green(typeof v === "object" ? JSON.stringify(v) : v) : pc.yellow("<unset>")}`);
      if (!cfg.geAppId) out(pc.yellow("\n⚠ geAppId unset — set GEMINI_ENTERPRISE_APP_ID before provisioning."));
    });
  }),
});
