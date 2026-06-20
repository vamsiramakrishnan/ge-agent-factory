# Harness Data Model

The harness treats each generated demo as a workspace with four operational surfaces:

1. **Workspace**
   - `workspace.json` is the local manifest.
   - Owns generated files, run logs, mock systems, terminal runs, previews, and registration diagnostics.

2. **Files**
   - Files are listed from the workspace root.
   - Text files can be opened through `/api/workspaces/:id/file?path=...`.
   - Binary and oversized files are intentionally blocked from preview.

3. **Execution**
   - Chat runs invoke an external coding agent and persist SSE logs under `runs/<runId>/events.jsonl`.
   - Terminal actions are named, allowlisted commands only:
     - `uv sync`
     - `uv run pytest`
     - `agents-cli info`
   - ADK Web preview is a managed long-running process, not an arbitrary shell command.

4. **Registration**
   - Local ADK readiness is derived from `app/agent.py`.
   - Deployment readiness is derived from `deployment_metadata.json`.
   - Gemini Enterprise app readiness is derived from `GEMINI_ENTERPRISE_APP_ID` / `ID` or local registration metadata.
   - Published/registered status is derived from a local `gemini_enterprise_registration.json` result file when present.

## Why This Model

The previous UI only knew "there are files." That made it impossible to answer:

- Can I open or inspect an artifact?
- Can I run `uv run pytest` or `agents-cli info` from this workspace?
- Is `adk web` running, and where can I preview it?
- Is this agent local-only, deployed, configured for Gemini Enterprise, or actually registered?

This model makes those states explicit and lets the UI guide the user through build, test, preview, deploy, and register without flooding the page with raw logs.

## Process Split

Run both processes together with Bun during development:

```bash
bun run dev
```

This starts:

- Daemon API: `http://127.0.0.1:17654`
- Web app: `http://127.0.0.1:17655`

You can still run them separately:

```bash
npm run daemon
npm run web
```

Defaults:

- Daemon API: `http://127.0.0.1:17654`
- Web app: `http://127.0.0.1:17655`
- Web-to-daemon proxy: `/api/*` on the web app forwards to `GE_HARNESS_DAEMON_URL` or `http://127.0.0.1:17654`

The legacy combined mode still exists for compatibility:

```bash
node src/cli.js --no-open
```

Use split mode for active UI work so the browser app and backend route table restart independently and version mismatches are obvious.
