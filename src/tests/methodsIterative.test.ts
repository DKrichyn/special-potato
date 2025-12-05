import { describe, expect, it } from 'vitest';
import { solveSeidel } from '../core/methods/seidel';
import { solveJacobi } from '../core/methods/jacobi';
import { IterativeParams, Matrix, Vector } from '../core/types';

const solutionVector = [0.2, 0.2];
const A: Matrix = [
  [4, 1],
  [2, 3]
];
const B: Vector = [1, 1];

const convergentParams: IterativeParams = {
  epsilon: 1e-6,
  maxIterations: 50
};

const divergentParams: IterativeParams = {
  epsilon: 1e-6,
  maxIterations: 5
};

describe('Iterative methods', () => {
  it('Gauss-Seidel converges for diagonally dominant system', () => {
    const result = solveSeidel(A, B, convergentParams);
    expect(result.isConverged ?? result.converged).toBe(true);
    expect(result.iterationLog?.length).toBeGreaterThan(0);
    solutionVector.forEach((value, index) => {
      expect((result.x as Vector)[index]).toBeCloseTo(value, 4);
    });
  });

  it('Jacobi converges for diagonally dominant system', () => {
    const result = solveJacobi(A, B, convergentParams);
    expect(result.isConverged ?? result.converged).toBe(true);
    expect(result.iterationLog?.length).toBeGreaterThan(0);
    solutionVector.forEach((value, index) => {
      expect((result.x as Vector)[index]).toBeCloseTo(value, 4);
    });
  });

  it('detects non-convergence within iteration cap for Seidel and Jacobi', () => {
    const nonDominantA: Matrix = [
      [1, 3],
      [2, 1]
    ];
    const nonDominantB: Vector = [5, 5];

    const seidelResult = solveSeidel(nonDominantA, nonDominantB, divergentParams);
    expect(seidelResult.isConverged ?? seidelResult.converged).toBe(false);
    expect(seidelResult.iterations).toBe(divergentParams.maxIterations);
    expect(seidelResult.errorMessage).toBeDefined();

    const jacobiResult = solveJacobi(nonDominantA, nonDominantB, divergentParams);
    expect(jacobiResult.isConverged ?? jacobiResult.converged).toBe(false);
    expect(jacobiResult.iterations).toBe(divergentParams.maxIterations);
    expect(jacobiResult.errorMessage).toBeDefined();
  });
});
