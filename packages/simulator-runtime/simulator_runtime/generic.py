from __future__ import annotations

from copy import deepcopy
from typing import Any, Callable

import json
import re

from simulator_runtime import config
from simulator_runtime.async_jobs import build_async_handlers, submit_job
from simulator_runtime.audit import audit_event
from simulator_runtime.state_store import default_memory_store, get_state_store
from simulator_runtime.webhooks import WebhookEmitter, default_emitter


# STATE remains the in-memory default store's backing dict so the engine's default
# behaviour (and tests that read/write generic.STATE directly) is unchanged. All
# reads/writes now go through a StateStore, selected per-system via `stateBackend`.
STATE: dict[str, dict[str, Any]] = default_memory_store()._data

# Webhook emitter is module-level and overridable so callers/tests can inject a fake
# HTTP client + clock. Defaults to the shared best-effort emitter. Absent `emit` specs
# in a contract ⇒ this is never invoked ⇒ behaviour is unchanged.
_WEBHOOK_EMITTER: WebhookEmitter | None = None
SEARCH_CONTROL_ARGS = {
    "query",
    "q",
    "search",
    "$search",
    "filter",
    "filters",
    "$filter",
    "$top",
    "$skip",
    "$skiptoken",
    "$orderby",
    "$select",
    "$expand",
    "limit",
    "count",
    "per_page",
    "page",
    "page_size",
    "pageSize",
    "maxResults",
    "max_results",
    "offset",
    "startAt",
    "start_at",
    "continue",
    "cursor",
    "after",
    "before",
    "startKey",
    "start_key",
    "pageToken",
    "page_token",
    "nextPageToken",
    "next_page_token",
    "ctoken",
    "sort",
    "sort_by",
    "sortBy",
    "sortby",
    "order",
    "order_by",
    "orderBy",
    "direction",
    "fields",
    "field_mask",
    "expand",
    "include",
    "includes",
    "include_linked_data",
    "accountId",
    "account_id",
}


def _state_key(ctx) -> str:
    return f"{ctx.agent_id}:{ctx.system_id}:{ctx.scenario_id}:generic"


def _seed_for(system_id: str) -> dict[str, Any]:
    path = config.packs_dir() / system_id / "seed.json"
    if path.exists():
        return json.loads(path.read_text("utf-8"))
    # Overlay / BYO packs have no on-disk dir; their seed travels inline on the contract.
    try:
        from simulator_runtime.registry import get_simulator_contract

        seed = get_simulator_contract(system_id).get("seed")
        if isinstance(seed, dict):
            return deepcopy(seed)
    except Exception:  # noqa: BLE001 - any lookup failure ⇒ empty seed
        pass
    return {"audit_events": []}


def set_webhook_emitter(emitter: WebhookEmitter | None) -> None:
    """Inject (or reset, with ``None``) the webhook emitter used by submit handlers."""
    global _WEBHOOK_EMITTER
    _WEBHOOK_EMITTER = emitter


def _webhook_emitter() -> WebhookEmitter:
    return _WEBHOOK_EMITTER if _WEBHOOK_EMITTER is not None else default_emitter()


def _state_backend_for(system_id: str) -> str:
    """Read the per-system `stateBackend` contract field (default `memory`).

    Resolved lazily and defensively: synthetic contracts in unit tests are not in
    the registry, so an unknown system silently uses the memory backend. When this
    returns the default `memory`, `get_state_store` applies the global
    `GE_SIMULATOR_STATE_BACKEND` override (if set); a per-system value wins.
    """
    try:
        from simulator_runtime.registry import get_simulator_contract

        contract = get_simulator_contract(system_id)
    except Exception:  # noqa: BLE001 - any lookup failure ⇒ default memory backend
        return "memory"
    return str(contract.get("stateBackend") or "memory")


def _store_for(ctx):
    return get_state_store(_state_backend_for(ctx.system_id))


def generic_state(ctx) -> dict[str, Any]:
    key = _state_key(ctx)
    store = _store_for(ctx)
    state = store.get(key)
    if state is None:
        seed = _seed_for(ctx.system_id)
        seed.setdefault("audit_events", [])
        state = deepcopy(seed)
        store.set(key, state)
    return state


def _save_state(ctx, state: dict[str, Any]) -> None:
    """Write a mutated state doc back through the store.

    For the memory backend this re-points the same object (a no-op, identical to the
    legacy in-place mutation). Durable backends (firestore/alloydb) need this to
    persist in-place mutations made by the handlers.
    """
    _store_for(ctx).set(_state_key(ctx), state)


def _primary_key(contract: dict[str, Any], collection: str) -> str:
    return contract.get("schema", {}).get("collections", {}).get(collection, {}).get("primaryKey", "id")


def _singular_candidates(collection: str) -> list[str]:
    candidates = [collection]
    if collection.endswith("ies"):
        candidates.append(f"{collection[:-3]}y")
    if collection.endswith(("ses", "xes", "zes", "ches", "shes")):
        candidates.append(collection[:-2])
    if collection.endswith("ves"):
        candidates.extend([f"{collection[:-3]}f", f"{collection[:-3]}fe"])
    if collection.endswith("s") and not collection.endswith("ss"):
        candidates.append(collection[:-1])
    return list(dict.fromkeys(candidates))


