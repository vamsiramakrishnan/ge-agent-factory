"""Integration test for the Firestore-backed state store.

Runs a real get/set/scan round-trip against a Firestore instance only when the
``FIRESTORE_EMULATOR_HOST`` env var is set (i.e. an emulator is reachable). When
it is absent — the default for local dev and CI — the whole module is skipped, so
this file never fails a normal test run and stays fast. To exercise it locally:

    gcloud emulators firestore start --host-port=localhost:8088
    FIRESTORE_EMULATOR_HOST=localhost:8088 GOOGLE_CLOUD_PROJECT=demo-test \\
        python3 -m pytest simulator_runtime/test_state_store_integration.py -q
"""

from __future__ import annotations

import os
import sys
import uuid
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# Skip the entire module unless the Firestore emulator is configured. This keeps a
# normal test run (no emulator) green and fast.
if not os.environ.get("FIRESTORE_EMULATOR_HOST"):
    pytest.skip(
        "FIRESTORE_EMULATOR_HOST not set; skipping Firestore integration test",
        allow_module_level=True,
    )

firestore = pytest.importorskip(
    "google.cloud.firestore",
    reason="google-cloud-firestore not installed; skipping Firestore integration test",
)

from simulator_runtime.state_store import FirestoreStateStore  # noqa: E402


@pytest.fixture()
def store():
    # Emulator clients need a project; honour GOOGLE_CLOUD_PROJECT, else a dummy.
    os.environ.setdefault("GOOGLE_CLOUD_PROJECT", "demo-integration-test")
    # Isolate each run in its own collection so concurrent/repeat runs never collide
    # and we can tear down cleanly.
    collection = f"simulator_state_it_{uuid.uuid4().hex[:8]}"
    s = FirestoreStateStore(collection=collection)
    yield s
    for namespace in s.list():
        s.delete(namespace)


def test_firestore_emulator_round_trip(store):
    ns1 = "agent:system:scenario-a:generic"
    ns2 = "agent:system:scenario-b:generic"

    # Miss returns None (hydrate-from-seed path in generic.py relies on this).
    assert store.get(ns1) is None

    doc = {"workers": [{"worker_id": "W-1", "status": "active"}], "audit_events": []}
    store.set(ns1, doc)
    assert store.get(ns1) == doc

    store.set(ns2, {"v": 2, "audit_events": []})
    assert set(store.list()) == {ns1, ns2}

    # Prefix scan mirrors how the engine slices state by namespace.
    scanned = store.scan("agent:system:scenario-a")
    assert set(scanned) == {ns1}
    assert scanned[ns1] == doc

    # Collection helpers (used by idempotency replay storage) round-trip too.
    store.set_collection(ns1, "incidents", [{"number": "INC0001"}])
    assert store.get_collection(ns1, "incidents") == [{"number": "INC0001"}]

    store.delete(ns1)
    assert store.get(ns1) is None
    assert set(store.list()) == {ns2}
