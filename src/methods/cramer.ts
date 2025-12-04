import { Matrix, Vector } from "../types";
import { cloneMatrix, determinant } from "../utils/matrix";

const CRAMER_SIZE_LIMIT = 4; // Educational constraint to avoid huge determinant cost.

/**
 * Solve A·X = B using Cramer's rule. Only suitable for small non-singular systems.
 */
export function cramerSolve(A: Matrix, B: Vector): Vector {
  const n = A.length;
  if (n === 0) throw new Error("Empty system provided.");
  if (A.some((row) => row.length !== n)) throw new Error("Matrix A must be square.");
  if (B.length !== n) throw new Error("Vector B dimension does not match A.");
  if (n > CRAMER_SIZE_LIMIT) throw new Error(`Cramer's rule is limited to n ≤ ${CRAMER_SIZE_LIMIT}.`);

  const detA = determinant(A);
  if (Math.abs(detA) < 1e-12) {
    throw new Error("Determinant is zero or very small; Cramer's method cannot be applied.");
  }

  const solution: Vector = [];
  for (let col = 0; col < n; col++) {
    const modified: Matrix = cloneMatrix(A);
    for (let row = 0; row < n; row++) {
      modified[row][col] = B[row];
    }
    const detAi = determinant(modified);
    solution.push(detAi / detA);
  }
  return solution;
}