def _plural_candidates(singular: str) -> list[str]:
    candidates = [singular, f"{singular}s"]
    if singular.endswith("y") and len(singular) > 1 and singular[-2].lower() not in "aeiou":
        candidates.append(f"{singular[:-1]}ies")
    if singular.endswith(("s", "x", "z", "ch", "sh")):
        candidates.append(f"{singular}es")
    if singular.endswith("f"):
        candidates.append(f"{singular[:-1]}ves")
    if singular.endswith("fe"):
        candidates.append(f"{singular[:-2]}ves")
    return list(dict.fromkeys(candidates))


def _singular(collection: str) -> str:
    candidates = _singular_candidates(collection)
    return candidates[1] if len(candidates) > 1 else collection


def find_collection_for_get(contract: dict[str, Any], singular: str) -> str | None:
    collections = contract.get("schema", {}).get("collections", {})
    for candidate in _plural_candidates(singular):
        if candidate in collections:
            return candidate
    for collection in collections:
        if singular in _singular_candidates(collection):
            return collection
    return None


def _searchable_values(value: Any) -> list[Any]:
    if isinstance(value, list):
        values: list[Any] = []
        for item in value:
            values.extend(_searchable_values(item))
        return values
    if isinstance(value, dict):
        values: list[Any] = []
        for item in value.values():
            values.extend(_searchable_values(item))
        return values
    return [value]


def _matches_query(row: dict[str, Any], query: str, text_fields: list[str] | None = None) -> bool:
    if not query:
        return True
    lowered = query.lower()
    values = [row.get(field) for field in text_fields] if text_fields else row.values()
    scalars = [scalar for value in values for scalar in _searchable_values(value)]
    return any(lowered in str(value).lower() for value in scalars if isinstance(value, (str, int, float, bool)))


def _row_fields_for_filter(field: str) -> list[str]:
    if field == "status":
        return ["status", "state"]
    if field == "state":
        return ["state", "status"]
    return [field]


def _matches_filter_value(row_value: Any, expected: Any) -> bool:
    if isinstance(expected, (list, tuple, set)):
        return any(_matches_filter_value(row_value, value) for value in expected)
    if isinstance(row_value, str) and isinstance(expected, str):
        expected_values = [expected]
        if ":" in expected:
            expected_values.append(expected.split(":", 1)[1])
        if "=" in expected:
            expected_values.append(expected.split("=", 1)[1])
        return any(row_value.lower() == value.lower() for value in expected_values)
    return row_value == expected


def _coerce_list(value: Any) -> list[Any]:
    if value is None or value == "":
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    if isinstance(value, set):
        return list(value)
    if isinstance(value, str) and "," in value:
        return [item.strip() for item in value.split(",") if item.strip()]
    return [value]


def _compare_scalar(row_value: Any, expected: Any, op: str) -> bool:
    if row_value is None:
        return False
    op = (op or "eq").lower()
    if op in {"eq", "equals"}:
        return _matches_filter_value(row_value, expected)
    if op in {"eq_ci", "equals_ci"}:
        return str(row_value).lower() == str(expected).lower()
    if op in {"ne", "not_eq"}:
        return not _matches_filter_value(row_value, expected)
    if op == "in":
        return any(_matches_filter_value(row_value, item) for item in _coerce_list(expected))
    if op == "contains":
        expected_values = [expected]
        if isinstance(expected, str) and ":" in expected:
            expected_values.append(expected.split(":", 1)[1])
        if isinstance(expected, str) and "=" in expected:
            expected_values.append(expected.split("=", 1)[1])
        if isinstance(row_value, list):
            return any(_matches_filter_value(item, value) for value in expected_values for item in row_value)
        return any(str(value).lower() in str(row_value).lower() for value in expected_values)
    if op in {"gte", "ge", "gt", "lte", "le", "lt"}:
        try:
            left: Any = float(row_value)
            right: Any = float(expected)
        except (TypeError, ValueError):
            left = str(row_value)
            right = str(expected)
        if op in {"gte", "ge"}:
            return left >= right
        if op == "gt":
            return left > right
        if op in {"lte", "le"}:
            return left <= right
        return left < right
    return _matches_filter_value(row_value, expected)


def _strip_odata_quotes(value: str) -> str:
    value = str(value).strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def _parse_odata_literal(raw: str) -> Any:
    raw = str(raw).strip()
    if raw.startswith("(") and raw.endswith(")"):
        return [_strip_odata_quotes(item) for item in raw[1:-1].split(",") if item.strip()]
    return _strip_odata_quotes(raw)


def _walk_nested_values(value: Any, parts: list[str]) -> list[Any]:
    if not parts:
        return _coerce_list(value)
    if isinstance(value, list):
        values: list[Any] = []
        for item in value:
            values.extend(_walk_nested_values(item, parts))
        return values
    if isinstance(value, dict):
        part = parts[0]
        if part in value:
            return _walk_nested_values(value[part], parts[1:])
    return []


