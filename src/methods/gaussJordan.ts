import { Matrix, Vector } from "../types";
import { cloneMatrix, swapRows } from "../utils/matrix";

/**
 * Gauss–Jordan elimination transforms the augmented matrix directly into
 * reduced row-echelon form (RREF), eliminating the need for back substitution.
 */
export function gaussJordanSolve(A: Matrix, B: Vector): Vector {
  const n = A.length;
  if (n === 0) throw new Error("Empty system provided.");
  if (A.some((row) => row.length !== n)) throw new Error("Matrix A must be square.");
  if (B.length !== n) throw new Error("Vector B dimension does not match A.");

  const M = cloneMatrix(A);
  const rhs = [...B];

  for (let pivot = 0; pivot < n; pivot++) {
    // Partial pivoting to choose the largest pivot
    let maxRow = pivot;
    for (let r = pivot + 1; r < n; r++) {
      if (Math.abs(M[r][pivot]) > Math.abs(M[maxRow][pivot])) {
        maxRow = r;
      }
    }
    if (Math.abs(M[maxRow][pivot]) < 1e-12) {
      throw new Error("Matrix is singular or nearly singular; Gauss–Jordan failed.");
    }
    if (maxRow !== pivot) swapRows(M, rhs, pivot, maxRow);

    // Scale pivot row to make the pivot equal to 1
    const pivotValue = M[pivot][pivot];
    for (let col = 0; col < n; col++) {
      M[pivot][col] /= pivotValue;
    }
    rhs[pivot] /= pivotValue;

    // Eliminate all other entries in current column
    for (let row = 0; row < n; row++) {
      if (row === pivot) continue;
      const factor = M[row][pivot];
      for (let col = 0; col < n; col++) {
        M[row][col] -= factor * M[pivot][col];
      }
      rhs[row] -= factor * rhs[pivot];
    }
  }

  return rhs;
}
