import { BaseSolveResult, SlaeProblem } from '../types';
import { validateDimensions } from '../validators/matrixValidators';

export const solveWithGaussianElimination = (
  problem: SlaeProblem
): BaseSolveResult => {
  const validation = validateDimensions(problem.matrix, problem.vector);

  if (!validation.valid) {
    return {
      method: 'gaussianElimination',
      error: 'Invalid matrix or vector dimensions.',
      warnings: validation.issues.map((issue) => issue.message)
    };
  }

  return {
    method: 'gaussianElimination',
    error: 'Not implemented yet.'
  };
};
