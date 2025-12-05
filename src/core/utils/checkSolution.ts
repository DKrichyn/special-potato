import { Matrix, SolutionCheck, Vector } from '../types';
import { matrixVectorMultiply, subtractVectors, vectorNorm } from './matrixUtils';

/**
 * Compute the residual vector r = A·x − b without mutating inputs.
 */
export const computeResidual = (matrix: Matrix, solution: Vector, vector: Vector): Vector => {
  const ax = matrixVectorMultiply(matrix, solution);
  return subtractVectors(ax, vector);
};

/**
 * Evaluate whether a provided solution satisfies A·x = b within the given epsilon tolerance.
 */
export const evaluateSolution = (
  matrix: Matrix,
  solution: Vector,
  vector: Vector,
  epsilon: number
): SolutionCheck => {
  const residual = computeResidual(matrix, solution, vector);
  const residualNorm = vectorNorm(residual);
  const valid = residualNorm <= epsilon;
  return { residual, residualNorm, valid };
};
