import { Matrix, Vector } from "../types";

/**
 * Utility helpers for matrix/vector operations used by multiple algorithms.
 * Keeping these routines small and explicit makes the numerical methods
 * easier to follow for educational purposes.
 */

/** Deep copy a matrix to avoid side effects during elimination. */
export function cloneMatrix(A: Matrix): Matrix {
  return A.map((row) => [...row]);
}

/** Multiply matrix A by vector x (A · x). */
export function multiplyMatrixVector(A: Matrix, x: Vector): Vector {
  return A.map((row) => row.reduce((sum, value, j) => sum + value * x[j], 0));
}

/** Subtract vector b from vector a elementwise (a - b). */
export function subtractVectors(a: Vector, b: Vector): Vector {
  return a.map((value, i) => value - b[i]);
}

/** Infinity norm (max absolute value) of a vector. */
export function vectorNormInf(v: Vector): number {
  return Math.max(...v.map((value) => Math.abs(value)));
}

/**
 * Check whether a matrix is (strictly) diagonally dominant by rows, a
 * sufficient condition for convergence of the Jacobi and Gauss–Seidel methods.
 */
export function isDiagonallyDominant(A: Matrix): boolean {
  return A.every((row, i) => {
    const diag = Math.abs(row[i]);
    const offDiag = row.reduce((sum, value, j) => (i === j ? sum : sum + Math.abs(value)), 0);
    return diag > offDiag;
  });
}

/**
 * Swap two rows in matrix A and vector B together (useful for pivoting).
 */
export function swapRows(A: Matrix, B: Vector, i: number, k: number): void {
  [A[i], A[k]] = [A[k], A[i]];
  [B[i], B[k]] = [B[k], B[i]];
}

/**
 * Compute a determinant using Laplace expansion for small matrices.
 * This routine is intentionally simple and only intended for small n
 * (n ≤ 4) which is sufficient for Cramer's rule in this educational app.
 */
export function determinant(matrix: Matrix): number {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  if (n === 3) {
    const [a, b, c] = matrix;
    return (
      a[0] * (b[1] * c[2] - b[2] * c[1]) -
      a[1] * (b[0] * c[2] - b[2] * c[0]) +
      a[2] * (b[0] * c[1] - b[1] * c[0])
    );
  }
  // Generic Laplace expansion for n <= 4
  if (n === 4) {
    let det = 0;
    for (let col = 0; col < n; col++) {
      const subMatrix: Matrix = matrix.slice(1).map((row) => row.filter((_, j) => j !== col));
      const cofactor = ((col % 2 === 0) ? 1 : -1) * matrix[0][col] * determinant(subMatrix);
      det += cofactor;
    }
    return det;
  }
  throw new Error("Determinant computation is restricted to n ≤ 4 for educational clarity.");
}
