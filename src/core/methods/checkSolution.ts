import { CheckSolutionResult, Matrix, Vector } from '../types';
import { matrixVectorMultiply, subtractVectors, vectorNorm } from '../utils/matrixUtils';

/**
 * Verify a candidate solution vector X against the system A·X = B.
 * Computes the residual r = A·X − B, its Euclidean norm, and evaluates
 * whether the solution satisfies the tolerance epsilon.
 */
export function checkSolution(
  A: Matrix,
  B: Vector,
  X: Vector,
  epsilon = 1e-6
): CheckSolutionResult {
  const ax = matrixVectorMultiply(A, X);
  const residual = subtractVectors(ax, B);
  const residualNorm = vectorNorm(residual);
  const valid = residualNorm <= epsilon;

  return { residual, residualNorm, valid };
}
