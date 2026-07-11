#!/usr/bin/env bash
set -euo pipefail

AGENTS_CLI_VERSION="$(cat /opt/ge/agents-cli-version.txt)"
command -v agents-cli >/dev/null 2>&1 || uv tool install "google-agents-cli==${AGENTS_CLI_VERSION}"
export PATH="$HOME/.local/bin:$PATH"
mkdir -p artifacts
PROJECT_ID="${PROJECT_ID:-${GOOGLE_CLOUD_PROJECT:-${GCLOUD_PROJECT:-${GE_AGENT_FACTORY_PROJECT:-}}}}"
export PROJECT_ID

write_failure_result() {
  local stage="$1"
  local exit_code="$2"
  local error="$3"
  shift 3 || true
  python3 - "$stage" "$exit_code" "$error" "$@" <<'PY'
import json
import pathlib
import re
import sys

stage = sys.argv[1]
exit_code = int(sys.argv[2])
error = sys.argv[3]
paths = sys.argv[4:]

parts = [error]
for raw_path in paths:
    path = pathlib.Path(raw_path)
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    if path.name == "eval-verdict.json":
        try:
            data = json.loads(text)
            failures = data.get("failures") or []
            if failures:
                parts.append("\n".join(str(item) for item in failures[:5]))
        except Exception:
            parts.append(text)
    else:
        parts.append(text)

detail = "\n".join(part for part in parts if part)
lines = [line.strip() for line in detail.splitlines() if line.strip()]
interesting = next(
    (line for line in lines if re.search(r"PERMISSION_DENIED|Permission ['\"][^'\"]+['\"] denied|403 .*denied", line, re.I)),
    next((line for line in lines if re.search(r"error|failed|permission|invalid|denied|threshold|mean_score|traceback|exception", line, re.I)), lines[-1] if lines else error),
)
if len(interesting) > 500:
    interesting = interesting[-500:]

classification = "stage_command"
fix_hint = "Open the stage result and Cloud Build log; the command failed before the factory could classify it more specifically."
if re.search(r"invalid autorater model resource name|judge_autorater_config\.autorater_model|autorater_model", detail, re.I):
    classification = "eval_config"
    fix_hint = "Use a fully qualified Vertex autorater model resource for the eval judge model: projects/{project}/locations/{location}/publishers/google/models/{model}."
elif re.search(r"aiplatform\.endpoints\.predict|permission.*predict|aiplatform.*PERMISSION_DENIED|PERMISSION_DENIED.*(aiplatform|predict)", detail, re.I):
    classification = "iam_vertex_predict"
    fix_hint = "Grant the builder service account Vertex AI prediction access, then rerun the stage."
elif re.search(r"discoveryengine|gemini enterprise", detail, re.I) and re.search(r"permission|denied|403", detail, re.I):
    classification = "iam_discovery_engine"
    fix_hint = "Grant the builder/runtime identity Discovery Engine access for the Gemini Enterprise app."
elif re.search(r"resourcemanager\.projects\.(get|set)IamPolicy|project IAM policy", detail, re.I) and re.search(r"permission|denied|403", detail, re.I):
    classification = "iam_project_policy"
    fix_hint = "Grant the builder service account the factory's Agent Identity IAM Binder role, then retry the operation-aware deploy stage."
elif re.search(r"agents-cli eval generate/grade|eval generate|eval grade|Inference timed out after .*Vertex AI|eval case\(s\) errored|mean_score .*below threshold|thresholded metrics missing|no mean_score", detail, re.I):
    classification = "workload_eval"
    fix_hint = "The generated agent reached the behavior-contract eval gate; inspect artifacts/eval-verdict.json and eval stdout logs, then refine the spec/tools or eval runtime location."
elif re.search(r"ge-factory-run-stage not found|_BUILDER_IMAGE=.*not found|set GE_AGENT_FACTORY_BUILDER_IMAGE|builder image .*missing|builder image .*not found", detail, re.I):
    classification = "builder_image"
    fix_hint = "Rebuild and bind the shared builder image with ge images build builder and ge images deploy."
elif re.search(r"429|500|502|503|504|timeout|deadline exceeded|temporarily unavailable|service unavailable|quota", detail, re.I):
    classification = "transient"
    fix_hint = "Retry the stage after the upstream service or quota condition clears."

result = {
    "status": "failed",
    "stage": stage,
    "owner": "cloud_build",
    "nextStage": None,
    "error": error,
    "exitCode": exit_code,
    "classification": classification,
    "firstError": interesting,
    "fixHint": fix_hint,
}
pathlib.Path("artifacts").mkdir(exist_ok=True)
pathlib.Path(f"artifacts/factory-{stage}-result.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
PY
}

emit_progress() {
  local phase="$1"
  local message="${2:-$phase}"
  printf '::ge-progress %s %s\n' "$phase" "$message"
}

install_workspace_dependencies() {
  local stage="$1"
  emit_progress "${stage}.install" "uv sync"
  if [[ ! -f pyproject.toml ]]; then
    {
      printf 'cwd=%s\n' "$(pwd -P)"
      find . -maxdepth 2 -mindepth 1 -print | sort | head -200
    } > artifacts/workspace-root.txt
    write_failure_result "$stage" 2 "workspace pyproject.toml missing before dependency install" artifacts/workspace-root.txt
    exit 2
  fi
  set +e
  uv sync 2>&1 | tee "artifacts/${stage}-uv-sync.log"
  local code=${PIPESTATUS[0]}
  set -e
  if [[ "$code" -ne 0 ]]; then
    write_failure_result "$stage" "$code" "uv sync failed during dependency install" "artifacts/${stage}-uv-sync.log"
    exit "$code"
  fi
}

normalize_eval_config() {
  local config_path="$1"
  local samples="${2:-${GE_EVAL_JUDGE_SAMPLES:-5}}"
  [[ -f "$config_path" ]] || return 0
  uv run --no-project --with pyyaml python3 - "$config_path" "$samples" <<'PY'
import pathlib
import sys

import yaml

path = pathlib.Path(sys.argv[1])
try:
    samples = int(str(sys.argv[2]).strip())
except Exception:
    samples = 5
samples = max(1, min(32, samples))
data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
for metric in data.get("custom_metrics") or []:
    if metric.get("name") != "ge_behavior_contract_judge":
        continue
    metric["judge_model_sampling_count"] = samples
    prompt = str(metric.get("prompt_template") or "")
    hardening = (
        "\nReturn exactly one compact JSON object and no markdown.\n"
        "Schema: {\"score\": <fraction of rubrics satisfied, 0.0 to 1.0>, \"explanation\": \"<semicolon-delimited verdicts>\"}\n"
        "The explanation value must be one ASCII line. Do not include backslashes, quotes, escaped newlines, bullets, or markdown in the explanation.\n"
        "Use this explanation shape: rubric_id=0|1 short reason; rubric_id=0|1 short reason.\n"
    )
    if "Do not include backslashes" not in prompt:
        metric["prompt_template"] = prompt.rstrip() + hardening
path.write_text(yaml.safe_dump(data, sort_keys=False, width=4096), encoding="utf-8")
pathlib.Path("artifacts").mkdir(exist_ok=True)
pathlib.Path("artifacts/eval_config.effective.yaml").write_text(path.read_text(encoding="utf-8"), encoding="utf-8")
print(f"[eval-config] normalized {path} judge samples={samples}")
PY
}

run_eval_grade() {
  local config_arg="$1"
  local project_id="$2"
  local log_path="$3"
  set +e
  agents-cli eval grade --traces artifacts/traces/ --output artifacts/grade_results/ $config_arg --project "$project_id" 2>&1 | tee "$log_path"
  local code=${PIPESTATUS[0]}
  set -e
  return "$code"
}

is_retryable_grade_failure() {
  local log_path="$1"
  grep -Eiq 'Error parsing JSON|INVALID_ARGUMENT.*ge_behavior_contract_judge|ge_behavior_contract_judge|429|RESOURCE_EXHAUSTED|500|502|503|504|timeout|temporarily unavailable|service unavailable|deadline exceeded' "$log_path"
}

case "${_STAGE}" in
  validate)
    install_workspace_dependencies "validate"
    emit_progress "validate.info" "agents-cli info"
    agents-cli info --json > artifacts/agents-cli-info.json
    if [[ "${_RUN_AGENT_LINT}" == "true" ]]; then
      emit_progress "validate.lint" "agents-cli lint"
      agents-cli lint --fix --skip-codespell --skip-ty
    fi
    emit_progress "validate.smoke" "pytest smoke tests"
    uv run pytest tests/test_smoke.py -q

    EVAL_STATUS="skipped"
    EVAL_EXIT=0
    if [[ "${_RUN_AGENT_EVALS}" == "true" && -f tests/eval/datasets/ge_behavior_contract.json ]]; then
      if [[ -z "$PROJECT_ID" ]]; then
        write_failure_result "validate" 2 "PROJECT_ID is required for agents-cli eval grade"
        exit 2
      fi
      EVAL_CONFIG_ARG=""
      if [[ -f tests/eval/eval_config.yaml ]]; then
        normalize_eval_config tests/eval/eval_config.yaml "${GE_EVAL_JUDGE_SAMPLES:-5}"
        EVAL_CONFIG_ARG="--config tests/eval/eval_config.yaml"
      fi
      emit_progress "validate.eval_generate" "agents-cli eval generate"
      mkdir -p artifacts/eval_case_datasets artifacts/traces artifacts/eval_case_logs
      python3 - tests/eval/datasets/ge_behavior_contract.json artifacts/eval_case_datasets artifacts/eval-case-manifest.tsv <<'PY'
