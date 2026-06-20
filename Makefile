# GE Agent Factory — one-command setup + operations.
# Run `make` (or `make help`) to list targets.

SHELL := /bin/bash
REPO  := $(shell pwd)
BIN   ?= $(HOME)/.local/bin
TF_VERSION ?= 1.9.8
# Cross-runtime skills dir a headless agent harness (Antigravity, agents-cli,
# Codex, Gemini) scans. Override to install elsewhere: make skills-install AGENTS_SKILLS_DIR=...
AGENTS_SKILLS_DIR ?= $(HOME)/.agents/skills

.DEFAULT_GOAL := help


.PHONY: help next bootstrap all setup install uninstall deps data-runtime deps-terraform skills-sync skills-doctor skills-spec-audit skills-install doctor doctor-local devex-check devex-smoke up cutover \
        provision provision-local sync sync-local mcp dev build \
        console presentation generator build-console build-presentation serve-console serve-presentation

help: ## Show this help (grouped by section)
	@printf "\n\033[1mGE Agent Factory — what should I run?\033[0m\n"
	@printf "\n\033[1mBig picture\033[0m\n"
	@printf "  This repo is an agent factory: it turns a business use case into a generated,\n"
	@printf "  testable, deployable Gemini Enterprise agent. The flow is:\n"
	@printf "    1. Pick or interview for a spec\n"
	@printf "    2. Generate mock data, simulator behavior, agent code, tests, and evals\n"
	@printf "    3. Validate locally up to preview\n"
	@printf "    4. Optionally ship the checked workspace to your cloud project for data load,\n"
	@printf "       runtime deploy, tool registration, publish, and live verification\n"
	@printf "\n"
	@printf "  \033[36mLocal mode\033[0m is for development: fast iteration, generated workspaces, tests,\n"
	@printf "  simulator data, and preview checks on your machine.\n"
	@printf "  \033[36mRemote mode\033[0m is for release: the cloud factory builds/deploys/publishes in\n"
	@printf "  your GCP project after the platform planes are ready.\n"
	@printf "  \033[36mConsole\033[0m is the main UI over the same engine: Pipeline, spec search, Fleet,\n"
	@printf "  Activity, Doctor, blockers, artifacts, and run controls.\n"
	@printf "\n\033[1mStart here (local development, no cloud deploy required)\033[0m\n"
	@printf "  \033[36mmake setup\033[0m                 Install deps, sync catalog/skills, install the ge command, start the daemon\n"
	@printf "  \033[36mmake doctor-local\033[0m          Check local tools: Bun, uv, Python, agents-cli, cache, harness wiring\n"
	@printf "  \033[36mmake devex-check\033[0m           Fast gate: local doctor, docs links, workspace manifest contracts\n"
	@printf "  \033[36mmake devex-smoke\033[0m           Prove the local path: doctor → local mode → one validated canary workspace\n"
	@printf "  \033[36mmake console\033[0m               Open the operator UI for Pipeline, Fleet, Activity, Doctor, and generated specs\n"
	@printf "  \033[36mmake provision-local CANARY=1\033[0m Build one generated agent locally up to the preview/build boundary\n"
	@printf "\n\033[1mWhich local app should I run?\033[0m\n"
	@printf "  \033[36mconsole\033[0m       The day-to-day developer/operator UI: choose specs, run Pipeline, inspect runs and blockers\n"
	@printf "  \033[36mpresentation\033[0m  The transformation deck and source use-case catalog used to explain the system\n"
	@printf "  \033[36mgenerator\033[0m     Lower-level generator workbench for mock data, harness runs, and generated workspaces\n"
	@printf "\n\033[1mIf you are deploying to a cloud project\033[0m\n"
	@printf "  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>\n"
	@printf "  \033[36mmake bootstrap CANARY=1\033[0m     Stand up planes and prove one agent end to end\n"
	@printf "\n\033[1mNeed a status-based recommendation?\033[0m  Run \033[36mmake next\033[0m\n"
	@awk 'BEGIN{FS=":.*?## "} \
	  /^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0,5); next} \
	  /^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

