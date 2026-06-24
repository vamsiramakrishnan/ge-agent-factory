from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import state_store  # noqa: E402
from simulator_runtime.state_store import (  # noqa: E402
    AlloyDBStateStore,
    FirestoreStateStore,
    MemoryStateStore,
    StateStore,
    get_state_store,
)


# --- memory round-trip -------------------------------------------------------


def test_memory_round_trip_set_get():
    store = MemoryStateStore()
    doc = {"workers": [{"worker_id": "W-1", "status": "active"}], "audit_events": []}
    store.set("agent:system:scenario:generic", doc)
    assert store.get("agent:system:scenario:generic") == doc


def test_memory_get_miss_returns_none():
    store = MemoryStateStore()
    assert store.get("nope") is None


def test_memory_mutation_persists_by_reference():
    # The legacy engine mutated the returned dict in place; memory must keep that.
    store = MemoryStateStore()
    store.set("ns", {"audit_events": []})
    fetched = store.get("ns")
    fetched["audit_events"].append({"event_id": "E-1"})
    assert store.get("ns")["audit_events"] == [{"event_id": "E-1"}]


def test_memory_delete_and_list_and_scan():
    store = MemoryStateStore()
    store.set("a:1:x:generic", {"v": 1})
    store.set("a:2:x:generic", {"v": 2})
    store.set("b:1:x:generic", {"v": 3})
    assert set(store.list()) == {"a:1:x:generic", "a:2:x:generic", "b:1:x:generic"}
    assert set(store.scan("a:")) == {"a:1:x:generic", "a:2:x:generic"}
    store.delete("a:1:x:generic")
    assert store.get("a:1:x:generic") is None
    assert "a:1:x:generic" not in store.list()


def test_memory_collection_helpers():
    store = MemoryStateStore()
    store.set("ns", {"audit_events": []})
    store.set_collection("ns", "workers", [{"worker_id": "W-1"}])
    assert store.get_collection("ns", "workers") == [{"worker_id": "W-1"}]
    # Collection on a missing namespace is empty, not an error.
    assert store.get_collection("ns", "absent") == []
    assert get_state_store_isinstance(store)


def get_state_store_isinstance(store) -> bool:
    return isinstance(store, StateStore)


def test_memory_backing_dict_is_shared():
    backing: dict = {}
    store = MemoryStateStore(backing=backing)
    store.set("ns", {"v": 1})
    assert backing["ns"] == {"v": 1}


# --- factory -----------------------------------------------------------------


def test_factory_default_is_memory_singleton():
    assert get_state_store() is state_store.default_memory_store()
    assert get_state_store("memory") is state_store.default_memory_store()
    assert get_state_store(None) is state_store.default_memory_store()
    assert get_state_store("") is state_store.default_memory_store()


def test_factory_unknown_backend_falls_back_to_memory():
    assert get_state_store("redis") is state_store.default_memory_store()


def test_factory_firestore_unavailable_falls_back_to_memory(monkeypatch):
    # Force FirestoreStateStore construction to fail; factory must degrade to memory.
    monkeypatch.delitem(state_store._STORE_CACHE, "firestore", raising=False)

    def boom(*args, **kwargs):
        raise RuntimeError("no firestore here")

    monkeypatch.setattr(state_store, "FirestoreStateStore", boom)
    assert get_state_store("firestore") is state_store.default_memory_store()


def test_factory_alloydb_unavailable_falls_back_to_memory(monkeypatch):
    monkeypatch.delitem(state_store._STORE_CACHE, "alloydb", raising=False)

    def boom(*args, **kwargs):
        raise RuntimeError("no alloydb here")

    monkeypatch.setattr(state_store, "AlloyDBStateStore", boom)
    assert get_state_store("alloydb") is state_store.default_memory_store()


def test_factory_caches_constructed_backend(monkeypatch):
    monkeypatch.delitem(state_store._STORE_CACHE, "firestore", raising=False)
    sentinel = MemoryStateStore()
    calls = {"n": 0}

    def make(*args, **kwargs):
        calls["n"] += 1
        return sentinel

    monkeypatch.setattr(state_store, "FirestoreStateStore", make)
    first = get_state_store("firestore")
    second = get_state_store("firestore")
    assert first is sentinel and second is sentinel
    assert calls["n"] == 1


# --- mocked firestore backend (no network) -----------------------------------


