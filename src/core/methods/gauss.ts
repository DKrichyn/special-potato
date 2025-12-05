import { cloneMatrix, isSquareMatrix } from '../utils/matrixUtils';
import { Matrix, MethodResult, Vector } from '../types';

const SINGULAR_TOLERANCE = 1e-12;

/**
 * Solve a system of linear equations using Gaussian elimination with partial pivoting.
 * Returns the solution vector or an error message if the system is singular or invalid.
 */
export function solveGauss(A: Matrix, B: Vector): MethodResult {
  const size = A.length;

  if (size === 0) {
    return { method: 'gauss', x: null, errorMessage: 'Matrix must not be empty.' };
  }

  if (!isSquareMatrix(A)) {
    return { method: 'gauss', x: null, errorMessage: 'Matrix must be square.' };
  }

  if (B.length !== size) {
    return { method: 'gauss', x: null, errorMessage: 'Vector length must match matrix size.' };
  }

  const matrix = cloneMatrix(A);
  const rhs = [...B];

  for (let pivot = 0; pivot < size; pivot += 1) {
    let maxRow = pivot;
    let maxValue = Math.abs(matrix[pivot][pivot]);

    for (let row = pivot + 1; row < size; row += 1) {
      const value = Math.abs(matrix[row][pivot]);
      if (value > maxValue) {
        maxValue = value;
        maxRow = row;
      }
    }

    if (maxValue < SINGULAR_TOLERANCE) {
      return {
        method: 'gauss',
        x: null,
        errorMessage: 'Matrix is singular or nearly singular.'
      };
    }

    if (maxRow !== pivot) {
      [matrix[pivot], matrix[maxRow]] = [matrix[maxRow], matrix[pivot]];
      [rhs[pivot], rhs[maxRow]] = [rhs[maxRow], rhs[pivot]];
    }

    const pivotValue = matrix[pivot][pivot];

    for (let row = pivot + 1; row < size; row += 1) {
      const factor = matrix[row][pivot] / pivotValue;
      for (let col = pivot; col < size; col += 1) {
        matrix[row][col] -= factor * matrix[pivot][col];
      }
      rhs[row] -= factor * rhs[pivot];
    }
  }

  const x: Vector = new Array(size).fill(0);

  for (let row = size - 1; row >= 0; row -= 1) {
    const pivotValue = matrix[row][row];
    if (Math.abs(pivotValue) < SINGULAR_TOLERANCE) {
      return {
        method: 'gauss',
        x: null,
        errorMessage: 'Matrix is singular or nearly singular.'
      };
    }

    let sum = 0;
    for (let col = row + 1; col < size; col += 1) {
      sum += matrix[row][col] * x[col];
    }

    x[row] = (rhs[row] - sum) / pivotValue;
  }

  return { method: 'gauss', x };
}