next: ## Explain the next useful command and show the ge status board when available
	@printf "\n\033[1mRecommended next steps\033[0m\n"
	@printf "  Fresh clone or broken deps:       \033[36mmake setup\033[0m\n"
	@printf "  Local health check:               \033[36mmake doctor-local\033[0m\n"
	@printf "  Fast DevEx gate:                  \033[36mmake devex-check\033[0m\n"
	@printf "  One-command local proof:          \033[36mmake devex-smoke\033[0m\n"
	@printf "  Open the main UI:                 \033[36mmake console\033[0m  (http://localhost:18260)\n"
	@printf "  Build one agent locally:          \033[36mmake mode-local && make provision-local CANARY=1\033[0m\n"
	@printf "  Watch runs and blockers:          \033[36mmake console\033[0m  then open Activity, or run \033[36mge agents status --watch\033[0m\n"
	@printf "  Cloud install / deploy path:      \033[36mmake bootstrap CANARY=1\033[0m  after setting GEMINI_ENTERPRISE_APP_ID\n"
	@printf "  Before pushing code:              \033[36mmake ci\033[0m\n"
	@printf "\n\033[1mCurrent factory status\033[0m\n"
	@command -v bun >/dev/null 2>&1 && bun tools/ge.mjs || printf "  Bun is not available yet. Run make setup first.\n"

##@ Setup & toolchain

bootstrap: ## END-TO-END: toolchain + `ge init` + `ge up` (factory+data+tool planes → doctor). Needs GEMINI_ENTERPRISE_APP_ID + gcloud auth. CANARY=1 also builds one agent.
	@if [ -z "$$GEMINI_ENTERPRISE_APP_ID" ] && [ ! -f .ge.json ]; then \
	  echo "✗ Set GEMINI_ENTERPRISE_APP_ID first (your Gemini Enterprise app resource name), e.g."; \
	  echo "    export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>"; \
	  exit 1; fi
	@command -v gcloud >/dev/null 2>&1 || { echo "✗ gcloud not found — install + 'gcloud auth login' first: https://cloud.google.com/sdk/docs/install"; exit 1; }
	@echo "── 1/3  toolchain (bun · uv · agents-cli · antigravity · terraform) ──"
	@$(MAKE) -s setup
	@echo ""
	@echo "── 2/3  discover config → .ge.json ──"
	@bun tools/ge.mjs init
	@echo ""
	@echo "── 3/3  stand up the platform (terraform: factory + data stores + IAM → images → MCP services → doctor) ──"
	@bun tools/ge.mjs up
	@if [ -n "$(CANARY)" ]; then echo ""; echo "── canary: build one agent end-to-end ──"; bun tools/ge.mjs agents build --canary; fi
	@echo ""
	@echo "✓ Bootstrap complete. Next: ge agents build --all   ·   console: make console   ·   local-only: make mode-local && make provision-local CANARY=1"

all: bootstrap ## Alias for `bootstrap`

setup: ## Install JS deps + Python/uv toolchain + put `ge` on PATH
	bun install
	@chmod +x tools/ge.mjs tools/mcp-server.mjs 2>/dev/null || true
	@$(MAKE) -s catalog
	@$(MAKE) -s deps
	@$(MAKE) -s install
	@$(MAKE) -s skills-sync
	@bun tools/ge.mjs daemon start || true
	@echo ""
	@echo "Setup done."
	@echo "Next:"
	@echo "  make doctor-local                 # confirm local tools are ready"
	@echo "  make console                      # open the Pipeline/Fleet/Activity UI"
	@echo "  make mode-local && make provision-local CANARY=1"
	@echo "                                    # build one agent locally up to preview"

catalog: ## Generate the use-case catalog build artifact (git-ignored) from the slide + interview registries
	@cd apps/ge-demo-generator && bun scripts/sync-use-cases-from-slides.mjs

ci: ## Run the CI gate locally (source hygiene + full bun test suite) — mirrors cloudbuild.ci.yaml
	@bun run source:hygiene
	@$(MAKE) -s catalog
	@bun test apps tools

install-hooks: ## Install the git pre-commit hook (fast: runs source hygiene before each commit)
	@mkdir -p .git/hooks
	@ln -sf ../../tools/hooks/pre-commit .git/hooks/pre-commit
	@chmod +x tools/hooks/pre-commit
	@echo "Installed pre-commit hook → tools/hooks/pre-commit (full suite runs in CI / make ci)"

