from __future__ import annotations

import logging
import os
from copy import deepcopy
from typing import Any, Protocol, runtime_checkable

logger = logging.getLogger(__name__)


# A simulator's per-(agent:system:scenario) state is a single document: a dict whose
# values are collection lists (e.g. {"workers": [...], "audit_events": [...]}). The
# StateStore is keyed by a namespace string (the state key, e.g.
# "agent:system:scenario:generic") and stores one such document per namespace.
StateDoc = dict[str, Any]


@runtime_checkable
class StateStore(Protocol):
    """Durable home for simulator state, keyed by an opaque namespace string.

    Implementations persist one ``StateDoc`` per namespace. ``get`` returns ``None``
    on a miss so callers can hydrate from seed; ``set`` replaces the whole document.
    The collection helpers (``get_collection``/``set_collection``) are thin
    conveniences over the document model that mirror how ``generic.py`` reads and
    writes entity lists today.
    """

    def get(self, namespace: str) -> StateDoc | None:
        ...

    def set(self, namespace: str, doc: StateDoc) -> None:
        ...

    def delete(self, namespace: str) -> None:
        ...

    def list(self) -> list[str]:
        ...

    def scan(self, prefix: str = "") -> dict[str, StateDoc]:
        ...

    def get_collection(self, namespace: str, collection: str) -> list[dict[str, Any]]:
        ...

    def set_collection(self, namespace: str, collection: str, rows: list[dict[str, Any]]) -> None:
        ...


class _BaseStateStore:
    """Shared collection helpers implemented on top of get/set."""

    def get(self, namespace: str) -> StateDoc | None:  # pragma: no cover - overridden
        raise NotImplementedError

    def set(self, namespace: str, doc: StateDoc) -> None:  # pragma: no cover - overridden
        raise NotImplementedError

    def get_collection(self, namespace: str, collection: str) -> list[dict[str, Any]]:
        doc = self.get(namespace) or {}
        return list(doc.get(collection, []))

    def set_collection(self, namespace: str, collection: str, rows: list[dict[str, Any]]) -> None:
        doc = self.get(namespace)
        if doc is None:
            doc = {}
        doc[collection] = rows
        self.set(namespace, doc)


class MemoryStateStore(_BaseStateStore):
    """In-memory store — the behaviour ``generic.py`` had before the abstraction.

    Documents are stored by reference (not copied) so callers that mutate the
    returned ``StateDoc`` in place keep mutating the stored copy, exactly as the
    legacy module-global ``STATE`` dict did. An optional ``backing`` dict lets the
    engine point this store at its existing ``STATE`` global for backward compat.
    """

    def __init__(self, backing: dict[str, StateDoc] | None = None) -> None:
        self._data: dict[str, StateDoc] = backing if backing is not None else {}

    def get(self, namespace: str) -> StateDoc | None:
        return self._data.get(namespace)

    def set(self, namespace: str, doc: StateDoc) -> None:
        self._data[namespace] = doc

    def delete(self, namespace: str) -> None:
        self._data.pop(namespace, None)

    def list(self) -> list[str]:
        return list(self._data.keys())

    def scan(self, prefix: str = "") -> dict[str, StateDoc]:
        return {key: value for key, value in self._data.items() if key.startswith(prefix)}


class FirestoreStateStore(_BaseStateStore):
    """Firestore-backed store (ADR 0001: Firestore = live run state).

    Each namespace maps to a document in ``collection``. The google-cloud-firestore
    client is imported lazily so importing this module never requires the dependency;
    a clear error is raised if it is unavailable when the store is actually used.
    """

    def __init__(self, collection: str = "simulator_state", client: Any | None = None) -> None:
        self._collection_name = collection
        if client is not None:
            self._client = client
        else:
            try:
                from google.cloud import firestore  # type: ignore
            except ImportError as exc:  # pragma: no cover - exercised via factory fallback
                raise RuntimeError(
                    "FirestoreStateStore requires google-cloud-firestore; install it or use the memory backend"
                ) from exc
            self._client = firestore.Client()

    def _doc(self, namespace: str) -> Any:
        return self._client.collection(self._collection_name).document(namespace)

    def get(self, namespace: str) -> StateDoc | None:
        snapshot = self._doc(namespace).get()
        if not getattr(snapshot, "exists", False):
            return None
        return snapshot.to_dict()

    def set(self, namespace: str, doc: StateDoc) -> None:
        self._doc(namespace).set(doc)

    def delete(self, namespace: str) -> None:
        self._doc(namespace).delete()

    def list(self) -> list[str]:
        return [item.id for item in self._client.collection(self._collection_name).stream()]

    def scan(self, prefix: str = "") -> dict[str, StateDoc]:
        out: dict[str, StateDoc] = {}
        for item in self._client.collection(self._collection_name).stream():
            if item.id.startswith(prefix):
                out[item.id] = item.to_dict()
        return out