class _FakeSnapshot:
    def __init__(self, data):
        self._data = data
        self.exists = data is not None

    def to_dict(self):
        return self._data


class _FakeDocRef:
    def __init__(self, store, doc_id):
        self._store = store
        self.id = doc_id

    def get(self):
        return _FakeSnapshot(self._store.get(self.id))

    def set(self, doc):
        self._store[self.id] = doc

    def delete(self):
        self._store.pop(self.id, None)


class _FakeCollection:
    def __init__(self, store):
        self._store = store

    def document(self, doc_id):
        return _FakeDocRef(self._store, doc_id)

    def stream(self):
        return [_FakeDocStream(k, v) for k, v in self._store.items()]


class _FakeDocStream:
    def __init__(self, doc_id, data):
        self.id = doc_id
        self._data = data

    def to_dict(self):
        return self._data


class _FakeFirestoreClient:
    def __init__(self):
        self._collections: dict[str, dict] = {}

    def collection(self, name):
        return _FakeCollection(self._collections.setdefault(name, {}))


def test_firestore_store_round_trip_with_injected_client():
    store = FirestoreStateStore(client=_FakeFirestoreClient())
    assert store.get("ns") is None
    store.set("a:1:x:generic", {"v": 1})
    store.set("a:2:x:generic", {"v": 2})
    assert store.get("a:1:x:generic") == {"v": 1}
    assert set(store.list()) == {"a:1:x:generic", "a:2:x:generic"}
    assert set(store.scan("a:1")) == {"a:1:x:generic"}
    store.delete("a:1:x:generic")
    assert store.get("a:1:x:generic") is None


# --- mocked alloydb backend (no network) -------------------------------------


class _FakeCursor:
    def __init__(self, table):
        self._table = table
        self._result = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def execute(self, sql, params=()):
        s = sql.strip().upper()
        if s.startswith("CREATE TABLE"):
            self._result = None
        elif s.startswith("INSERT"):
            namespace, doc_json = params
            import json

            self._table[namespace] = json.loads(doc_json)
        elif s.startswith("SELECT DOC"):
            (namespace,) = params
            row = self._table.get(namespace)
            self._result = [(row,)] if row is not None else []
        elif s.startswith("SELECT NAMESPACE, DOC"):
            (prefix,) = params
            pre = prefix[:-1]
            self._result = [(k, v) for k, v in self._table.items() if k.startswith(pre)]
        elif s.startswith("SELECT NAMESPACE"):
            self._result = [(k,) for k in self._table]
        elif s.startswith("DELETE"):
            (namespace,) = params
            self._table.pop(namespace, None)

    def fetchone(self):
        return self._result[0] if self._result else None

    def fetchall(self):
        return list(self._result or [])


class _FakeConn:
    def __init__(self):
        self._table: dict[str, dict] = {}

    def cursor(self):
        return _FakeCursor(self._table)

    def commit(self):
        pass


def test_alloydb_store_round_trip_with_injected_conn():
    store = AlloyDBStateStore(conn=_FakeConn())
    assert store.get("ns") is None
    store.set("a:1:x:generic", {"workers": [{"worker_id": "W-1"}]})
    store.set("a:2:x:generic", {"v": 2})
    assert store.get("a:1:x:generic") == {"workers": [{"worker_id": "W-1"}]}
    assert set(store.list()) == {"a:1:x:generic", "a:2:x:generic"}
    assert set(store.scan("a:1")) == {"a:1:x:generic"}
    store.delete("a:1:x:generic")
    assert store.get("a:1:x:generic") is None


# --- generic.py wiring is unchanged with the default memory backend ----------


def test_generic_state_uses_memory_store_by_default():
    from types import SimpleNamespace

    from simulator_runtime import generic

    ctx = SimpleNamespace(
        agent_id="agent-ss",
        system_id="__unregistered_system__",
        scenario_id="scn-ss",
        actor="x@example.com",
        role="hr_partner",
    )
    state = generic.generic_state(ctx)
    state.setdefault("workers", []).append({"worker_id": "W-9"})
    # generic.STATE is the default memory store's backing dict — same object.
    key = generic._state_key(ctx)
    assert generic.STATE[key]["workers"] == [{"worker_id": "W-9"}]
    assert state_store.default_memory_store().get(key)["workers"] == [{"worker_id": "W-9"}]