deps: ## Install the local toolchain: uv, agents-cli, + repo .venv with google-antigravity SDK
	@command -v uv >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh
	@uv tool install 'google-agents-cli>=0.2,<0.3' || true  # pin <0.3: keeps 'eval run --all' (removed in 0.3+/0.5)
	@echo "Creating repo .venv (uv) + installing google-antigravity SDK (no system Python pollution)…"
	@test -x .venv/bin/python || uv venv --python 3.11 .venv || uv venv .venv
	@.venv/bin/python -c "import google.antigravity" 2>/dev/null \
	  || uv pip install --python .venv/bin/python -q google-antigravity \
	  || echo "⚠  could not install google-antigravity into .venv — check uv + network"
	@.venv/bin/python -c "import google.antigravity" 2>/dev/null \
	  && echo "✓ google.antigravity importable (.venv)" \
	  || echo "✗ google.antigravity NOT importable — local (Antigravity) mode will fail"
	@echo "Installing the simulator-runtime package (editable) into .venv — the BYO synthesis CLI imports it…"
	@.venv/bin/python -c "import simulator_runtime" 2>/dev/null \
	  || uv pip install --python .venv/bin/python -q -e packages/simulator-runtime \
	  || echo "⚠  could not install simulator-runtime into .venv — BYO synthesis will fail to import simulator_runtime"
	@.venv/bin/python -c "import simulator_runtime" 2>/dev/null \
	  && echo "✓ simulator_runtime importable (.venv)" \
	  || echo "✗ simulator_runtime NOT importable — BYO synthesis (console) will fail"
	@$(MAKE) -s data-runtime
	@$(MAKE) -s deps-terraform
	@command -v gcloud >/dev/null 2>&1 \
	  && echo "✓ gcloud present" \
	  || echo "⚠  gcloud not found — needed for cloud ops (up/data/mcp/provision). Install: https://cloud.google.com/sdk/docs/install"

data-runtime: ## Warm the local data-generation runtime used by mission mock/simulator stages
	@command -v uv >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh
	@mkdir -p .ge/cache/uv
	@echo "Warming Snowfakery runtime in .ge/cache/uv…"
	@UV_CACHE_DIR=.ge/cache/uv uv run --refresh --with snowfakery --with 'setuptools<81' python -c "import snowfakery, pkg_resources; print('✓ snowfakery runtime ready')" \
	  || echo "⚠  could not warm Snowfakery runtime — mock/simulator missions will pause at data readiness until network/cache is available"

deps-terraform: ## Install terraform $(TF_VERSION) into ~/.local/bin (cloud infra prereq for `ge up`/`data up`)
	@command -v terraform >/dev/null 2>&1 && { echo "✓ terraform $$(terraform version | head -1)"; exit 0; } || true
	@command -v unzip >/dev/null 2>&1 || { echo "✗ need 'unzip' to install terraform (apt-get install unzip / brew install unzip)"; exit 1; }
	@os=$$(uname -s | tr '[:upper:]' '[:lower:]'); arch=$$(uname -m); \
	  case "$$arch" in x86_64|amd64) arch=amd64;; aarch64|arm64) arch=arm64;; esac; \
	  url="https://releases.hashicorp.com/terraform/$(TF_VERSION)/terraform_$(TF_VERSION)_$${os}_$${arch}.zip"; \
	  echo "Downloading $$url"; mkdir -p "$(BIN)"; tmp=$$(mktemp -d); \
	  curl -fsSL "$$url" -o "$$tmp/tf.zip" && unzip -oq "$$tmp/tf.zip" -d "$$tmp" \
	    && mv "$$tmp/terraform" "$(BIN)/terraform" && chmod +x "$(BIN)/terraform" && rm -rf "$$tmp" \
	    && echo "✓ installed terraform $(TF_VERSION) → $(BIN)/terraform" \
	    || { echo "✗ terraform install failed — see https://developer.hashicorp.com/terraform/install"; exit 1; }
	@case ":$$PATH:" in *":$(BIN):"*) : ;; \
	  *) echo "⚠  $(BIN) is not on PATH. Add:  export PATH=\"$(BIN):$$PATH\"" ;; esac

install: ## Install the `ge` command into ~/.local/bin (override with BIN=...)
	@mkdir -p "$(BIN)"
	@printf '#!/usr/bin/env bash\nexec bun "%s/tools/ge.mjs" "$$@"\n' "$(REPO)" > "$(BIN)/ge"
	@chmod +x "$(BIN)/ge"
	@echo "Installed: $(BIN)/ge"
	@case ":$$PATH:" in *":$(BIN):"*) : ;; \
	  *) echo "⚠  $(BIN) is not on PATH. Add:  export PATH=\"$(BIN):$$PATH\"" ;; esac

uninstall: ## Remove the `ge` command
	@rm -f "$(BIN)/ge" && echo "removed $(BIN)/ge"

##@ Skills (harness)

skills-sync: ## Validate repository skills and write the harness skill manifest
	@node scripts/sync-harness-skills.mjs

skills-doctor: ## Verify the harness skill manifest is current and complete
	@node scripts/sync-harness-skills.mjs --check
	@bun apps/ge-demo-generator/src/cli.js skills >/dev/null
	@echo "✓ harness skills are discoverable"

skills-spec-audit: ## Report Agent Skills spec portability gaps for repo skills
	@node skills/navigating-factory-line/scripts/audit-agent-skills-spec.mjs

