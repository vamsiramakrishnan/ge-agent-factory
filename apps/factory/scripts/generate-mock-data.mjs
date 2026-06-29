#!/usr/bin/env node
/**
 * generate-mock-data.mjs — LLM-friendly CLI for generating rich mock data
 *
 * Wraps @faker-js/faker with a declarative schema interface.
 * The LLM specifies WHAT data it wants via flags/JSON, the CLI generates it.
 *
 * USAGE:
 *
 *   # Generate from a schema file (YAML or JSON):
 *   node scripts/generate-mock-data.mjs --schema path/to/schema.json --out fixtures/ --seed 42
 *
 *   # Generate a quick table inline:
 *   node scripts/generate-mock-data.mjs --table employees --rows 50 --seed 42 \
 *     --columns 'id:seq:EMP-{n},name:person.fullName,email:internet.email,department:enum:HR|Finance|IT|Marketing,salary:number:55000:180000,hire_date:date:2020-01-01:2026-01-01,region:enum:North|South|East|West,status:enum:active|inactive|on_leave'
 *
 *   # List available faker generators:
 *   node scripts/generate-mock-data.mjs --list-types
 *
 * COLUMN SPEC FORMAT (for --columns flag):
 *   name:type[:arg1[:arg2[:arg3]]]
 *
 *   Types:
 *     seq:PREFIX-{n}          Sequential ID (EMP-0001, EMP-0002, ...)
 *     number:min:max          Random integer between min and max
 *     float:min:max:decimals  Random float
 *     date:min:max            Random date between ISO dates
 *     enum:val1|val2|val3     Pick from values
 *     boolean:trueRate        Random boolean (default 0.5)
 *     ref:entity.column       Reference another table's column
 *     person.fullName         Faker: full name
 *     person.firstName        Faker: first name
 *     person.lastName         Faker: last name
 *     internet.email          Faker: email
 *     internet.userName       Faker: username
 *     phone.number            Faker: phone number
 *     company.name            Faker: company name
 *     company.buzzPhrase      Faker: business jargon
 *     location.city           Faker: city
 *     location.country        Faker: country
 *     location.streetAddress  Faker: street address
 *     finance.amount:min:max  Faker: currency amount
 *     finance.currencyCode    Faker: currency code
 *     lorem.sentence          Faker: sentence
 *     lorem.paragraph         Faker: paragraph
 *     string.uuid             Faker: UUID
 *     string.alphanumeric:len Faker: random alphanumeric
 *     commerce.product        Faker: product name
 *     commerce.department     Faker: department name
 *     color.human             Faker: color name
 *
 * SCHEMA FILE FORMAT (JSON):
 *   {
 *     "seed": 42,
 *     "tables": [
 *       {
 *         "name": "employees",
 *         "rows": 50,
 *         "columns": [
 *           { "name": "id", "type": "seq", "pattern": "EMP-{n}" },
 *           { "name": "full_name", "type": "person.fullName" },
 *           { "name": "email", "type": "internet.email" },
 *           { "name": "department", "type": "enum", "values": ["HR", "Finance", "IT"] },
 *           { "name": "salary", "type": "number", "min": 55000, "max": 180000 },
 *           { "name": "hire_date", "type": "date", "min": "2020-01-01", "max": "2026-01-01" }
 *         ]
 *       }
 *     ]
 *   }
 *
 * OUTPUT: JSON array to stdout (or files to --out directory)
 */
import { faker } from "@faker-js/faker";
import { parseList } from "@ge/std/list";
import { parseFlagArgs } from "@ge/std/cli-args";
import { toCsv } from "@ge/std/csv-io";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join, extname, basename, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRecipe, generateWithFaker } from "./lib/data-recipe.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const parseArgs = (argv) => parseFlagArgs(argv).flags;

