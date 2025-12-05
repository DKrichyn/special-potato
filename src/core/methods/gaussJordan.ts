import { cloneMatrix, isSquareMatrix } from '../utils/matrixUtils';
import { Matrix, MethodResult, SlaeProblem, Vector } from '../types';

const SINGULAR_TOLERANCE = 1e-12;

/**
 * Solve a system of linear equations using the Gauss–Jordan elimination method.
 * Returns a solution vector for full-rank systems, or an error message when the
 * system is singular or inconsistent.
 */
export function solveGaussJordan(A: Matrix, B: Vector): MethodResult {
  const size = A.length;

  if (size === 0) {
    return { method: 'gaussJordan', x: null, errorMessage: 'Matrix must not be empty.' };
  }

  if (!isSquareMatrix(A)) {
    return { method: 'gaussJordan', x: null, errorMessage: 'Matrix must be square.' };
  }

  if (B.length !== size) {
    return { method: 'gaussJordan', x: null, errorMessage: 'Vector length must match matrix size.' };
  }

  const augmented = cloneMatrix(A).map((row, index) => [...row, B[index]]);
  let pivotRow = 0;

  for (let col = 0; col < size && pivotRow < size; col += 1) {
    let maxRow = pivotRow;
    let maxValue = Math.abs(augmented[pivotRow][col]);

    for (let row = pivotRow + 1; row < size; row += 1) {
      const value = Math.abs(augmented[row][col]);
      if (value > maxValue) {
        maxValue = value;
        maxRow = row;
      }
    }

    if (maxValue < SINGULAR_TOLERANCE) {
      continue;
    }

    if (maxRow !== pivotRow) {
      [augmented[pivotRow], augmented[maxRow]] = [augmented[maxRow], augmented[pivotRow]];
    }

    const pivotValue = augmented[pivotRow][col];

    for (let j = col; j <= size; j += 1) {
      augmented[pivotRow][j] /= pivotValue;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === pivotRow) continue;
      const factor = augmented[row][col];
      if (Math.abs(factor) < SINGULAR_TOLERANCE) continue;
      for (let j = col; j <= size; j += 1) {
        augmented[row][j] -= factor * augmented[pivotRow][j];
      }
    }

    pivotRow += 1;
  }

  for (let row = 0; row < size; row += 1) {
    const coefficientNorm = augmented[row]
      .slice(0, size)
      .reduce((sum, value) => sum + Math.abs(value), 0);
    const rhsValue = Math.abs(augmented[row][size]);

    if (coefficientNorm < SINGULAR_TOLERANCE && rhsValue >= SINGULAR_TOLERANCE) {
      return { method: 'gaussJordan', x: null, errorMessage: 'System is inconsistent.' };
    }
  }

  if (pivotRow < size) {
    return {
      method: 'gaussJordan',
      x: null,
      errorMessage: 'Matrix is singular or has infinitely many solutions.'
    };
  }

  const solution: Vector = augmented.map((row) => row[size]);
  return { method: 'gaussJordan', x: solution };
}

// Backwards compatibility wrapper for existing callers using SlaeProblem input.
export const solveWithGaussJordan = (problem: SlaeProblem): MethodResult =>
  solveGaussJordan(problem.matrix, problem.vector);
