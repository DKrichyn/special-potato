import { determinant, isSquareMatrix } from '../utils/matrixUtils';
import { Matrix, MethodResult, Vector } from '../types';

/**
 * Solve a system of linear equations using Cramer's rule.
 * Supports systems up to size n <= 4.
 */
export function solveCramer(A: Matrix, B: Vector): MethodResult {
  const size = A.length;

  if (size === 0) {
    return { method: 'cramer', x: null, errorMessage: 'Matrix must not be empty.' };
  }

  if (!isSquareMatrix(A)) {
    return {
      method: 'cramer',
      x: null,
      errorMessage: "Matrix must be square for Cramer's method."
    };
  }

  if (B.length !== size) {
    return { method: 'cramer', x: null, errorMessage: 'Vector length must match matrix size.' };
  }

  if (size > 4) {
    return {
      method: 'cramer',
      x: null,
      errorMessage: 'Cramer method supports systems of size n <= 4.'
    };
  }

  const detA = determinant(A);
  if (detA === 0) {
    return {
      method: 'cramer',
      x: null,
      errorMessage: 'Matrix determinant is zero; system is singular.'
    };
  }

  const x = B.map((_, colIndex) => {
    const modifiedMatrix = A.map((row, rowIndex) => {
      const newRow = [...row];
      newRow[colIndex] = B[rowIndex];
      return newRow;
    });

    const detAi = determinant(modifiedMatrix);
    return detAi / detA;
  });

  return { method: 'cramer', x };
}
