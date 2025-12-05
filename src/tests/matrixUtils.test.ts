import { describe, expect, it } from 'vitest';
import {
  determinant,
  matrixVectorMultiply,
  subtractVectors,
  vectorNorm,
  isSquareMatrix,
  cloneMatrix,
  swapRows
} from '../core/utils/matrixUtils';

const almostEqual = (a: number, b: number, eps = 1e-10) => Math.abs(a - b) < eps;

describe('matrixUtils', () => {
  it('computes determinant for 1x1, 2x2, and 3x3 matrices', () => {
    expect(determinant([[5]])).toBe(5);
    expect(determinant([[2, 3], [1, 4]])).toBe(5);
    const det3 = determinant([
      [6, 1, 1],
      [4, -2, 5],
      [2, 8, 7]
    ]);
    expect(almostEqual(det3, -306)).toBe(true);
  });

  it('creates independent clones and swaps rows without mutating inputs', () => {
    const original = [
      [1, 2],
      [3, 4]
    ];
    const cloned = cloneMatrix(original);
    cloned[0][0] = 99;
    expect(original[0][0]).toBe(1);

    const swapped = swapRows(original, 0, 1);
    expect(swapped[0][0]).toBe(3);
    expect(original[0][0]).toBe(1);
  });

  it('performs matrix-vector multiplication, subtraction, and norm', () => {
    const A = [
      [1, 2],
      [3, 4]
    ];
    const x = [1, 1];
    const Ax = matrixVectorMultiply(A, x);
    expect(Ax).toEqual([3, 7]);

    const diff = subtractVectors([5, 6], [1, 2]);
    expect(diff).toEqual([4, 4]);
    expect(vectorNorm(diff)).toBeCloseTo(Math.sqrt(32));
  });

  it('detects square matrices correctly', () => {
    expect(isSquareMatrix([[1]])).toBe(true);
    expect(isSquareMatrix([[1, 2], [3, 4]])).toBe(true);
    expect(isSquareMatrix([[1, 2, 3], [4, 5, 6]])).toBe(false);
  });
});
