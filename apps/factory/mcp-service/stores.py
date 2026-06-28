"""Per-store client adapters for the MCP facade. Each function takes a plan from
store_backend.plan_op() and reads/appends against the bound per-agent 1P store.
GCP clients are imported inside the functions so store_backend stays offline-testable.
"""
from __future__ import annotations

import os
from typing import Any

_PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT")


def read_records(op: dict[str, Any]) -> list[dict[str, Any]]:
    store = op["store"]
    if store == "bigquery":
        from google.cloud import bigquery

        client = bigquery.Client(project=_PROJECT)
        where = " AND ".join(f"{k}=@{k}" for k in op["filters"]) or "TRUE"
        sql = f"SELECT * FROM `{op['namespace']}.{op['entity']}` WHERE {where} LIMIT 50"
        cfg = bigquery.QueryJobConfig(query_parameters=[
            bigquery.ScalarQueryParameter(k, "STRING", v) for k, v in op["filters"].items()
        ])
        return [dict(r) for r in client.query(sql, job_config=cfg).result()]
    if store == "firestore":
        from google.cloud import firestore

        db = firestore.Client(project=_PROJECT, database=op["namespace"].replace("_", "-"))
        col = db.collection(op["entity"])
        for k, v in op["filters"].items():
            col = col.where(k, "==", v)
        return [d.to_dict() for d in col.limit(50).stream()]
    if store == "bigtable":
        from google.cloud import bigtable

        table = bigtable.Client(project=_PROJECT, admin=False) \
            .instance("ge-agent-data").table(f"{op['namespace']}__{op['entity']}")
        rows = []
        for row in table.read_rows():
            rows.append({c: cell[0].value.decode() for c, cells in row.cells.get("d", {}).items() for cell in [cells]})
        return rows[:50]
    if store == "alloydb":
        return _alloydb_read(op)
    if store == "gcs":
        from google.cloud import storage

        client = storage.Client(project=_PROJECT)
        bucket = client.bucket(os.environ.get("GE_AGENT_DATA_BUCKET", ""))
        prefix = f"agents/{op['namespace'][len('agent_'):]}/{op['entity']}/"
        return [{"name": b.name} for b in client.list_blobs(bucket, prefix=prefix, max_results=50)]
    raise KeyError(f"unsupported store {store}")


def append_record(op: dict[str, Any]) -> dict[str, Any]:
    store = op["store"]
    if store == "bigquery":
        from google.cloud import bigquery

        client = bigquery.Client(project=_PROJECT)
        client.insert_rows_json(f"{op['namespace']}.{op['entity']}", [op["record"]])
        return op["record"]
    if store == "firestore":
        from google.cloud import firestore

        db = firestore.Client(project=_PROJECT, database=op["namespace"].replace("_", "-"))
        ref = db.collection(op["entity"]).document()
        ref.set(op["record"])
        return {"id": ref.id, **op["record"]}
    if store == "alloydb":
        return _alloydb_append(op)
    raise KeyError(f"append unsupported for store {store}")


def _dsn() -> str:
    """Resolve the AlloyDB DSN from Secret Manager (secret id from env)."""
    from google.cloud import secretmanager

    secret = os.environ.get("GE_AGENT_ALLOYDB_DSN_SECRET", "ge-agent-alloydb-dsn")
    name = f"projects/{_PROJECT}/secrets/{secret}/versions/latest"
    return secretmanager.SecretManagerServiceClient().access_secret_version(name=name).payload.data.decode()


def _alloydb_read(op: dict[str, Any]) -> list[dict[str, Any]]:
    import psycopg
    import psycopg.rows

    where = " AND ".join(f"{k}=%({k})s" for k in op["filters"]) or "TRUE"
    with psycopg.connect(_dsn(), dbname=op["namespace"]) as conn, conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
        cur.execute(f"SELECT * FROM {op['entity']} WHERE {where} LIMIT 50", op["filters"])
        return cur.fetchall()


def _alloydb_append(op: dict[str, Any]) -> dict[str, Any]:
    import psycopg

    cols = ", ".join(op["record"].keys())
    vals = ", ".join(f"%({k})s" for k in op["record"])
    with psycopg.connect(_dsn(), dbname=op["namespace"]) as conn, conn.cursor() as cur:
        cur.execute(f"INSERT INTO {op['entity']} ({cols}) VALUES ({vals})", op["record"])
        conn.commit()
    return op["record"]