skills-install: ## Install repo skills into a headless harness (AGENTS_SKILLS_DIR, default ~/.agents/skills) + sync manifest
	@$(MAKE) -s skills-sync
	@mkdir -p "$(AGENTS_SKILLS_DIR)"
	@for d in $(REPO)/skills/*/; do \
	  name=$$(basename "$$d"); \
	  ln -sfn "$$d" "$(AGENTS_SKILLS_DIR)/$$name"; \
	done
	@echo "✓ linked $$(ls -1d skills/*/ | wc -l | tr -d ' ') skills -> $(AGENTS_SKILLS_DIR)"
	@echo "  headless: source .ge/skills/env.sh && ge daemon start     (or: ge mcp-server)"
	@echo "  uninstall: rm -f $(AGENTS_SKILLS_DIR)/*  (symlinks only)"

##@ Platform ops (cloud build + deploy)

doctor: ## Cloud preflight (APIs, IAM, IAP, memory, health)
	@bun tools/ge.mjs doctor

doctor-local: ## Local toolchain preflight (uv, python 3.11, agents-cli, shared cache)
	@bun tools/ge.mjs doctor --local

devex-check: ## Fast DevEx gate: local doctor + docs links + workspace manifest contracts (ID=<workspace-or-usecase>)
	@bun tools/ge.mjs devex check $(if $(ID),--id "$(ID)",)

devex-smoke: ## One-command local proof: doctor → local mode → one validated canary workspace (ID=<usecase> TARGET=validated|previewed)
	@bun tools/ge.mjs devex smoke $(if $(ID),--id "$(ID)",) $(if $(TARGET),--target "$(TARGET)",)

up: ## Terraform apply → build → re-apply → init → doctor (fresh project)
	@bun tools/ge.mjs up

cutover: ## Adopt a hand-managed project into Terraform (plan; APPLY=1 to apply)
	@bun tools/ge.mjs cutover $(if $(APPLY),--apply,)

data: ## Data plane: terraform apply (GCS/BigQuery/AlloyDB/Bigtable/Firestore) → merge coords into .ge.json
	@bun tools/ge.mjs data up

data-doctor: ## Check shared data stores and local mock/simulator data runtime
	@bun tools/ge.mjs data doctor

mcp-deploy: ## Tool plane: deploy the 5 per-department custom MCP services to Cloud Run (fleet-level)
	@bun tools/ge.mjs mcp deploy

mcp-doctor: ## Check the per-department MCP services + Agent Registry readiness
	@bun tools/ge.mjs mcp doctor

status: ## Status board: project/app, mode, planes ✓/○, next command
	@bun tools/ge.mjs

mode-local: ## Switch to local mode (build on this machine, up to the build boundary)
	@bun tools/ge.mjs mode local

mode-remote: ## Switch to remote mode (cloud factory builds + deploys)
	@bun tools/ge.mjs mode remote

provision: ## Build agents in the active mode (CANARY=1 for one, else --all)
	@bun tools/ge.mjs agents build $(if $(CANARY),--canary,--all)

provision-local: ## Build agents on this machine via the Antigravity harness (CANARY=1 for one)
	@bun tools/ge.mjs agents build --local $(if $(CANARY),--canary,--all)

sync: ## Sync generated agent code → git (active mode; GCS in remote, workspaces in local)
	@bun tools/ge.mjs agents sync --push

sync-local: ## Push locally-generated agents to the dedicated repo (creates it if missing)
	@bun tools/ge.mjs agents sync --local --create --push

mcp-server: ## Run the factory's MCP server (stdio) for harness/model callers
	@bun tools/mcp-server.mjs

mcp: mcp-server ## Alias for mcp-server (the tool-plane deploy is `make mcp-deploy`)

##@ Dev — run ONE app locally (bare `make dev` lists them, starts nothing)

dev: ## Explain console/presentation/generator and how to run one local app (starts nothing)
	@bun scripts/dev-help.mjs || true

console: ## Run the main ops UI: Pipeline, specs, Fleet, Activity, Doctor → http://localhost:18260
	@cd apps/console && bun install && bun run dev

presentation: ## Run the transformation deck and source use-case catalog → http://localhost:18250
	@cd apps/presentation && bun install && bun run dev

generator: ## Run the lower-level generator workbench for mock data/workspaces → http://localhost:17655
	@bun run --filter ./apps/ge-demo-generator dev

build-console: ## Production build of the console (apps/console/dist)
	@cd apps/console && bun install && bun run build

build-presentation: ## Production build of the deck (apps/presentation/dist)
	@cd apps/presentation && bun install && bun run build

serve-console: ## Serve the built console via Bun (PORT, default 8261)
	@cd apps/console && PORT=$${PORT:-8261} bun run start

serve-presentation: ## Serve the built deck via Bun (PORT, default 8251)
	@cd apps/presentation && PORT=$${PORT:-8251} bun run start