function parseColumnSpec(spec) {
  const parts = parseList(spec);
  return parts.map((part) => {
    const [name, type, ...rest] = part.split(":");
    const col = { name, type: type || "string" };
    if (type === "seq" && rest[0]) col.pattern = rest.join(":");
    else if (type === "number") { col.min = Number(rest[0]) || 0; col.max = Number(rest[1]) || 1000; }
    else if (type === "float") { col.min = Number(rest[0]) || 0; col.max = Number(rest[1]) || 1000; col.decimals = Number(rest[2]) || 2; }
    else if (type === "date") { col.min = rest[0] || "2020-01-01"; col.max = rest[1] || "2026-01-01"; }
    else if (type === "enum") col.values = rest.join(":").split("|");
    else if (type === "boolean") col.trueRate = Number(rest[0]) || 0.5;
    else if (type === "ref") col.ref = rest[0] || "";
    else if (rest.length > 0) { col.min = Number(rest[0]) || undefined; col.max = Number(rest[1]) || undefined; col.len = Number(rest[0]) || undefined; }
    return col;
  });
}

function generateValue(col, rowIndex, generatedTables) {
  const type = col.type || "string";

  if (type === "seq") {
    const pattern = col.pattern || `${col.name?.slice(0, 3).toUpperCase() || "ID"}-{n}`;
    return pattern.replace(/\{n(?::(\d+))?\}/g, (_, pad) =>
      String(rowIndex + 1).padStart(Number(pad) || 4, "0")
    );
  }

  if (type === "number") {
    return faker.number.int({ min: col.min ?? 0, max: col.max ?? 1000 });
  }

  if (type === "float") {
    return Number(faker.number.float({ min: col.min ?? 0, max: col.max ?? 1000, fractionDigits: col.decimals ?? 2 }));
  }

  if (type === "date") {
    const d = faker.date.between({ from: col.min || "2020-01-01", to: col.max || "2026-01-01" });
    return d.toISOString().slice(0, 10);
  }

  if (type === "enum") {
    const values = Array.isArray(col.values) ? col.values : ["A", "B", "C"];
    if (col.weights && Array.isArray(col.weights)) {
      return faker.helpers.weightedArrayElement(
        values.map((v, i) => ({ value: v, weight: col.weights[i] || 1 }))
      );
    }
    return faker.helpers.arrayElement(values);
  }

  if (type === "boolean") {
    return faker.datatype.boolean({ probability: col.trueRate ?? 0.5 });
  }

  if (type === "ref") {
    const [entity, field] = (col.ref || "").split(".");
    const refRows = generatedTables[entity];
    if (refRows && refRows.length > 0) {
      return faker.helpers.arrayElement(refRows)[field || "id"] ?? null;
    }
    return `${entity}-${faker.number.int({ min: 1, max: 100 })}`;
  }

  // Faker method dispatch
  const fakerPath = type.split(".");
  if (fakerPath.length === 2) {
    const [module, method] = fakerPath;
    try {
      const fn = faker[module]?.[method];
      if (typeof fn === "function") {
        const opts = {};
        if (col.min !== undefined) opts.min = col.min;
        if (col.max !== undefined) opts.max = col.max;
        if (col.len !== undefined) opts.length = col.len;
        return Object.keys(opts).length > 0 ? fn(opts) : fn();
      }
    } catch { /* fall through */ }
  }

  // Fallback
  return faker.lorem.word();
}

function generateTable(tableDef, generatedTables) {
  const rows = [];
  const count = tableDef.rows || 50;
  const columns = tableDef.columns || [];

  for (let i = 0; i < count; i++) {
    const row = {};
    for (const col of columns) {
      row[col.name] = generateValue(col, i, generatedTables);
    }
    rows.push(row);
  }
  return rows;
}