import json
import pathlib
import re
import sys

dataset_path = pathlib.Path(sys.argv[1])
out_dir = pathlib.Path(sys.argv[2])
manifest_path = pathlib.Path(sys.argv[3])
data = json.loads(dataset_path.read_text(encoding="utf-8"))
cases = data.get("eval_cases") or []
out_dir.mkdir(parents=True, exist_ok=True)
rows = []
for index, case in enumerate(cases, start=1):
    raw_id = str(case.get("eval_case_id") or case.get("eval_id") or f"case-{index}")
    safe_id = re.sub(r"[^A-Za-z0-9_.-]+", "-", raw_id).strip("-") or f"case-{index}"
    case_dataset = out_dir / f"{index:03d}-{safe_id}.json"
    trace_file = pathlib.Path("artifacts/traces") / f"{index:03d}-{safe_id}.json"
    log_file = pathlib.Path("artifacts/eval_case_logs") / f"{index:03d}-{safe_id}.log"
    case_dataset.write_text(json.dumps({"eval_cases": [case]}, indent=2) + "\n", encoding="utf-8")
    rows.append("\t".join([safe_id, str(case_dataset), str(trace_file), str(log_file), raw_id]))
manifest_path.write_text("\n".join(rows) + ("\n" if rows else ""), encoding="utf-8")
print(f"[generate] split {len(rows)} eval case(s) from {dataset_path}")
PY
      EVAL_GENERATE_CONCURRENCY="${GE_EVAL_GENERATE_CONCURRENCY:-3}"
      EVAL_CASE_TIMEOUT_SEC="${GE_EVAL_CASE_TIMEOUT_SEC:-180}"
      EVAL_CASE_MAX_ATTEMPTS="$(( ${GE_EVAL_CASE_RETRIES:-1} + 1 ))"
      rm -f artifacts/eval-generate-failures.tsv
      EVAL_ROOT_DIR="$(pwd -P)"
      export EVAL_CASE_TIMEOUT_SEC EVAL_CASE_MAX_ATTEMPTS EVAL_ROOT_DIR
      xargs -r -n 5 -P "$EVAL_GENERATE_CONCURRENCY" bash -c '
        set -uo pipefail
        safe_id="$1"
        dataset="$2"
        trace="$3"
        log="$4"
        case_id="$5"
        root_dir="${EVAL_ROOT_DIR:-$(pwd -P)}"
        case "$dataset" in /*) ;; *) dataset="$root_dir/$dataset" ;; esac
        case "$trace" in /*) ;; *) trace="$root_dir/$trace" ;; esac
        case "$log" in /*) ;; *) log="$root_dir/$log" ;; esac
        case_slug="$(basename "$dataset" .json)"
        workdir="$root_dir/artifacts/eval_case_workspaces/$case_slug"
        rm -rf "$workdir"
        mkdir -p "$workdir" "$root_dir/artifacts/eval_case_action_events"
        cp -a "$root_dir/app" "$workdir/app"
        for file in pyproject.toml uv.lock agents-cli-manifest.yaml .agent_engine_config.json deployment_metadata.json; do
          if [[ -e "$root_dir/$file" ]]; then
            ln -s "$root_dir/$file" "$workdir/$file"
          fi
        done
        for dir in fixtures mock_systems mock_data evals; do
          if [[ -e "$root_dir/$dir" ]]; then
            ln -s "$root_dir/$dir" "$workdir/$dir"
          fi
        done
        if [[ -d "$root_dir/tests/eval" ]]; then
          mkdir -p "$workdir/tests"
          ln -s "$root_dir/tests/eval" "$workdir/tests/eval"
        fi
        if [[ -d "$root_dir/.venv" ]]; then
          ln -s "$root_dir/.venv" "$workdir/.venv"
        fi
        mkdir -p "$(dirname "$trace")" "$(dirname "$log")"
        : > "$log"
        attempt=1
        last_status=1
        while [[ "$attempt" -le "${EVAL_CASE_MAX_ATTEMPTS:-2}" ]]; do
          printf "::ge-progress validate.eval_generate.case %s attempt %s/%s\n" "$case_id" "$attempt" "${EVAL_CASE_MAX_ATTEMPTS:-2}"
          printf "[generate] case %s attempt %s/%s\n" "$case_id" "$attempt" "${EVAL_CASE_MAX_ATTEMPTS:-2}" | tee -a "$log"
          set +e
          (
            cd "$workdir" &&
            ACTION_EVENTS_PATH="$root_dir/artifacts/eval_case_action_events/$case_slug.jsonl" \
              timeout --preserve-status "${EVAL_CASE_TIMEOUT_SEC:-180}s" agents-cli eval generate --dataset "$dataset" --output "$trace"
          ) 2>&1 | tee -a "$log"
          last_status="${PIPESTATUS[0]}"
          set -e
          if [[ "$last_status" -eq 0 ]]; then
            printf "[generate] case %s done\n" "$case_id" | tee -a "$log"
            exit 0
          fi
          printf "[generate] case %s failed with exit %s\n" "$case_id" "$last_status" | tee -a "$log"
          attempt=$((attempt + 1))
        done
        printf "%s\t%s\n" "$case_id" "$last_status" >> artifacts/eval-generate-failures.tsv
        exit 0
      ' _ < artifacts/eval-case-manifest.tsv
      cat artifacts/eval_case_logs/*.log > artifacts/eval-generate-stdout.log 2>/dev/null || true
      if [[ ! -s artifacts/eval-generate-failures.tsv ]]; then
        GRADE_EXIT=1
        GRADE_ATTEMPT=1
        GRADE_MAX_ATTEMPTS="$(( ${GE_EVAL_GRADE_RETRIES:-1} + 1 ))"
        while [[ "$GRADE_ATTEMPT" -le "$GRADE_MAX_ATTEMPTS" ]]; do
          emit_progress "validate.eval_grade" "agents-cli eval grade attempt ${GRADE_ATTEMPT}/${GRADE_MAX_ATTEMPTS}"
          if [[ "$GRADE_ATTEMPT" -gt 1 && -f tests/eval/eval_config.yaml && -f artifacts/eval-grade-stdout.log ]] \
            && grep -Eiq 'Error parsing JSON|INVALID_ARGUMENT.*ge_behavior_contract_judge|ge_behavior_contract_judge' artifacts/eval-grade-stdout.log; then
            normalize_eval_config tests/eval/eval_config.yaml 1
          fi
          set +e
          run_eval_grade "$EVAL_CONFIG_ARG" "$PROJECT_ID" "artifacts/eval-grade-stdout.log"
          GRADE_EXIT=$?
          set -e
          if [[ "$GRADE_EXIT" -eq 0 ]]; then
            break
          fi
          if [[ "$GRADE_ATTEMPT" -ge "$GRADE_MAX_ATTEMPTS" ]] || ! is_retryable_grade_failure artifacts/eval-grade-stdout.log; then
            break
          fi
          echo "[grade] retryable agents-cli eval grade failure (exit ${GRADE_EXIT}); retrying with existing traces..." | tee -a artifacts/eval-grade-stdout.log
          sleep "$(( GRADE_ATTEMPT * 5 ))"
          GRADE_ATTEMPT=$((GRADE_ATTEMPT + 1))
        done
        if [[ "$GRADE_EXIT" -eq 0 ]]; then
          EVAL_STATUS="graded"
        else
          EVAL_EXIT="$GRADE_EXIT"
          EVAL_STATUS="failed"
        fi
      else
        EVAL_EXIT=1
        EVAL_STATUS="failed"
      fi
      if [[ "$EVAL_STATUS" == "graded" ]]; then
        GATE_EXIT=0
        emit_progress "validate.threshold_gate" "checking eval thresholds"
        uv run --no-project --with pyyaml python3 - <<'EVAL_GATE' || GATE_EXIT=$?
import glob, json, re, sys
import yaml

results = sorted(glob.glob("artifacts/grade_results/results_*.json"))
verdict = {"resultsFile": results[-1] if results else None, "failures": [], "checked": [], "diagnostics": []}
data = {}
if not results:
    verdict["failures"].append("no grade-results JSON found under artifacts/grade_results/")
else:
    with open(results[-1], encoding="utf-8") as f:
        data = json.load(f)
try:
    with open("tests/eval/eval_config.yaml", encoding="utf-8") as f:
        config = yaml.safe_load(f) or {}
        thresholds = config.get("ge_thresholds") or {}
        diagnostics = config.get("ge_diagnostic_metrics") or {}
except FileNotFoundError:
    thresholds = {}
    diagnostics = {}

def base(name):
    return re.sub(r"_v\d+$", "", name or "")

wanted = {base(name): threshold for name, threshold in thresholds.items()}
diagnostic = {base(name): spec for name, spec in diagnostics.items()}
for metric in data.get("summary_metrics") or []:
    name = base(metric.get("metric_name"))
    errors = metric.get("num_cases_error") or 0
    mean = metric.get("mean_score")
    if name in diagnostic and name not in wanted:
        spec = diagnostic.get(name) or {}
        verdict["diagnostics"].append({
            "metric": name,
            "meanScore": mean,
            "threshold": spec.get("threshold") if isinstance(spec, dict) else None,
            "errors": errors,
            "reason": spec.get("reason") if isinstance(spec, dict) else None,
        })
        continue
    if name not in wanted:
        continue
    if errors:
        verdict["failures"].append("%s: %d eval case(s) errored" % (name, errors))
    verdict["checked"].append({"metric": name, "meanScore": mean, "threshold": wanted[name]})
    if mean is None:
        verdict["failures"].append("%s: no mean_score in grade results" % name)
    elif mean < wanted[name]:
        verdict["failures"].append("%s: mean_score %.4f below threshold %s" % (name, mean, wanted[name]))
missing = sorted(set(wanted) - {checked["metric"] for checked in verdict["checked"]})
if missing:
    verdict["failures"].append("thresholded metrics missing from grade results: %s" % ", ".join(missing))
verdict["status"] = "failed" if verdict["failures"] else "passed"
with open("artifacts/eval-verdict.json", "w", encoding="utf-8") as f:
    json.dump(verdict, f, indent=2)
print(json.dumps(verdict, indent=2))
sys.exit(1 if verdict["failures"] else 0)
EVAL_GATE
        if [[ "$GATE_EXIT" -eq 0 ]]; then
          EVAL_STATUS="passed"
        else
          EVAL_STATUS="failed"
          EVAL_EXIT="$GATE_EXIT"
        fi
      fi
    fi
    if [[ "$EVAL_STATUS" == "failed" ]]; then
      write_failure_result "validate" "$EVAL_EXIT" "agents-cli eval generate/grade gate failed with exit ${EVAL_EXIT} (see artifacts/eval-verdict.json)" \
        artifacts/eval-verdict.json artifacts/eval-generate-failures.tsv artifacts/eval-generate-stdout.log artifacts/eval-grade-stdout.log
      exit "$EVAL_EXIT"
    fi

    OPTIMIZE_STATUS="skipped"
    if [[ "${_RUN_AGENT_OPTIMIZE}" == "true" ]]; then
      if [[ -f tests/eval/optimization_config.json ]]; then
        emit_progress "validate.optimize" "agents-cli eval optimize"
        agents-cli eval optimize --config tests/eval/optimization_config.json
        OPTIMIZE_STATUS="passed"
      else
        echo "Optimization requested but tests/eval/optimization_config.json is missing." >&2
        exit 2
      fi
    fi
    emit_progress "validate.done" "validate passed"
    printf '{"status":"done","stage":"validate","owner":"cloud_build","nextStage":null,"lintStatus":"%s","evalStatus":"%s","optimizeStatus":"%s"}\n' "${_RUN_AGENT_LINT}" "$EVAL_STATUS" "$OPTIMIZE_STATUS" > artifacts/factory-validate-result.json
    ;;

  preview)
    install_workspace_dependencies "preview"
    emit_progress "preview.info" "agents-cli info"
    agents-cli info --json > artifacts/agents-cli-info.json
    PREVIEW_EXIT=0
    emit_progress "preview.run" "agents-cli run preview"
    timeout --preserve-status 60s agents-cli run "${_PREVIEW_PROMPT}" --start-server > artifacts/preview-stdout.log 2>&1 || PREVIEW_EXIT=$?
    if [[ "$PREVIEW_EXIT" -eq 0 || "$PREVIEW_EXIT" -eq 143 ]] && [[ -s artifacts/preview-stdout.log ]]; then
      emit_progress "preview.done" "preview passed"
      python3 -c 'import json,sys; print(json.dumps({"status":"done","stage":"preview","owner":"cloud_build","nextStage":None,"exitCode":int(sys.argv[1]),"prompt":sys.argv[2]}))' "$PREVIEW_EXIT" "${_PREVIEW_PROMPT}" > artifacts/factory-preview-result.json
    else
      write_failure_result "preview" "$PREVIEW_EXIT" "agents-cli run failed with exit ${PREVIEW_EXIT}" artifacts/preview-stdout.log
      exit "$PREVIEW_EXIT"
    fi
    ;;

  deploy_runtime)
    emit_progress "deploy_runtime.scaffold" "agents-cli scaffold enhance"
    agents-cli scaffold enhance . --name "${_AGENT_NAME}" --deployment-target agent_runtime --agent-directory app --yes
    if grep -q '^deployment_target[[:space:]]*=' pyproject.toml; then
      sed -i '0,/^deployment_target[[:space:]]*=.*/s//deployment_target = "agent_runtime"/' pyproject.toml
    else
      printf '\n[tool.agents-cli.create_params]\ndeployment_target = "agent_runtime"\n' >> pyproject.toml
    fi
    install_workspace_dependencies "deploy_runtime"
    emit_progress "deploy_runtime.info" "agents-cli info"
    agents-cli info --json > artifacts/agents-cli-info.json
    emit_progress "deploy_runtime.deploy" "agents-cli deploy"
    set +e
    agents-cli deploy --project "$PROJECT_ID" --region "${_RUNTIME_REGION}" --no-confirm-project --agent-identity --no-wait 2>&1 | tee artifacts/deploy-runtime-stdout.log
    DEPLOY_EXIT=${PIPESTATUS[0]}
    set -e
    if [[ "$DEPLOY_EXIT" -ne 0 ]]; then
      write_failure_result "deploy_runtime" "$DEPLOY_EXIT" "agents-cli deploy failed" artifacts/deploy-runtime-stdout.log
      exit "$DEPLOY_EXIT"
    fi
    emit_progress "deploy_runtime.done" "deploy submitted"
    printf '{"status":"done","stage":"deploy_runtime","owner":"cloud_build"}\n' > artifacts/factory-deploy_runtime-result.json
    ;;

  poll_runtime)
    RUNTIME_READY=0
    for ATTEMPT in $(seq 1 24); do
      emit_progress "poll_runtime.status" "agents-cli deploy status attempt ${ATTEMPT}/24"
      agents-cli deploy --project "$PROJECT_ID" --region "${_RUNTIME_REGION}" --no-confirm-project --status || true
      if python3 -c 'import json, os, sys; sys.exit(1) if not os.path.exists("deployment_metadata.json") else None; m=json.load(open("deployment_metadata.json")); rid=(m.get("remote_agent_runtime_id") or m.get("agent_runtime_id") or "").strip(); sys.exit(0 if rid else 1)' 2>/dev/null; then
        RUNTIME_READY=1
        echo "Agent Runtime ready after attempt $ATTEMPT."
        break
      fi
      echo "Agent Runtime not ready yet (attempt $ATTEMPT/24); sleeping 30s..."
      sleep 30
    done
    if [[ "$RUNTIME_READY" -ne 1 ]]; then
      echo "Timed out waiting for Agent Runtime readiness (remote_agent_runtime_id never appeared)." >&2
      write_failure_result "poll_runtime" 1 "timed out waiting for Agent Runtime readiness (no remote_agent_runtime_id after ~12 min)"
      exit 1
    fi
    if [[ "${_RUN_DEPLOYED_SMOKE}" == "true" && -f deployment_metadata.json ]]; then
      REMOTE_URL="$(python3 -c "import json; from pathlib import Path; m=json.loads(Path('deployment_metadata.json').read_text()); r=(m.get('remote_agent_runtime_id') or m.get('agent_runtime_id') or '').split('/'); print(('https://%s-aiplatform.googleapis.com/v1/projects/%s/locations/%s/reasoningEngines/%s' % (r[r.index('locations')+1], r[r.index('projects')+1], r[r.index('locations')+1], r[r.index('reasoningEngines')+1])) if 'reasoningEngines' in r else '')")"
      if [[ -n "$REMOTE_URL" ]]; then
        emit_progress "poll_runtime.smoke" "agents-cli run deployed smoke"
        set +e
        bun /opt/ge/run-deployed-smoke.mjs \
          --url "$REMOTE_URL" \
          --prompt "${_PREVIEW_PROMPT}" \
          --output artifacts/deployed-smoke-stdout.log \
          --metadata artifacts/deployed-smoke.json \
          --retries "${GE_DEPLOYED_SMOKE_RETRIES:-2}" \
          --timeout-seconds "${GE_DEPLOYED_SMOKE_TIMEOUT_SEC:-150}"
        SMOKE_EXIT=$?
        set -e
        if [[ "$SMOKE_EXIT" -ne 0 ]]; then
          write_failure_result "poll_runtime" "$SMOKE_EXIT" "agents-cli deployed smoke failed" \
            artifacts/deployed-smoke.json artifacts/deployed-smoke-stdout.log
          exit "$SMOKE_EXIT"
        fi
        emit_progress "poll_runtime.done" "runtime ready"
        python3 - "$REMOTE_URL" <<'PY' > artifacts/factory-poll_runtime-result.json