def _row_values_for_path(row: dict[str, Any], path: str) -> list[Any]:
    path = str(path)
    direct_candidates = [
        path,
        path.replace("/", "."),
        path.replace(".", "/"),
        path.split("/")[-1],
        path.split(".")[-1],
    ]
    for candidate in direct_candidates:
        if candidate in row:
            return _coerce_list(row.get(candidate))

    normalized = path.replace("/", ".")
    nested = _walk_nested_values(row, [part for part in normalized.split(".") if part])
    if nested:
        return nested

    # Common denormalizations in simulator packs for nested upstream fields.
    if normalized.startswith("parties."):
        values: list[Any] = []
        for field in ("party_names", "counterparty"):
            if field in row:
                values.extend(_coerce_list(row.get(field)))
        return values
    return []


def _matches_odata_clause(row: dict[str, Any], clause: str) -> bool:
    match = re.match(r"^\s*([A-Za-z0-9_./-]+)\s+(eq|ne|gt|ge|lt|le|in)\s+(.+?)\s*$", clause, re.IGNORECASE)
    if not match:
        return True
    field, op, raw_expected = match.groups()
    expected = _parse_odata_literal(raw_expected)
    values = _row_values_for_path(row, field)
    return any(_compare_scalar(value, expected, op.lower()) for value in values)


def _matches_odata_filter(row: dict[str, Any], expression: Any) -> bool:
    text = str(expression or "").strip()
    if not text:
        return True
    and_groups = re.split(r"\s+and\s+", text, flags=re.IGNORECASE)
    for group in and_groups:
        or_clauses = re.split(r"\s+or\s+", group, flags=re.IGNORECASE)
        if not any(_matches_odata_clause(row, clause) for clause in or_clauses):
            return False
    return True


def _looks_like_odata_filter(value: Any) -> bool:
    text = str(value or "")
    return bool(re.search(r"\b(eq|ne|gt|ge|lt|le|in)\b", text, re.IGNORECASE))


def _tool_filter_fields(tool: dict[str, Any], collection_spec: dict[str, Any]) -> set[str]:
    properties = (tool.get("inputSchema") or {}).get("properties") or {}
    schema_fields = set((collection_spec.get("fields") or {}).keys())
    candidates = set(properties) - SEARCH_CONTROL_ARGS
    return {field for field in candidates if field in schema_fields or field in {"status", "state"}}


def _matches_structured_filters(row: dict[str, Any], args: dict[str, Any], filter_fields: set[str]) -> bool:
    for field in filter_fields:
        expected = args.get(field)
        if expected is None or expected == "":
            continue
        row_fields = [candidate for candidate in _row_fields_for_filter(field) if candidate in row]
        if not row_fields:
            continue
        if not any(_matches_filter_value(row.get(candidate), expected) for candidate in row_fields):
            return False
    return True


def _matches_query_dsl(row: dict[str, Any], args: dict[str, Any], query_spec: dict[str, Any]) -> bool:
    filters = query_spec.get("filters") or {}
    for arg_name, rule in filters.items():
        expected = args.get(arg_name)
        if expected is None or expected == "":
            continue
        if isinstance(rule, str):
            field = rule
            op = "eq"
        elif isinstance(rule, dict):
            field = rule.get("field") or arg_name
            op = rule.get("op") or "eq"
        else:
            field = arg_name
            op = "eq"
        if field in {"status", "state"}:
            row_fields = [candidate for candidate in _row_fields_for_filter(field) if candidate in row]
            if not row_fields:
                continue
            if not any(_compare_scalar(row.get(candidate), expected, op) for candidate in row_fields):
                return False
            continue
        if field not in row:
            continue
        if not _compare_scalar(row.get(field), expected, op):
            return False
    return True


def _query_spec_for_tool(tool: dict[str, Any]) -> dict[str, Any]:
    binding = tool.get("binding") if isinstance(tool.get("binding"), dict) else {}
    query = binding.get("query") or tool.get("query") or {}
    return query if isinstance(query, dict) else {}


def _limit_from_args(args: dict[str, Any], pagination: dict[str, Any]) -> int:
    raw = (
        args.get("limit")
        or args.get("count")
        or args.get("$top")
        or args.get("page_size")
        or args.get("pageSize")
        or args.get("per_page")
        or args.get("maxResults")
        or args.get("max_results")
        or pagination.get("defaultLimit")
        or pagination.get("default_limit")
        or 50
    )
    try:
        limit = int(raw)
    except (TypeError, ValueError):
        limit = 50
    max_limit = pagination.get("maxLimit") or pagination.get("max_limit")
    if max_limit is not None:
        try:
            limit = min(limit, int(max_limit))
        except (TypeError, ValueError):
            pass
    return max(1, limit)


def _cursor_offset(rows: list[dict[str, Any]], raw: Any, query_spec: dict[str, Any]) -> int:
    cursor = str(raw or "")
    if not cursor:
        return 0
    fields = query_spec.get("cursorFields") or query_spec.get("cursor_fields") or []
    if not isinstance(fields, list):
        fields = []
    fallback_fields = [
        "id",
        "name",
        "email",
        "dataset_id",
        "table_id",
        "job_id",
        "routine_id",
        "api_id",
        "apiproduct_id",
        "developer_id",
        "envgroup_id",
        "pod_id",
        "deployment_id",
        "service_id",
        "node_id",
    ]
    for index, row in enumerate(rows):
        for field in [*fields, *fallback_fields]:
            if str(row.get(field, "")) == cursor:
                return index
    return 0


