import { IterationOptions, IterativeResult, Matrix, Vector } from "../types";
import { isDiagonallyDominant, multiplyMatrixVector, subtractVectors, vectorNormInf } from "../utils/matrix";

/**
 * Jacobi iterative method. Uses only previous iteration values, making the
 * method easier to parallelize but sometimes slower to converge than
 * Gauss–Seidel.
 */
export function jacobiSolve(A: Matrix, B: Vector, options: IterationOptions = {}): IterativeResult {
  const n = A.length;
  if (n === 0) throw new Error("Empty system provided.");
  if (A.some((row) => row.length !== n)) throw new Error("Matrix A must be square.");
  if (B.length !== n) throw new Error("Vector B dimension does not match A.");

  const maxIterations = options.maxIterations ?? 1000;
  const tolerance = options.tolerance ?? 1e-6;
  let x: Vector = options.initialX ? [...options.initialX] : new Array(n).fill(0);
  const residuals: number[] = [];

  const dominanceHint = isDiagonallyDominant(A);

  for (let iter = 0; iter < maxIterations; iter++) {
    const xNew: Vector = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) sigma += A[i][j] * x[j];
      }
      xNew[i] = (B[i] - sigma) / A[i][i];
    }

    const Ax = multiplyMatrixVector(A, xNew);
    const residualVec = subtractVectors(Ax, B);
    const resNorm = vectorNormInf(residualVec);
    residuals.push(resNorm);

    const delta = vectorNormInf(subtractVectors(xNew, x));
    x = xNew;

    if (resNorm <= tolerance || delta <= tolerance) {
      return { solution: x, iterations: iter + 1, converged: true, residuals, message: dominanceHint ? undefined : "Convergence achieved despite lack of diagonal dominance." };
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
