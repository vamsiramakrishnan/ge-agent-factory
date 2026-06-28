export function textOf(context) {
  const spec = context.schema?.useCaseSpec || {};
  return [
    spec.id,
    spec.title,
    spec.department,
    context.contract?.primaryObjective,
    ...(context.schema?.systems || []).map((system) => `${system.id || ""} ${system.name || ""}`),
    ...(context.schema?.tables || []).map((table) => table.name),
    ...(context.contract?.toolIntents || []).map((intent) => `${intent.kind || ""} ${intent.name || ""} ${intent.sourceSystemId || ""}`),
  ].join(" ").toLowerCase();
}

export function hasAny(haystack, patterns) {
  return patterns.some((pattern) => pattern.test(haystack));
}

export function applyNoop() {
  // Coverage/intention packs can intentionally avoid data mutation until a
  // domain recipe is explicit.
}

export function setIfColumn(row, columns, name, value) {
  if ((columns || []).some((column) => column.name === name)) row[name] = value;
}

export function hasColumn(tableDef, name) {
  return (tableDef?.columns || []).some((column) => column.name === name);
}

export function ensureRow(rows, index) {
  while (rows.length <= index) rows.push({ ...(rows[rows.length - 1] || {}) });
  return rows[index];
}

export function findTableDef(schema, name) {
  return (schema?.tables || []).find((table) => table.name === name);
}

export function tableRows(generatedTables, name) {
  return generatedTables?.[name] || [];
}

export function appendPackEvalHint(contract, hint) {
  if (!contract || !hint?.packId) return;
  contract.evalEnrichment ||= { packHints: [] };
  contract.evalEnrichment.packHints ||= [];
  if (!contract.evalEnrichment.packHints.some((existing) => existing.packId === hint.packId)) {
    contract.evalEnrichment.packHints.push(hint);
  }
  contract.refusalRules ||= [];
  for (const rule of hint.refusalRules || []) {
    if (!contract.refusalRules.includes(rule)) contract.refusalRules.push(rule);
  }
}

export function appendSimulatorBridgeHint(contract, pack) {
  if (!contract || !pack?.id || !pack?.simulatorInterop) return;
  contract.simulatorEnrichment ||= { packBridges: [] };
  contract.simulatorEnrichment.packBridges ||= [];
  if (contract.simulatorEnrichment.packBridges.some((existing) => existing.packId === pack.id)) return;
  contract.simulatorEnrichment.packBridges.push({
    packId: pack.id,
    simulatorArchetypes: pack.simulatorInterop.archetypes || [],
    simulatorCollections: pack.simulatorInterop.collections || [],
    materializes: pack.simulatorInterop.materializes || "scenario fixtures into simulator seed overlays",
  });
}
