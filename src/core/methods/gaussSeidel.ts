import { IterativeSolveOptions, IterativeSolveResult, SlaeProblem } from '../types';
import { validateDimensions, validateIterativeConstraints } from '../validators/matrixValidators';

export const solveWithGaussSeidel = (
  problem: SlaeProblem,
  options: IterativeSolveOptions
): IterativeSolveResult => {
  const dimensionValidation = validateDimensions(problem.matrix, problem.vector);

  if (!dimensionValidation.valid) {
    return {
      method: 'gaussSeidel',
      error: 'Invalid matrix or vector dimensions.',
      iterationLog: [],
      iterations: 0,
      converged: false,
      warnings: dimensionValidation.issues.map((issue) => issue.message)
    };
  }

  const constraintValidation = validateIterativeConstraints(
    problem,
    options.epsilon,
    options.maxIterations
  );

  if (!constraintValidation.valid) {
    return {
      method: 'gaussSeidel',
      error: 'Iterative constraints violated.',
      iterationLog: [],
      iterations: 0,
      converged: false,
      warnings: constraintValidation.issues.map((issue) => issue.message)
    };
  }

  return {
    method: 'gaussSeidel',
    error: 'Not implemented yet.',
    iterationLog: [],
    iterations: 0,
    converged: false
  };
};
