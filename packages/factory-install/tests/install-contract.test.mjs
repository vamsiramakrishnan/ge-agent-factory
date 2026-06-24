import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { loadInstallContract } from "../src/index.mjs";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");

test("install contract Terraform variables and outputs match declarations", async () => {
  const contract = await loadInstallContract();
  const terraformRoot = resolve(REPO_ROOT, contract.terraform.root);
  const declarations = await readTerraformDeclarations(terraformRoot);

  assertNoDuplicates(contract.terraform.variables, "contract terraform.variables");
  assertNoDuplicates(contract.terraform.outputs, "contract terraform.outputs");
  assertNoDuplicateDeclarations(declarations.variables, "Terraform variable declarations");
  assertNoDuplicateDeclarations(declarations.outputs, "Terraform output declarations");

  assertSameNames({
    label: "Terraform variables",
    contractNames: contract.terraform.variables,
    terraformDeclarations: declarations.variables,
  });
  assertSameNames({
    label: "Terraform outputs",
    contractNames: contract.terraform.outputs,
    terraformDeclarations: declarations.outputs,
  });
});

async function readTerraformDeclarations(terraformRoot) {
  const dirents = await readdir(terraformRoot, { withFileTypes: true });
  const files = dirents
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".tf"))
    .map((dirent) => resolve(terraformRoot, dirent.name))
    .sort();

  const declarations = {
    variables: [],
    outputs: [],
  };

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const declaration of parseTerraformBlockDeclarations(source, file)) {
      if (declaration.kind === "variable") {
        declarations.variables.push(declaration);
      } else if (declaration.kind === "output") {
        declarations.outputs.push(declaration);
      }
    }
  }

  return declarations;
}

function parseTerraformBlockDeclarations(source, file) {
  const declarations = [];
  const lines = source.split(/\r?\n/);
  let heredocTerminator = null;
  let inBlockComment = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (heredocTerminator) {
      if (line.trim() === heredocTerminator) {
        heredocTerminator = null;
      }
      continue;
    }

    const scanLine = uncommentLine(line, {
      inBlockComment,
      setInBlockComment(nextValue) {
        inBlockComment = nextValue;
      },
    });

    if (!scanLine) {
      continue;
    }

    const declarationMatch = scanLine.match(/^\s*(variable|output)\s+"([^"]+)"\s*\{/);
    if (declarationMatch) {
      declarations.push({
        kind: declarationMatch[1],
        name: declarationMatch[2],
        file,
        line: index + 1,
      });
    }

    const heredocMatch = scanLine.match(/<<-?\s*([A-Za-z_][A-Za-z0-9_]*)/);
    if (heredocMatch) {
      heredocTerminator = heredocMatch[1];
    }
  }

  return declarations;
}

function uncommentLine(line, blockCommentState) {
  let nextLine = line;

  if (blockCommentState.inBlockComment) {
    const commentEnd = nextLine.indexOf("*/");
    if (commentEnd === -1) {
      return "";
    }
    nextLine = nextLine.slice(commentEnd + 2);
    blockCommentState.setInBlockComment(false);
  }

  while (nextLine.trimStart().startsWith("/*")) {
    const commentEnd = nextLine.indexOf("*/");
    if (commentEnd === -1) {
      blockCommentState.setInBlockComment(true);
      return "";
    }
    nextLine = nextLine.slice(commentEnd + 2);
  }

  const trimmed = nextLine.trimStart();
  if (trimmed.startsWith("#") || trimmed.startsWith("//")) {
    return "";
  }

  return nextLine;
}

function assertSameNames({ label, contractNames, terraformDeclarations }) {
  const contractNameSet = new Set(contractNames);
  const terraformNameSet = new Set(terraformDeclarations.map((declaration) => declaration.name));

  const missingFromContract = [...terraformNameSet]
    .filter((name) => !contractNameSet.has(name))
    .sort();
  const missingFromTerraform = [...contractNameSet]
    .filter((name) => !terraformNameSet.has(name))
    .sort();

  assert.deepEqual(
    { missingFromContract, missingFromTerraform },
    { missingFromContract: [], missingFromTerraform: [] },
    `${label} drifted between install-contract.v1.json and installer/terraform/*.tf`,
  );
}

function assertNoDuplicates(names, label) {
  assert.deepEqual(findDuplicates(names), [], `${label} contains duplicate names`);
}

function assertNoDuplicateDeclarations(declarations, label) {
  const duplicateNames = findDuplicates(declarations.map((declaration) => declaration.name));
  assert.deepEqual(
    duplicateNames,
    [],
    `${label} contains duplicate names: ${formatDeclarations(declarations, duplicateNames)}`,
  );
}

function findDuplicates(names) {
  const seen = new Set();
  const duplicates = new Set();

  for (const name of names) {
    if (seen.has(name)) {
      duplicates.add(name);
    }
    seen.add(name);
  }

  return [...duplicates].sort();
}

function formatDeclarations(declarations, names) {
  const nameSet = new Set(names);
  return declarations
    .filter((declaration) => nameSet.has(declaration.name))
    .map((declaration) => `${declaration.name} (${relative(REPO_ROOT, declaration.file)}:${declaration.line})`)
    .join(", ");
}
