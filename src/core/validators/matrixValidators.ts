import { Matrix, SlaeProblem, ValidationIssue, ValidationResult, Vector } from '../types';

export const validateDimensions = (matrix: Matrix, vector: Vector): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const size = matrix.length;

  if (vector.length !== size) {
    issues.push({ field: 'vector', message: 'Vector length must match matrix size.' });
  }

  matrix.forEach((row, index) => {
    if (row.length !== size) {
      issues.push({ field: `matrix[${index}]`, message: 'Matrix must be square.' });
    }
  });

  return { valid: issues.length === 0, issues };
};

export const validateCramerConstraints = (problem: SlaeProblem): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (problem.size > 4) {
    issues.push({ field: 'size', message: 'Cramer method supports n <= 4.' });
  }
  return { valid: issues.length === 0, issues };
};

export const validateIterativeConstraints = (
  problem: SlaeProblem,
  epsilon: number,
  maxIterations: number
): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (epsilon <= 0) {
    issues.push({ field: 'epsilon', message: 'Epsilon must be positive.' });
  }
  if (maxIterations <= 0) {
    issues.push({ field: 'maxIterations', message: 'Iterations must be positive.' });
  }
  if (problem.matrix.length !== problem.vector.length) {
    issues.push({ field: 'dimensions', message: 'Matrix and vector dimensions must match.' });
  }
  return { valid: issues.length === 0, issues };
};