def _offset_from_args(args: dict[str, Any], limit: int, rows: list[dict[str, Any]] | None = None, query_spec: dict[str, Any] | None = None) -> int:
    raw = (
        args.get("offset")
        or args.get("$skip")
        or args.get("$skiptoken")
        or args.get("startAt")
        or args.get("start_at")
        or args.get("startKey")
        or args.get("start_key")
        or args.get("continue")
        or args.get("cursor")
        or args.get("after")
        or args.get("pageToken")
        or args.get("page_token")
        or args.get("ctoken")
    )
    if raw not in (None, ""):
        try:
            return max(0, int(raw))
        except (TypeError, ValueError):
            return _cursor_offset(rows or [], raw, query_spec or {})
    page = args.get("page")
    if page not in (None, ""):
        try:
            return max(0, int(page) - 1) * limit
        except (TypeError, ValueError):
            return 0
    return 0


def _sort_rows(rows: list[dict[str, Any]], args: dict[str, Any], query_spec: dict[str, Any]) -> list[dict[str, Any]]:
    sort_field = args.get("sort_by") or args.get("sortBy") or args.get("order_by") or args.get("orderBy") or args.get("$orderby")
    direction = str(args.get("order") or args.get("direction") or "asc").lower()
    if sort_field and isinstance(sort_field, str):
        first_sort = sort_field.strip().split(",", 1)[0].strip()
        if ":" in first_sort:
            field, _, suffix = first_sort.partition(":")
            sort_field = field
            if suffix:
                direction = suffix.lower()
        elif " " in first_sort:
            field, _, suffix = first_sort.partition(" ")
            sort_field = field
            if suffix:
                direction = suffix.lower()
        else:
            sort_field = first_sort
    sort_arg = args.get("sort")
    if sort_arg and not sort_field:
        text = str(sort_arg)
        if text.startswith("-"):
            sort_field = text[1:]
            direction = "desc"
        else:
            sort_field = text
    if not sort_field:
        default_sort = query_spec.get("defaultSort") or query_spec.get("default_sort") or []
        if isinstance(default_sort, list) and default_sort:
            first = default_sort[0]
            if isinstance(first, dict):
                sort_field = first.get("field")
                direction = str(first.get("direction") or direction).lower()
            elif isinstance(first, str):
                sort_field = first
        elif isinstance(default_sort, dict):
            sort_field = default_sort.get("field")
            direction = str(default_sort.get("direction") or direction).lower()
    if not sort_field:
        return rows
    reverse = direction in {"desc", "descending", "-1"}

    def key(row: dict[str, Any]) -> tuple[bool, str]:
        value = row.get(str(sort_field))
        return (value is None, str(value).lower())

    return sorted(rows, key=key, reverse=reverse)


