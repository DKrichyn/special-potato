import { describe, expect, it } from 'vitest';
import { checkSolution } from '../core/methods/checkSolution';
import { Matrix, Vector } from '../core/types';

describe('checkSolution', () => {
  const A: Matrix = [
    [2, 1],
    [1, 3]
  ];
  const B: Vector = [5, 6];

  it('validates a correct solution', () => {
    const X: Vector = [1.8, 1.4];
    const result = checkSolution(A, B, X, 1e-6);
    expect(result.valid).toBe(true);
    expect(result.residualNorm).toBeLessThan(1e-6);
  });

  it('flags an incorrect solution', () => {
    const X: Vector = [0, 0];
    const result = checkSolution(A, B, X, 1e-6);
    expect(result.valid).toBe(false);
    expect(result.residualNorm).toBeGreaterThan(0);
  });
});
