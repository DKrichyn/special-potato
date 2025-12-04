import { Matrix, Vector } from "./types";

export interface ParsedSystem {
  A: Matrix;
  B: Vector;
}

/**
 * Parse a free-form text containing n, the matrix A (n×n), and vector B (n).
 * Numbers may be separated by whitespace or newlines.
 */
export function parseSystemFromText(input: string): ParsedSystem {
  const tokens = input
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) throw new Error("Input is empty.");
  const n = Number(tokens[0]);
  if (!Number.isInteger(n) || n <= 0) throw new Error("First value must be a positive integer n.");

  const expected = 1 + n * n + n;
  if (tokens.length !== expected) {
    throw new Error(`Expected ${expected} numbers (n + n^2 matrix entries + n vector entries), but found ${tokens.length}.`);
  }

  const numbers = tokens.slice(1).map((t) => {
    const num = Number(t);
    if (Number.isNaN(num)) throw new Error(`Invalid number encountered: ${t}`);
    return num;
  });

  const A: Matrix = [];
  for (let i = 0; i < n; i++) {
    const rowStart = i * n;
    A.push(numbers.slice(rowStart, rowStart + n));
  }
  const B: Vector = numbers.slice(n * n, n * n + n);

  return { A, B };
}
