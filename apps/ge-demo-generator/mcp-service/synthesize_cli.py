#!/usr/bin/env python3
"""Headless CLI for system synthesis — the entry point the console/worker spawns.

Reads a spec (flags or a JSON blob on stdin) and prints the synthesized result as JSON.
With a durable overlay backend configured (GE_SIMULATOR_OVERLAY_BACKEND=firestore), the
mounted pack is visible to every running mcp-service instance; otherwise it is registered
into this process's in-memory overlay (useful for one-shot generation + inspection).

Examples:
  python synthesize_cli.py --description "PartsLedger: parts, requisitions, approval flow" --display-name PartsLedger
  echo '{"mode":"samples","displayName":"Tickets","samples":{"tickets":[{"ticket_id":"T-1","subject":"x"}]}}' | python synthesize_cli.py --stdin
"""

from __future__ import annotations

import argparse
import json
import sys

import synthesis


def main() -> int:
    parser = argparse.ArgumentParser(description="Synthesize a live simulator from a description / samples / OpenAPI.")
    parser.add_argument("--stdin", action="store_true", help="Read the full spec as JSON from stdin")
    parser.add_argument("--mode", default="nl", choices=["nl", "samples", "openapi"])
    parser.add_argument("--description", default="")
    parser.add_argument("--display-name", default=None)
    parser.add_argument("--id", default=None)
    parser.add_argument("--samples-file", default=None, help="JSON file: {collection: [rows]}")
    parser.add_argument("--openapi-file", default=None, help="OpenAPI/Swagger JSON file")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--count", type=int, default=6)
    parser.add_argument("--no-llm", dest="use_llm", action="store_false", default=True)
    parser.add_argument("--no-register", dest="register", action="store_false", default=True)
    parser.add_argument("--include-contract", action="store_true", help="Include the full contract in output")
    parser.add_argument("--promote", action="store_true", help="Also persist the result into the curated corpus (registry.json + per-section files)")
    parser.add_argument("--repo-root", default=None, help="Repo root for --promote (default: inferred from this file)")
    args = parser.parse_args()

    if args.stdin:
        spec = json.loads(sys.stdin.read() or "{}")
        spec.setdefault("use_llm", args.use_llm)
    else:
        spec = {
            "mode": args.mode,
            "description": args.description,
            "displayName": args.display_name,
            "id": args.id,
            "seed": args.seed,
            "count": args.count,
            "use_llm": args.use_llm,
        }
        if args.samples_file:
            spec["samples"] = json.loads(open(args.samples_file, encoding="utf-8").read())
        if args.openapi_file:
            spec["openapi"] = json.loads(open(args.openapi_file, encoding="utf-8").read())

    try:
        result = synthesis.synthesize_system(spec, register=args.register)
    except Exception as exc:  # noqa: BLE001 - surface a clean JSON error to the caller
        print(json.dumps({"ok": False, "error": str(exc), "errorType": exc.__class__.__name__}))
        return 1

    if args.promote and result.get("valid"):
        import os

        repo_root = args.repo_root or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        result["promoted"] = synthesis.promote_to_corpus(result["contract"], repo_root)

    if not args.include_contract:
        result = {k: v for k, v in result.items() if k != "contract"}
    result["ok"] = True
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
