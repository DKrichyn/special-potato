import { Matrix, Vector } from "../types";
import { cloneMatrix, swapRows } from "../utils/matrix";

/**
 * Classical Gaussian elimination with partial pivoting.
 * 1) Forward elimination transforms the augmented matrix to upper triangular form.
 * 2) Back substitution recovers the solution vector.
 */
export function gaussSolve(A: Matrix, B: Vector): Vector {
  const n = A.length;
  if (n === 0) throw new Error("Empty system provided.");
  if (A.some((row) => row.length !== n)) throw new Error("Matrix A must be square.");
  if (B.length !== n) throw new Error("Vector B dimension does not match A.");

  const M = cloneMatrix(A);
  const rhs = [...B];

  // Forward elimination with partial pivoting
  for (let pivot = 0; pivot < n; pivot++) {
    // Choose the row with the largest absolute pivot to improve stability
    let maxRow = pivot;
    for (let r = pivot + 1; r < n; r++) {
      if (Math.abs(M[r][pivot]) > Math.abs(M[maxRow][pivot])) {
        maxRow = r;
      }
    }
    if (Math.abs(M[maxRow][pivot]) < 1e-12) {
      throw new Error("Matrix is singular or nearly singular; Gaussian elimination failed.");
    }
    if (maxRow !== pivot) swapRows(M, rhs, pivot, maxRow);

    // Eliminate entries below the pivot
    for (let row = pivot + 1; row < n; row++) {
      const factor = M[row][pivot] / M[pivot][pivot];
      for (let col = pivot; col < n; col++) {
        M[row][col] -= factor * M[pivot][col];
      }
      rhs[row] -= factor * rhs[pivot];
    }
  }

  // Back substitution to compute solution vector
  const x: Vector = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = rhs[row];
    for (let col = row + 1; col < n; col++) {
      sum -= M[row][col] * x[col];
    }
    x[row] = sum / M[row][row];
  }
  return x;
}
