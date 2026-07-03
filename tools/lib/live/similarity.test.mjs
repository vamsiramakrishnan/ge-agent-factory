// Lexical-similarity contract: known values at the extremes, order
// sensitivity ROUGE-L adds over bag-of-words, and empty-string safety.
import { test, expect } from "bun:test";
import { lexicalSimilarity, rougeL, trigramCosine } from "./similarity.mjs";

test("identical strings score 1.0 on every component", () => {
  const result = lexicalSimilarity("thirty days to submit the change", "thirty days to submit the change");
  expect(result.rougeL).toBe(1);
  expect(result.trigramCosine).toBeCloseTo(1, 10);
  expect(result.score).toBeCloseTo(1, 10);
});

test("disjoint strings score ~0", () => {
  const result = lexicalSimilarity("alpha beta gamma", "zzz qqq xxx");
  expect(result.rougeL).toBe(0);
  expect(result.trigramCosine).toBeLessThan(0.05);
  expect(result.score).toBeLessThan(0.05);
});

test("empty strings are safe and score 0", () => {
  for (const [a, b] of [["", "anything"], ["anything", ""], ["", ""]]) {
    const result = lexicalSimilarity(a, b);
    expect(result).toEqual({ score: 0, rougeL: 0, trigramCosine: 0 });
  }
});

test("ROUGE-L penalizes reordering that bag-of-words cannot see", () => {
  const reference = "submit the change within thirty days";
  const shuffled = "days thirty within change the submit";
  expect(rougeL(reference, reference)).toBe(1);
  expect(rougeL(reference, shuffled)).toBeLessThan(0.5);
});

test("trigram cosine is robust to small typos", () => {
  const score = trigramCosine("qualifying life event enrollment window", "qualifyng life event enrolment window");
  expect(score).toBeGreaterThan(0.7);
  expect(score).toBeLessThan(1);
});

test("punctuation and case are normalized away", () => {
  const result = lexicalSimilarity("Thirty days!", "thirty days");
  expect(result.rougeL).toBe(1);
  expect(result.trigramCosine).toBeCloseTo(1, 10);
});

test("blend is the 50/50 mean of the two components and stays deterministic", () => {
  const result = lexicalSimilarity("you have thirty days from the date of birth", "thirty days after the birth date");
  expect(result.score).toBeCloseTo((result.rougeL + result.trigramCosine) / 2, 12);
  expect(lexicalSimilarity("you have thirty days from the date of birth", "thirty days after the birth date")).toEqual(result);
});
