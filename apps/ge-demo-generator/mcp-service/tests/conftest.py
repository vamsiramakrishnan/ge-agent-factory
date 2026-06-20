"""Test isolation for simulator state.

Several systems in the corpus declare ``stateBackend: firestore`` (servicenow, jira,
coupa, sap_s4hana_fi). When this test host has live ADC + GOOGLE_CLOUD_PROJECT, the
engine talks to *real* Firestore, so simulator state written by one test run leaks into
the next (e.g. the conformance test advances ``INC0010002`` to ``in_progress`` and the
next run then sees ``in_progress -> in_progress`` and fails). The in-memory backend has
no such problem.

This fixture makes the durable-backed tests hermetic: before (and after) the session it
deletes the per-agent state docs the conformance + smoke tests use, for every
firestore-backed system. It is a no-op when no durable backend is reachable (the reset
degrades to the memory store, whose docs are per-process anyway), so default behaviour is
unchanged.
"""

from __future__ import annotations

import pytest

# Agents whose simulator state these tests create/mutate.
_TEST_AGENTS = ("conformance-agent", "agent")  # f"{id}-conformance-agent" and f"{id}-agent"


def _reset_durable_state() -> None:
    try:
        from simulator_runtime.generic import _state_backend_for  # type: ignore
        from simulator_runtime.registry import builtin_ids
        from simulator_runtime.state_store import get_state_store
    except Exception:
        return
    for system_id in builtin_ids():
        try:
            backend = _state_backend_for(system_id)
        except Exception:
            continue
        if backend in ("", "memory"):
            continue
        store = get_state_store(backend)
        for suffix in _TEST_AGENTS:
            agent_id = f"{system_id}-{suffix}"
            key = f"{agent_id}:{system_id}:default:generic"
            try:
                store.delete(key)
            except Exception:
                pass


@pytest.fixture(scope="session", autouse=True)
def _isolate_durable_simulator_state():
    _reset_durable_state()
    yield
    _reset_durable_state()
