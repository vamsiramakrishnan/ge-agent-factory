#!/usr/bin/env node
import { readPackageManifest } from "../src/index.mjs";

console.log(JSON.stringify(await readPackageManifest(), null, 2));