def _page_rows(rows: list[dict[str, Any]], args: dict[str, Any], query_spec: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    pagination = query_spec.get("pagination") or {}
    if not isinstance(pagination, dict):
        pagination = {}
    limit = _limit_from_args(args, pagination)
    offset = _offset_from_args(args, limit, rows, query_spec)
    total = len(rows)
    page = rows[offset:offset + limit]
    next_offset = offset + limit if offset + limit < total else None
    meta = {
        "total": total,
        "limit": limit,
        "offset": offset,
    }
    if next_offset is not None:
        meta["next_offset"] = next_offset
        meta["next_cursor"] = str(next_offset)
        meta["next_ctoken"] = str(next_offset)
        meta["ctoken"] = str(next_offset)
        meta["nextPageToken"] = str(next_offset)
    return page, meta


def _search_handler(contract: dict[str, Any], collection: str, tool: dict[str, Any]) -> Callable[[Any, dict[str, Any]], dict[str, Any]]:
    collection_spec = contract.get("schema", {}).get("collections", {}).get(collection, {})
    query_spec = _query_spec_for_tool(tool)
    filter_fields = _tool_filter_fields(tool, collection_spec) - set((query_spec.get("filters") or {}).keys())

    def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
        state = generic_state(ctx)
        search_arg = args.get("search")
        query = str(args.get("query") or args.get("q") or ("" if _looks_like_odata_filter(search_arg) else search_arg) or args.get("$search") or "")
        query = _strip_odata_quotes(query)
        rows = list(state.get(collection, []))
        if query:
            text_fields = query_spec.get("textFields") or query_spec.get("text_fields")
            rows = [row for row in rows if _matches_query(row, query, text_fields if isinstance(text_fields, list) else None)]
        rows = [row for row in rows if _matches_structured_filters(row, args, filter_fields)]
        if query_spec:
            rows = [row for row in rows if _matches_query_dsl(row, args, query_spec)]
        odata_filter = args.get("$filter") or args.get("odata_filter") or args.get("filter")
        if not odata_filter and _looks_like_odata_filter(search_arg):
            odata_filter = search_arg
        if odata_filter:
            rows = [row for row in rows if _matches_odata_filter(row, odata_filter)]
        rows = _sort_rows(rows, args, query_spec)
        page, page_info = _page_rows(rows, args, query_spec)
        event = audit_event(ctx=ctx, action=f"search_{collection}", entity=collection, entity_id="*", outcome="read")
        state.setdefault("audit_events", []).append(event)
        _save_state(ctx, state)
        return {collection: page, "page": page_info, "audit_event": event}

    return handler


def _requested_includes(args: dict[str, Any], relations: dict[str, Any]) -> set[str]:
    requested: set[str] = set()
    raw = args.get("includes", args.get("include"))
    if isinstance(raw, str):
        requested.update(item.strip() for item in raw.split(",") if item.strip())
    elif isinstance(raw, list):
        requested.update(str(item) for item in raw)
    elif isinstance(raw, dict):
        requested.update(str(name) for name, enabled in raw.items() if enabled)
    for name in relations:
        if args.get(f"include_{name}") is True:
            requested.add(name)
    for name, relation in relations.items():
        if isinstance(relation, dict) and relation.get("defaultInclude"):
            requested.add(name)
    return requested


def _relation_rows(state: dict[str, Any], row: dict[str, Any], relation: dict[str, Any]) -> Any:
    collection = relation.get("collection")
    local_field = relation.get("localField") or relation.get("local_field") or relation.get("sourceField")
    foreign_field = relation.get("foreignField") or relation.get("foreign_field") or relation.get("targetField")
    many = bool(relation.get("many", True))
    if not collection or not local_field or not foreign_field:
        return [] if many else None
    value = row.get(local_field)
    matches = [item for item in state.get(collection, []) if item.get(foreign_field) == value]
    return matches if many else (matches[0] if matches else None)


def _attach_relations(state: dict[str, Any], row: dict[str, Any], collection_spec: dict[str, Any], args: dict[str, Any]) -> dict[str, Any]:
    relations = collection_spec.get("relations") or collection_spec.get("includes") or {}
    if not isinstance(relations, dict) or not relations:
        return {}
    requested = _requested_includes(args, relations)
    out: dict[str, Any] = {}
    for name in requested:
        relation = relations.get(name)
        if isinstance(relation, dict):
            out[name] = _relation_rows(state, row, relation)
    return out


def _get_handler(contract: dict[str, Any], collection: str) -> Callable[[Any, dict[str, Any]], dict[str, Any]]:
    primary_key = _primary_key(contract, collection)
    singular = _singular(collection)
    collection_spec = contract.get("schema", {}).get("collections", {}).get(collection, {})

    def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
        state = generic_state(ctx)
        lookup = args.get(primary_key) or args.get("id") or args.get("source_record_id")
        row = next((item for item in state.get(collection, []) if item.get(primary_key) == lookup), None)
        event = audit_event(ctx=ctx, action=f"get_{singular}", entity=singular, entity_id=str(lookup), outcome="read" if row else "not_found")
        state.setdefault("audit_events", []).append(event)
        _save_state(ctx, state)
        if not row:
            from simulator_runtime.simulators import SimulatorError

            raise SimulatorError("not_found", f"{singular} {lookup} not found", audit=event)
        return {singular: row, **_attach_relations(state, row, collection_spec, args), "audit_event": event}

    return handler


def _list_pending_approvals(contract: dict[str, Any]) -> Callable[[Any, dict[str, Any]], dict[str, Any]]:
    def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
        state = generic_state(ctx)
        source_record_id = args.get("source_record_id")
        approvals = [row for row in state.get("approvals", []) if row.get("state") in {"requested", "pending", "pending_approval"}]
        if source_record_id:
            approvals = [row for row in approvals if row.get("source_record_id") == source_record_id]
        event = audit_event(ctx=ctx, action="list_pending_approvals", entity="approval", entity_id=str(source_record_id or "*"), outcome="read")
        state.setdefault("audit_events", []).append(event)
        _save_state(ctx, state)
        return {"approvals": approvals, "audit_event": event}

    return handler


def _list_audit_events(contract: dict[str, Any]) -> Callable[[Any, dict[str, Any]], dict[str, Any]]:
    def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
        state = generic_state(ctx)
        limit = int(args.get("limit") or 50)
        return {"audit_events": state.get("audit_events", [])[-limit:]}

    return handler


def _workflow_for_tool(contract: dict[str, Any], tool_name: str) -> dict[str, Any] | None:
    return contract.get("workflowCatalog", {}).get("toolHandlers", {}).get(tool_name)


def _next_primary_key(rows: list[dict[str, Any]], primary_key: str, prefix: str) -> str:
    existing = {str(row.get(primary_key)) for row in rows}
    index = len(rows) + 1
    while True:
        candidate = f"{prefix}-{index:04d}"
        if candidate not in existing:
            return candidate
        index += 1


def _create_handler(
    contract: dict[str, Any],
    tool_name: str,
    workflow: dict[str, Any] | None,
    collection: str,
    tool: dict[str, Any],
    binding: dict[str, Any],
) -> Callable[[Any, dict[str, Any]], dict[str, Any]]:
    primary_key = binding.get("primaryKey") or (workflow or {}).get("primaryKey") or _primary_key(contract, collection)
    defaults = dict(binding.get("defaults") or (workflow or {}).get("defaults") or {})
    field_map = binding.get("fieldMap") if isinstance(binding.get("fieldMap"), dict) else {}
    id_prefix = str(binding.get("idPrefix") or collection.upper().replace("_", "-"))
    role_arg = (workflow or {}).get("roleArg", "role")
    allowed_roles = set((workflow or {}).get("allowedRoles") or [])
    latency_config = (workflow or {}).get("latency")
    rate_limit_config = (workflow or {}).get("rateLimit")
    singular = _singular(collection)

    def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
        from simulator_runtime.idempotency import (
            idempotency_key_from_args,
            lookup_replay,
            record_replay,
        )
        from simulator_runtime.throttle import (
            apply_latency,
            default_rate_limiter,
            rate_limit_key,
        )
        from simulator_runtime.simulators import SimulatorError

        idem_key = idempotency_key_from_args(args)
        if idem_key is not None:
            replay = lookup_replay(_store_for(ctx), _state_key(ctx), tool_name, idem_key)
            if replay is not None:
                return replay

        def _finalize(result: dict[str, Any]) -> dict[str, Any]:
            if idem_key is not None:
                record_replay(_store_for(ctx), _state_key(ctx), tool_name, idem_key, result)
            return result

        if rate_limit_config:
            limiter = default_rate_limiter()
            if not limiter.check(rate_limit_key(ctx, rate_limit_config), rate_limit_config):
                event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id="*", outcome="rate_limited")
                raise SimulatorError("rate_limited", f"rate limit exceeded for {tool_name}", audit=event)
        # Chaos (opt-in, see chaos.py) may scale/introduce latency; no active
        # profile returns latency_config untouched. Under virtual time (opt-in,
        # clock.py) the sampled latency is recorded instead of slept; the default
        # path keeps the exact legacy single-argument call.
        from simulator_runtime.chaos import effective_latency
        from simulator_runtime import clock

        latency_effective = effective_latency(latency_config, contract=contract)
        if latency_effective:
            if clock.enabled(ctx, contract):
                apply_latency(latency_effective, ctx=ctx, contract=contract, tool=tool_name)
            else:
                apply_latency(latency_effective)

        state = generic_state(ctx)
        if workflow:
            from simulator_runtime.failures import maybe_inject_failure

            try:
                maybe_inject_failure(
                    ctx=ctx,
                    tool=tool_name,
                    workflow=workflow,
                    contract=contract,
                    entity=singular,
                    entity_id=str(args.get(primary_key) or args.get("id") or "*"),
                    seed=args.get("seed", 0),
                    call_index=len(state.get("audit_events") or []),
                )
            except Exception as injected:  # noqa: BLE001 - persist audit, then re-raise
                audit = getattr(injected, "audit", None)
                if isinstance(audit, dict):
                    state.setdefault("audit_events", []).append(audit)
                    _save_state(ctx, state)
                raise

        role = args.get(role_arg) or getattr(ctx, "role", None)
        if allowed_roles and role not in allowed_roles:
            event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id="*", outcome="permission_denied")
            state.setdefault("audit_events", []).append(event)
            _save_state(ctx, state)
            raise SimulatorError("permission_denied", f"role {role} cannot create {singular}", audit=event)

        rows = state.setdefault(collection, [])
        lookup = args.get(primary_key) or args.get("id") or _next_primary_key(rows, primary_key, id_prefix)
        if any(row.get(primary_key) == lookup for row in rows):
            event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="conflict")
            state.setdefault("audit_events", []).append(event)
            _save_state(ctx, state)
            raise SimulatorError("conflict", f"{singular} {lookup} already exists", audit=event)

        row = {primary_key: lookup, **defaults}
        for key, value in args.items():
            if (key in SEARCH_CONTROL_ARGS and key not in field_map) or key in {role_arg, "role", "seed", "idempotency_key"}:
                continue
            row[field_map.get(key, key)] = value
        row[primary_key] = lookup
        rows.append(row)
        event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="created")
        state.setdefault("audit_events", []).append(event)
        _save_state(ctx, state)
        return _finalize({singular: row, "audit_event": event})

    return handler


