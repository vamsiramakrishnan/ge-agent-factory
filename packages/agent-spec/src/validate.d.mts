import type { ValidationResult } from "./schema";

/** Array coercion the shipped validators use: arrays filtered of null/undefined; non-empty trimmed strings become one-element arrays; everything else []. */
export declare function asArray(value: unknown): unknown[];
export declare function nonEmptyString(value: unknown): value is string;

export declare function validateGenerationSpec(spec: unknown): ValidationResult;
export declare function validateCatalogParity(raw: unknown, generationSpec?: unknown): string[];
export declare function validateAgentSpecQuality(raw: unknown): ValidationResult;