async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args["list-types"]) {
    const types = [
      "seq:PATTERN         Sequential ID (e.g., EMP-{n:4})",
      "number:MIN:MAX      Random integer",
      "float:MIN:MAX:DEC   Random float",
      "date:FROM:TO        Random date (ISO format)",
      "enum:A|B|C          Pick from values",
      "boolean:RATE        Random boolean",
      "ref:TABLE.COL       Reference another table",
      "person.fullName     Full name",
      "person.firstName    First name",
      "person.lastName     Last name",
      "internet.email      Email address",
      "internet.userName   Username",
      "phone.number        Phone number",
      "company.name        Company name",
      "company.buzzPhrase  Business jargon",
      "location.city       City",
      "location.country    Country",
      "location.state      State/province",
      "location.streetAddress  Street address",
      "location.zipCode    ZIP/postal code",
      "finance.amount      Currency amount",
      "finance.currencyCode Currency code",
      "finance.accountNumber Account number",
      "lorem.sentence      Sentence",
      "lorem.paragraph     Paragraph",
      "lorem.words         Words",
      "string.uuid         UUID",
      "string.alphanumeric Random alphanumeric",
      "commerce.product    Product name",
      "commerce.department Department",
      "commerce.price      Price string",
      "color.human         Color name",
      "vehicle.vehicle     Vehicle description",
      "system.fileName     File name",
      "hacker.phrase       Tech phrase",
    ];
    console.log("Available column types:\n");
    for (const t of types) console.log(`  ${t}`);
    process.exit(0);
  }

  const seed = Number(args.seed) || 42;
  faker.seed(seed);

  // Pack-schema mode: delegate referentially-consistent, schema-derived generation to
  // the shared recipe library (the high-fidelity path shared with the simulator seed
  // generator). The standalone column-spec/schema-file paths below are unchanged.
  if (args.pack || args.system) {
    const packDir = resolve(args.pack || join(SCRIPT_DIR, "../simulator-systems", args.system));
    const schemaPath = join(packDir, "schema.json");
    if (!existsSync(schemaPath)) {
      console.error(`No schema.json found for pack: ${packDir}`);
      process.exit(1);
      return;
    }
    const contract = { id: basename(packDir), schema: JSON.parse(readFileSync(schemaPath, "utf8")) };
    const recipe = buildRecipe(contract, { seed });
    const tables = generateWithFaker(recipe, { seed });
    if (args.out) {
      await mkdir(join(args.out, "tables"), { recursive: true });
      for (const [name, rows] of Object.entries(tables)) {
        await writeFile(join(args.out, "tables", `${name}.json`), JSON.stringify(rows, null, 2), "utf8");
        await writeFile(join(args.out, "tables", `${name}.csv`), toCsv(rows), "utf8");
      }
    }
    console.log(JSON.stringify({
      ok: true,
      pack: contract.id,
      seed,
      tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])),
    }, null, 2));
    return;
  }

  if (args.schema) {
    const raw = await readFile(args.schema, "utf8");
    const schema = JSON.parse(raw);
    if (schema.seed) faker.seed(schema.seed);

    const outDir = args.out || ".";
    await mkdir(join(outDir, "tables"), { recursive: true });

    const generatedTables = {};
    const manifest = { tables: [], seed: schema.seed || seed };

    for (const tableDef of schema.tables || []) {
      const rows = generateTable(tableDef, generatedTables);
      generatedTables[tableDef.name] = rows;

      const jsonPath = join("tables", `${tableDef.name}.json`);
      const csvPath = join("tables", `${tableDef.name}.csv`);
      await writeFile(join(outDir, jsonPath), JSON.stringify(rows, null, 2), "utf8");
      await writeFile(join(outDir, csvPath), toCsv(rows), "utf8");

      manifest.tables.push({
        name: tableDef.name,
        rows: rows.length,
        columns: (tableDef.columns || []).map((c) => c.name),
        jsonPath,
        csvPath,
      });
    }

    await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
    console.log(JSON.stringify({ ok: true, tables: manifest.tables, output: outDir }, null, 2));
    return;
  }

  if (args.table && args.columns) {
    const columns = parseColumnSpec(args.columns);
    const rows = Number(args.rows) || 50;
    const tableDef = { name: args.table, rows, columns };
    const data = generateTable(tableDef, {});

    if (args.out) {
      await mkdir(args.out, { recursive: true });
      const jsonPath = join(args.out, `${args.table}.json`);
      const csvPath = join(args.out, `${args.table}.csv`);
      await writeFile(jsonPath, JSON.stringify(data, null, 2), "utf8");
      await writeFile(csvPath, toCsv(data), "utf8");
      console.log(JSON.stringify({ ok: true, table: args.table, rows: data.length, files: [jsonPath, csvPath] }, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
    return;
  }

  console.error(`Usage:
  node scripts/generate-mock-data.mjs --schema <schema.json> --out <dir> [--seed N]
  node scripts/generate-mock-data.mjs --table <name> --rows <N> --columns '<spec>' [--out <dir>] [--seed N]
  node scripts/generate-mock-data.mjs --list-types`);
  process.exit(2);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