def _target_record(
    state: dict[str, Any],
    collection: str,
    primary_key: str,
    args: dict[str, Any],
) -> tuple[Any, dict[str, Any] | None]:
    lookup = args.get(primary_key) or args.get("id") or args.get("source_record_id")
    row = next((item for item in state.get(collection, []) if item.get(primary_key) == lookup), None)
    return lookup, row


def _pending_approvals(state: dict[str, Any], blocker: dict[str, Any], source_record_id: Any) -> list[dict[str, Any]]:
    collection = blocker.get("collection", "approvals")
    source_field = blocker.get("sourceRecordField", "source_record_id")
    states = set(blocker.get("states") or ["requested", "pending", "pending_approval"])
    return [
        row for row in state.get(collection, [])
        if row.get(source_field) == source_record_id and row.get("state") in states
    ]


def _transition_allowed(transitions: dict[str, Any], current: str | None, target: str | None) -> bool:
    if not target:
        return True
    allowed = transitions.get(str(current), transitions.get("*", []))
    return "*" in allowed or target in allowed


def _submit_update_handler(contract: dict[str, Any], tool_name: str, workflow: dict[str, Any]) -> Callable[[Any, dict[str, Any]], dict[str, Any]]:
    collection = workflow["collection"]
    primary_key = workflow.get("primaryKey") or _primary_key(contract, collection)
    state_field = workflow.get("stateField", "status")
    target_state_arg = workflow.get("targetStateArg", state_field)
    role_arg = workflow.get("roleArg", "role")
    note_arg = workflow.get("noteArg", "note")
    allowed_roles = set(workflow.get("allowedRoles") or [])
    transitions = workflow.get("transitions") or {}
    emit_specs = workflow.get("emit") or []
    is_async = bool(workflow.get("async"))
    # Optional, backward-compatible throttling/idempotency config. Absent => off.
    latency_config = workflow.get("latency")
    rate_limit_config = workflow.get("rateLimit")
    singular = _singular(collection)

    def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
        from simulator_runtime.idempotency import (
            idempotency_key_from_args,
            lookup_replay,
            record_replay,
        )
        from simulator_runtime.throttle import (
            apply_latency,
            default_rate_limiter,
            rate_limit_key,
        )

        # Idempotency replay: a previously-seen idempotency_key returns the original
        # stored result without re-running the transition (or any failure injection /
        # latency). Absent key ⇒ normal execution, so behaviour is unchanged.
        idem_key = idempotency_key_from_args(args)
        if idem_key is not None:
            replay = lookup_replay(_store_for(ctx), _state_key(ctx), tool_name, idem_key)
            if replay is not None:
                return replay

        def _finalize(result: dict[str, Any]) -> dict[str, Any]:
            # Persist the result for idempotent replay when a key was supplied.
            if idem_key is not None:
                record_replay(_store_for(ctx), _state_key(ctx), tool_name, idem_key, result)
            return result

        # Token-bucket rate limit (keyed by agent:system by default). No config or
        # zero capacity ⇒ unlimited. Exceeding the bucket raises a typed error the
        # router surfaces as the declared `rate_limited` failure mode.
        if rate_limit_config:
            limiter = default_rate_limiter()
            if not limiter.check(rate_limit_key(ctx, rate_limit_config), rate_limit_config):
                from simulator_runtime.simulators import SimulatorError

                event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id="*", outcome="rate_limited")
                raise SimulatorError("rate_limited", f"rate limit exceeded for {tool_name}", audit=event)

        # Per-tool latency injection (no-op when unconfigured). Chaos (opt-in,
        # chaos.py) may scale/introduce latency — no active profile returns the
        # config untouched. Under virtual time (opt-in, clock.py) the sampled
        # latency is recorded instead of slept; the default path keeps the exact
        # legacy single-argument call.
        from simulator_runtime.chaos import effective_latency
        from simulator_runtime import clock

        latency_effective = effective_latency(latency_config, contract=contract)
        if latency_effective:
            if clock.enabled(ctx, contract):
                apply_latency(latency_effective, ctx=ctx, contract=contract, tool=tool_name)
            else:
                apply_latency(latency_effective)

        state = generic_state(ctx)
        # Deterministically inject a realistic failure mode if the contract
        # declares weighted `failureModes` (per-handler or system-level). Absent
        # weights ⇒ no-op, so existing systems behave exactly as before. The audit
        # event built inside is persisted before the SimulatorError propagates.
        from simulator_runtime.failures import maybe_inject_failure

        try:
            maybe_inject_failure(
                ctx=ctx,
                tool=tool_name,
                workflow=workflow,
                contract=contract,
                entity=singular,
                entity_id=str(
                    args.get(primary_key) or args.get("id") or args.get("source_record_id") or "*"
                ),
                seed=args.get("seed", 0),
                call_index=len(state.get("audit_events") or []),
            )
        except Exception as injected:  # noqa: BLE001 - persist audit, then re-raise
            audit = getattr(injected, "audit", None)
            if isinstance(audit, dict):
                state.setdefault("audit_events", []).append(audit)
                _save_state(ctx, state)
            raise
        role = args.get(role_arg) or getattr(ctx, "role", None)
        target_state = args.get(target_state_arg)
        lookup, row = _target_record(state, collection, primary_key, args)
        if allowed_roles and role not in allowed_roles:
            event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="permission_denied")
            state.setdefault("audit_events", []).append(event)
            _save_state(ctx, state)
            from simulator_runtime.simulators import SimulatorError

            raise SimulatorError("permission_denied", f"role {role} cannot update {singular}", audit=event)
        if not row:
            event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="not_found")
            state.setdefault("audit_events", []).append(event)
            _save_state(ctx, state)
            from simulator_runtime.simulators import SimulatorError

            raise SimulatorError("not_found", f"{singular} {lookup} not found", audit=event)
        for blocker in workflow.get("approvalBlockers") or []:
            blocked_targets = set(blocker.get("blockedTargetStates") or [])
            if (not blocked_targets or target_state in blocked_targets) and _pending_approvals(state, blocker, lookup):
                event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="missing_approval")
                state.setdefault("audit_events", []).append(event)
                _save_state(ctx, state)
                from simulator_runtime.simulators import SimulatorError

                raise SimulatorError("missing_approval", f"{singular} {lookup} has pending approvals", audit=event)
        current_state = row.get(state_field)
        if not _transition_allowed(transitions, current_state, target_state):
            event = audit_event(
                ctx=ctx,
                action=tool_name,
                entity=singular,
                entity_id=str(lookup),
                outcome="invalid_state_transition",
                detail=f"{current_state} -> {target_state}",
            )
            state.setdefault("audit_events", []).append(event)
            _save_state(ctx, state)
            from simulator_runtime.simulators import SimulatorError

            raise SimulatorError("invalid_state_transition", f"cannot transition {singular} {lookup} from {current_state} to {target_state}", audit=event)

        # Async transitions: validation has passed; enqueue a job that applies the
        # mutation when the client polls. Absent `async` in the contract ⇒ synchronous
        # path below ⇒ behaviour unchanged.
        if is_async:
            queued = submit_job(state, tool=tool_name, args=dict(args))
            event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="queued", detail=queued["job_id"])
            state.setdefault("audit_events", []).append(event)
            _save_state(ctx, state)
            return _finalize({**queued, "audit_event": event})

        if target_state:
            row[state_field] = target_state
        note = args.get(note_arg)
        if note:
            row["last_note"] = note
        event = audit_event(ctx=ctx, action=tool_name, entity=singular, entity_id=str(lookup), outcome="updated", detail=note)
        state.setdefault("audit_events", []).append(event)
        # Webhook emission is best-effort: delivery results are recorded in the audit
        # trail but never raise. Absent `emit` specs ⇒ no-op ⇒ behaviour unchanged.
        if emit_specs:
            payload = {
                "system_id": ctx.system_id,
                "agent_id": ctx.agent_id,
                "scenario_id": ctx.scenario_id,
                "tool": tool_name,
                "entity": singular,
                "entity_id": str(lookup),
                "state": row.get(state_field),
                "record": row,
            }
            for delivery in _webhook_emitter().emit(emit_specs, payload):
                state.setdefault("audit_events", []).append(
                    audit_event(
                        ctx=ctx,
                        action="webhook_emit",
                        entity=singular,
                        entity_id=str(lookup),
                        outcome=delivery.get("outcome", "unknown"),
                        detail=f"{delivery.get('event')} -> {delivery.get('target')}",
                    )
                )
        _save_state(ctx, state)
        return _finalize({singular: row, "audit_event": event})

    return handler


