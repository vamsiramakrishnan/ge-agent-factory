#!/usr/bin/env node
import { join } from "node:path";
import { closeDatabase, listAgentSpecRegistryDb, openDatabase, replaceAgentSpecRegistryDb } from "../src/db.js";
import { GENERATOR_DATA_ROOT } from "../src/state-paths.js";
import { getUseCases } from "../src/use-cases.js";

const dataRoot = GENERATOR_DATA_ROOT;

await openDatabase(dataRoot);
try {
  replaceAgentSpecRegistryDb(getUseCases());
  const rows = listAgentSpecRegistryDb({ limit: 2000 });
  const summary = {
    ok: true,
    dataRoot,
    sqlite: join(dataRoot, "app.sqlite"),
    total: rows.length,
    buildable: rows.filter((row) => row.buildable).length,
    bySource: rows.reduce((acc, row) => {
      acc[row.sourceKind] = (acc[row.sourceKind] || 0) + 1;
      return acc;
    }, {}),
    families: new Set(rows.map((row) => row.familyId)).size,
  };
  console.log(JSON.stringify(summary, null, 2));
} finally {
  closeDatabase();
}