import json
import pathlib
import sys

smoke = json.loads(pathlib.Path("artifacts/deployed-smoke.json").read_text(encoding="utf-8"))
print(json.dumps({
    "status": "done",
    "stage": "poll_runtime",
    "owner": "cloud_build",
    "url": sys.argv[1],
    "smokeAttempts": smoke["attemptCount"],
    "smokeTimeoutSeconds": smoke["timeoutSeconds"],
}))
PY
      else
        emit_progress "poll_runtime.done" "runtime ready; smoke skipped"
        printf '{"status":"skipped","stage":"poll_runtime","owner":"cloud_build","reason":"no agent runtime url"}\n' > artifacts/factory-poll_runtime-result.json
      fi
    else
      emit_progress "poll_runtime.done" "runtime ready; smoke skipped"
      printf '{"status":"done","stage":"poll_runtime","owner":"cloud_build","reason":"runtime ready; smoke skipped"}\n' > artifacts/factory-poll_runtime-result.json
    fi
    ;;

  publish_enterprise)
    emit_progress "publish_enterprise.publish" "agents-cli publish gemini-enterprise"
    PUBLISH_ARGS=(
      "publish" "gemini-enterprise"
      "--metadata-file" "deployment_metadata.json"
      "--project-id" "$PROJECT_ID"
      "--gemini-enterprise-app-id" "${_GEMINI_ENTERPRISE_APP_ID}"
      "--registration-type" "adk"
    )
    if [[ -n "${_DISPLAY_NAME}" ]]; then PUBLISH_ARGS+=("--display-name" "${_DISPLAY_NAME}"); fi
    if [[ -n "${_DESCRIPTION}" ]]; then PUBLISH_ARGS+=("--description" "${_DESCRIPTION}"); fi
    if [[ -n "${_TOOL_DESCRIPTION}" ]]; then PUBLISH_ARGS+=("--tool-description" "${_TOOL_DESCRIPTION}"); fi
    agents-cli "${PUBLISH_ARGS[@]}"
    emit_progress "publish_enterprise.done" "publish complete"
    printf '{"status":"done","stage":"publish_enterprise","owner":"cloud_build"}\n' > artifacts/factory-publish_enterprise-result.json
    ;;

  *)
    echo "Unsupported Cloud Build factory stage: ${_STAGE}" >&2
    exit 2
    ;;
esac