_BINDING_OPS = {"search", "get", "create", "submit", "list_pending_approvals", "list_audit_events", "poll_async_job"}


def _explicit_binding(tool: dict[str, Any]) -> dict[str, Any] | None:
    """Return a tool's explicit handler binding ``{op, collection, primaryKey}``.

    Explicit binding removes the two fragile inferences the convention path relies on:
    name-prefix matching and English pluralization guessing (``get_<x>`` → collection).
    A synthesized/validated pack declares ``binding`` per tool; the legacy corpus omits
    it and falls back to the convention below.
    """
    binding = tool.get("binding")
    if isinstance(binding, dict) and binding.get("op") in _BINDING_OPS:
        return binding
    return None


def _bind_explicit(
    contract: dict[str, Any],
    collections: dict[str, Any],
    name: str,
    tool: dict[str, Any],
    binding: dict[str, Any],
) -> Callable[[Any, dict[str, Any]], dict[str, Any]] | None:
    op = binding["op"]
    collection = binding.get("collection")
    if op == "search" and collection in collections:
        return _search_handler(contract, collection, tool)
    if op == "get" and collection in collections:
        return _get_handler(contract, collection)
    if op == "create" and collection in collections:
        return _create_handler(contract, name, _workflow_for_tool(contract, name), collection, tool, binding)
    if op == "submit":
        workflow = _workflow_for_tool(contract, name)
        if workflow and workflow.get("collection") in collections:
            return _submit_update_handler(contract, name, workflow)
    if op == "list_pending_approvals" and (collection or "approvals") in collections:
        return _list_pending_approvals(contract)
    if op == "list_audit_events":
        return _list_audit_events(contract)
    # poll_async_job is provided by build_async_handlers below.
    return None


