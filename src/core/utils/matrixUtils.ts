import { Matrix, Vector } from '../types';

/**
 * Create a deep clone of the provided matrix without mutating the original.
 */
export const cloneMatrix = (matrix: Matrix): Matrix => matrix.map((row) => [...row]);

/**
 * Return a new matrix with the two specified rows swapped. The original matrix remains unchanged.
 */
export const swapRows = (matrix: Matrix, rowA: number, rowB: number): Matrix => {
  if (rowA === rowB) {
    return cloneMatrix(matrix);
  }

  return matrix.map((row, index) => {
    if (index === rowA) return [...matrix[rowB]];
    if (index === rowB) return [...matrix[rowA]];
    return [...row];
  });
};

/**
 * Compute the determinant of a square matrix using Gaussian elimination with partial pivoting.
 * Returns 0 for singular matrices. The input matrix is not mutated.
 */
export const determinant = (matrix: Matrix): number => {
  if (!isSquareMatrix(matrix)) {
    throw new Error('Determinant is defined only for square matrices');
  }

  const size = matrix.length;
  if (size === 0) return 0;

  let det = 1;
  let sign = 1;
  const working = cloneMatrix(matrix);

  for (let pivotIndex = 0; pivotIndex < size; pivotIndex += 1) {
    let maxRow = pivotIndex;
    let maxValue = Math.abs(working[pivotIndex][pivotIndex]);

    for (let row = pivotIndex + 1; row < size; row += 1) {
      const value = Math.abs(working[row][pivotIndex]);
      if (value > maxValue) {
        maxValue = value;
        maxRow = row;
      }
    }

    if (maxValue === 0) {
      return 0;
    }

    if (maxRow !== pivotIndex) {
      const swapped = swapRows(working, pivotIndex, maxRow);
      working[pivotIndex] = swapped[pivotIndex];
      working[maxRow] = swapped[maxRow];
      sign *= -1;
    }

    const pivot = working[pivotIndex][pivotIndex];
    det *= pivot;

    for (let row = pivotIndex + 1; row < size; row += 1) {
      const factor = working[row][pivotIndex] / pivot;
      for (let col = pivotIndex; col < size; col += 1) {
        working[row][col] -= factor * working[pivotIndex][col];
      }
    }
  }

  return det * sign;
};

/**
 * Multiply matrix A by vector x, returning a new vector without mutating inputs.
 */
export const matrixVectorMultiply = (matrix: Matrix, vector: Vector): Vector =>
  matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));

/**
 * Subtract vector b from vector a element-wise, returning a new vector.
 */
export const subtractVectors = (a: Vector, b: Vector): Vector => a.map((value, index) => value - b[index]);

/**
 * Compute the Euclidean norm of a vector.
 */
export const vectorNorm = (vector: Vector): number =>
  Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

/**
 * Determine whether the provided matrix is square (n x n).
 */
export const isSquareMatrix = (matrix: Matrix): boolean =>
  matrix.length > 0 && matrix.every((row) => row.length === matrix.length);

