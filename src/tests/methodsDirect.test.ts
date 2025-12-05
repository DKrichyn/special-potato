import { describe, expect, it } from 'vitest';
import { solveCramer } from '../core/methods/cramer';
import { solveGauss } from '../core/methods/gauss';
import { solveGaussJordan } from '../core/methods/gaussJordan';
import { Matrix, Vector } from '../core/types';

const expectVectorClose = (actual: Vector | null | undefined, expected: Vector, tol = 1e-6) => {
  expect(actual).not.toBeNull();
  expect(actual).not.toBeUndefined();
  expected.forEach((value, index) => {
    expect((actual as Vector)[index]).toBeCloseTo(value, 6);
  });
};

describe('Direct methods', () => {
  it('solves 2x2 system with Cramer, Gauss, and Gauss-Jordan', () => {
    const A: Matrix = [
      [2, 1],
      [1, 3]
    ];
    const B: Vector = [5, 6];
    const solution = [1.8, 1.4];

    expectVectorClose(solveCramer(A, B).x, solution);
    expectVectorClose(solveGauss(A, B).x, solution);
    expectVectorClose(solveGaussJordan(A, B).x, solution);
  });

  it('solves 3x3 system with Cramer (n<=4), Gauss, and Gauss-Jordan', () => {
    const A: Matrix = [
      [3, 2, -1],
      [2, -2, 4],
      [-1, 0.5, -1]
    ];
    const B: Vector = [1, -2, 0];
    const solution = [1, -2, -2];

    expectVectorClose(solveCramer(A, B).x, solution);
    expectVectorClose(solveGauss(A, B).x, solution);
    expectVectorClose(solveGaussJordan(A, B).x, solution);
  });
});