def build_generic_handlers(contract: dict[str, Any]) -> dict[str, Callable[[Any, dict[str, Any]], dict[str, Any]]]:
    handlers: dict[str, Callable[[Any, dict[str, Any]], dict[str, Any]]] = {}
    collections = contract.get("schema", {}).get("collections", {})
    for tool in contract.get("toolCatalog", {}).get("tools", []):
        name = tool.get("name", "")
        binding = _explicit_binding(tool)
        if binding is not None:
            handler = _bind_explicit(contract, collections, name, tool, binding)
            if handler is not None:
                handlers[name] = handler
            continue
        # ── Convention fallback (legacy corpus without explicit binding) ──
        if name.startswith("search_"):
            collection = name.removeprefix("search_")
            if collection in collections:
                handlers[name] = _search_handler(contract, collection, tool)
        elif name.startswith("get_"):
            collection = find_collection_for_get(contract, name.removeprefix("get_"))
            if collection:
                handlers[name] = _get_handler(contract, collection)
        elif name == "list_pending_approvals" and "approvals" in collections:
            handlers[name] = _list_pending_approvals(contract)
        elif name == "list_audit_events":
            handlers[name] = _list_audit_events(contract)
        elif name.startswith("submit_") and name.endswith("_update"):
            workflow = _workflow_for_tool(contract, name)
            if workflow and workflow.get("collection") in collections:
                handlers[name] = _submit_update_handler(contract, name, workflow)
    # Standalone async-job poll tool (only if the system declares `poll_async_job`).
    handlers.update(
        build_async_handlers(contract, state_loader=generic_state, state_saver=_save_state)
    )
    return handlers
