"""Synthesize a live simulator from a description / samples / OpenAPI — no redeploy.

This is the headline of the BYO-system capability: a user describes a system they
have (or uploads sample payloads / an OpenAPI spec) and the factory *compiles* it into
a stateful, tool-exposing simulator and mounts it into the runtime overlay so the same
generic engine serves it immediately.

Pipeline: ``spec -> sketch -> contract (+ data recipe) -> seed -> overlay``

- **sketch** — a compact, intermediate description: collections, primary keys, fields,
  and (optionally) a per-collection state machine. Produced three ways:
  ``sketch_from_nl`` (LLM tier via Vertex ``global`` with a strict response schema, with
  a deterministic heuristic fallback so it always works offline), ``sketch_from_samples``
  (infer from example JSON rows), ``sketch_from_openapi`` (infer from a spec).
- **contract** — the full enriched contract the engine consumes, with EXPLICIT tool
  bindings (no naming-convention guessing), workflows (transitions + approval gates),
  and derived projection/materialization.
- **seed** — referentially-consistent rows (FK closure) plus scenario-coverage rows so
  the agent's demo actually exercises approval gates / invalid transitions. The live
  tier is python-native (mcp-service is python-only at runtime); the richer offline /
  corpus tier is ``scripts/generate-simulator-data.mjs``.

This module is the stable facade over the per-stage modules — every historical
``synthesis.*`` name still resolves here, so ``synthesize_cli.py``, ``server.py``
and the console's subprocess caller are unchanged. The implementation lives in:

- ``synthesis_naming``      — id / name / noun helpers
- ``synthesis_contract``    — sketch -> contract (deterministic core)
- ``synthesis_seed``        — seed generation (FK closure + scenario coverage)
- ``synthesis_validation``  — in-process validator + completeness gaps
- ``synthesis_sketch``      — the four sketch strategies (samples / OpenAPI /
  NL-heuristic / NL-LLM; monkeypatch the LLM hooks THERE, not here)
- ``synthesis_orchestrate`` — synthesize_system + promote_to_corpus

The decomposition is pinned by the byte-exact parity oracle in
``test_synthesis_golden.py``.
"""

from __future__ import annotations

from synthesis_contract import (  # noqa: F401 - re-exported for compatibility
    _TERMINAL_HINTS,
    _default_fields,
    _state_machine,
    _terminal_states,
    build_contract_from_sketch,
)
from synthesis_naming import (  # noqa: F401 - re-exported for compatibility
    _APPROVAL_HINTS,
    _APPROVAL_NOUNS,
    _STOPWORDS,
    _extract_nouns,
    _pluralize,
    _resolve_ref_collection,
    _singular,
    slugify,
)
from synthesis_orchestrate import (  # noqa: F401 - re-exported for compatibility
    _SIM_DIR_REL,
    promote_to_corpus,
    synthesize_system,
)
from synthesis_seed import (  # noqa: F401 - re-exported for compatibility
    _field_value,
    _inject_scenario_coverage,
    _rng,
    generate_seed,
)
from synthesis_sketch import (  # noqa: F401 - re-exported for compatibility
    _SKETCH_RESPONSE_SCHEMA,
    _SKETCH_SYSTEM_RULES,
    _genai_json,
    _heuristic_sketch,
    _llm_repair,
    _llm_sketch,
    sketch_from_nl,
    sketch_from_openapi,
    sketch_from_samples,
)
from synthesis_validation import (  # noqa: F401 - re-exported for compatibility
    completeness_gaps,
    validate_contract,
)

__all__ = [
    "build_contract_from_sketch",
    "completeness_gaps",
    "generate_seed",
    "promote_to_corpus",
    "sketch_from_nl",
    "sketch_from_openapi",
    "sketch_from_samples",
    "slugify",
    "synthesize_system",
    "validate_contract",
]
