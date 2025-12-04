import { IterationOptions, IterativeResult, Matrix, Vector } from "../types";
import { isDiagonallyDominant, multiplyMatrixVector, subtractVectors, vectorNormInf } from "../utils/matrix";

/**
 * Gauss–Seidel iterative method. Updates are used immediately to accelerate
 * convergence compared to Jacobi. Suitable for diagonally dominant or
 * symmetric positive-definite systems.
 */
export function seidelSolve(A: Matrix, B: Vector, options: IterationOptions = {}): IterativeResult {
  const n = A.length;
  if (n === 0) throw new Error("Empty system provided.");
  if (A.some((row) => row.length !== n)) throw new Error("Matrix A must be square.");
  if (B.length !== n) throw new Error("Vector B dimension does not match A.");

  const maxIterations = options.maxIterations ?? 1000;
  const tolerance = options.tolerance ?? 1e-6;
  const x: Vector = options.initialX ? [...options.initialX] : new Array(n).fill(0);
  const residuals: number[] = [];

  const dominanceHint = isDiagonallyDominant(A);

  for (let iter = 0; iter < maxIterations; iter++) {
    const xOld = [...x];
    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) sigma += A[i][j] * x[j];
      }
      x[i] = (B[i] - sigma) / A[i][i];
    }
    const Ax = multiplyMatrixVector(A, x);
    const residualVec = subtractVectors(Ax, B);
    const resNorm = vectorNormInf(residualVec);
    residuals.push(resNorm);
    if (resNorm <= tolerance) {
      return { solution: x, iterations: iter + 1, converged: true, residuals, message: dominanceHint ? undefined : "Convergence achieved, but matrix is not diagonally dominant." };
    }
    // Also check change between iterations to avoid stagnation
    const delta = vectorNormInf(subtractVectors(x, xOld));
    if (delta <= tolerance) {
      return { solution: x, iterations: iter + 1, converged: true, residuals, message: "Solution change fell below tolerance." };
    }
  }

  return {
    solution: x,
    iterations: maxIterations,
    converged: false,
    residuals,
    message: dominanceHint ? "Maximum iterations reached without convergence." : "Matrix is not diagonally dominant; method may diverge."
  };
}