class AlloyDBStateStore(_BaseStateStore):
    """AlloyDB-backed store (ADR 0001: AlloyDB = relational source of truth).

    State documents are stored as JSONB in a small key/value table. The psycopg
    driver and connection are imported/created lazily; a clear error is raised when
    the dependency or DSN is missing so the factory can fall back to memory.
    """

    def __init__(self, dsn: str | None = None, table: str = "simulator_state", conn: Any | None = None) -> None:
        self._table = table
        if conn is not None:
            self._conn = conn
        else:
            dsn = dsn or os.environ.get("GE_AGENT_ALLOYDB_DSN")
            if not dsn:
                raise RuntimeError(
                    "AlloyDBStateStore requires a DSN (arg or GE_AGENT_ALLOYDB_DSN env); use the memory backend"
                )
            try:
                import psycopg  # type: ignore
            except ImportError as exc:  # pragma: no cover - exercised via factory fallback
                raise RuntimeError(
                    "AlloyDBStateStore requires psycopg; install it or use the memory backend"
                ) from exc
            self._conn = psycopg.connect(dsn)
        self._ensure_table()

    def _ensure_table(self) -> None:
        with self._conn.cursor() as cur:
            cur.execute(
                f"CREATE TABLE IF NOT EXISTS {self._table} "
                "(namespace TEXT PRIMARY KEY, doc JSONB NOT NULL)"
            )
        self._conn.commit()

    def get(self, namespace: str) -> StateDoc | None:
        with self._conn.cursor() as cur:
            cur.execute(f"SELECT doc FROM {self._table} WHERE namespace = %s", (namespace,))
            row = cur.fetchone()
        if not row:
            return None
        return row[0]

    def set(self, namespace: str, doc: StateDoc) -> None:
        import json

        with self._conn.cursor() as cur:
            cur.execute(
                f"INSERT INTO {self._table} (namespace, doc) VALUES (%s, %s) "
                "ON CONFLICT (namespace) DO UPDATE SET doc = EXCLUDED.doc",
                (namespace, json.dumps(doc)),
            )
        self._conn.commit()

    def delete(self, namespace: str) -> None:
        with self._conn.cursor() as cur:
            cur.execute(f"DELETE FROM {self._table} WHERE namespace = %s", (namespace,))
        self._conn.commit()

    def list(self) -> list[str]:
        with self._conn.cursor() as cur:
            cur.execute(f"SELECT namespace FROM {self._table}")
            return [row[0] for row in cur.fetchall()]

    def scan(self, prefix: str = "") -> dict[str, StateDoc]:
        with self._conn.cursor() as cur:
            cur.execute(
                f"SELECT namespace, doc FROM {self._table} WHERE namespace LIKE %s",
                (f"{prefix}%",),
            )
            return {row[0]: row[1] for row in cur.fetchall()}


# A process-wide default memory store. ``generic.py`` points its STATE global at this
# store's backing dict so the in-memory default behaves exactly as before.
_DEFAULT_MEMORY_STORE = MemoryStateStore()
_STORE_CACHE: dict[str, StateStore] = {"memory": _DEFAULT_MEMORY_STORE}


def default_memory_store() -> MemoryStateStore:
    return _DEFAULT_MEMORY_STORE


# Global backend override. When a system leaves ``stateBackend`` at its default
# (absent/empty/"memory"), this env var (if set) selects the backend instead. A
# per-system ``stateBackend`` always wins over the override. Unset ⇒ memory ⇒
# local/test behaviour is unchanged.
GLOBAL_BACKEND_ENV = "GE_SIMULATOR_STATE_BACKEND"


def _global_override() -> str:
    return (os.environ.get(GLOBAL_BACKEND_ENV) or "").strip().lower()


def get_state_store(backend: str | None = None) -> StateStore:
    """Return a StateStore for ``backend`` (default ``memory``).

    ``backend`` is the per-system ``stateBackend`` contract field. When it is
    absent/empty/``memory`` and the ``GE_SIMULATOR_STATE_BACKEND`` env var is set,
    that global override is used instead; a per-system value always wins over the
    override. An absent or unknown value resolves to the shared in-memory store. If a
    cloud backend is requested but its dependency/config is unavailable, a warning is
    logged and the memory store is returned so demo runs never hard-fail on infra
    (per the spec).
    """
    name = (backend or "memory").strip().lower()
    if name in ("", "memory"):
        override = _global_override()
        if override and override != "memory":
            name = override
        else:
            return _DEFAULT_MEMORY_STORE
    cached = _STORE_CACHE.get(name)
    if cached is not None:
        return cached
    try:
        if name == "firestore":
            store: StateStore = FirestoreStateStore()
        elif name == "alloydb":
            store = AlloyDBStateStore()
        else:
            logger.warning("unknown stateBackend %r; falling back to memory", backend)
            return _DEFAULT_MEMORY_STORE
    except Exception as exc:  # noqa: BLE001 - any init failure must degrade to memory
        logger.warning("stateBackend %r unavailable (%s); falling back to memory", name, exc)
        return _DEFAULT_MEMORY_STORE
    _STORE_CACHE[name] = store
    return store
