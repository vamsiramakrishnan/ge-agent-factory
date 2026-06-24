import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const ACCOUNTS = ["1000-Cash", "2000-AP", "2100-AR", "3000-Revenue", "4000-Expense", "5000-COGS"];

function seedLedgerTable(schema, generatedTables, tableName, offset = 0) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 6).forEach((row, index) => {
    const account = ACCOUNTS[(index + offset) % ACCOUNTS.length];
    const sign = account.includes("AP") || account.includes("Expense") || account.includes("COGS") ? -1 : 1;
    setIfColumn(row, tableDef.columns, "posting_date", `2026-05-${String(20 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "account", account);
    setIfColumn(row, tableDef.columns, "amount", sign * [12840.5, 6400.75, 9200, 45100.25, 780.5, 33000][index]);
    setIfColumn(row, tableDef.columns, "currency", "USD");
    setIfColumn(row, tableDef.columns, "description", `${tableName} seeded ${account} close evidence for variance and reconciliation checks.`);
    setIfColumn(row, tableDef.columns, "status", index === 1 ? "pending" : index === 5 ? "reversed" : "posted");
  });
}

function seedPayableReceivable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "vendor", ["Apex Facilities", "Northstar Logistics", "Summit Software", "Vertex Components"][index]);
    setIfColumn(row, tableDef.columns, "amount", [9200.25, 144000, 31800.5, 7600][index]);
    setIfColumn(row, tableDef.columns, "currency", "USD");
    setIfColumn(row, tableDef.columns, "status", ["pending", "approved", "paid", "rejected"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(9 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "due_date", `2026-06-${String(9 + index * 3).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "description", `${tableName} seeded for cash, exception, and aging analysis.`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} record carries close-control and audit-context metadata.`);
  });
}

export const financeErpPack = {
  id: "system_finance_erp",
  layer: "system",
  description: "Common finance ERP recipe for SAP S/4HANA FI/CO, GL, AP, AR, close, treasury, tax, and controls.",
  departments: ["finance"],
  systems: ["sap_s_4hana_fi", "sap_s_4hana"],
  capabilities: ["gl", "ap", "ar", "close", "treasury", "tax", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["erp_finance", "tax_treasury", "planning_epm"],
    collections: ["vendors", "invoices", "journal_entries", "payments", "bank_accounts", "payment_batches", "tax_filings", "forecast_lines"],
    materializes: "ledger, AP/AR, invoice, payment, cash, tax, and close-control rows into finance simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/sap_s_4hana/, /sap s\/4hana/, /gl_entries/, /subledger/, /accounts_payable/, /accounts_receivable/, /treasury/, /\btax\b/, /\bclose\b/]);
  },
  apply({ schema, generatedTables }) {
    seedLedgerTable(schema, generatedTables, "gl_entries", 0);
    seedLedgerTable(schema, generatedTables, "subledger_balances", 1);
    seedLedgerTable(schema, generatedTables, "open_items", 2);
    seedPayableReceivable(schema, generatedTables, "accounts_payable");
    seedPayableReceivable(schema, generatedTables, "accounts_receivable");
    seedPayableReceivable(schema, generatedTables, "invoices");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_finance_erp",
      expectedToolKinds: ["query", "calculation", "action"],
      mustReferenceEntities: ["gl_entries", "subledger_balances", "open_items", "accounts_payable", "accounts_receivable"],
      successCriteria: ["Back close, cash, AP, AR, and control claims with ledger evidence.", "Call out pending or reversed records as exceptions.", "Preserve audit trail details for write-like finance actions."],
      refusalRules: ["Do not certify, close, or post finance actions without ledger and exception evidence."],
    });
  },
};
