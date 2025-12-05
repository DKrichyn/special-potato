import { isSquareMatrix, matrixVectorMultiply, subtractVectors, vectorNorm } from '../utils/matrixUtils';
import { IterationEntry, IterativeParams, IterativeSolveOptions, MethodResult, Matrix, SlaeProblem, Vector } from '../types';

const ZERO_DIAGONAL_TOLERANCE = 1e-12;

/**
 * Solve a system of linear equations using the Jacobi iterative method.
 * Validates input dimensions, performs iterative updates using the previous
 * iteration values, and stops when the successive approximation difference
 * norm drops below epsilon or when maxIterations is reached.
 */
export function solveJacobi(A: Matrix, B: Vector, params: IterativeParams): MethodResult {
  const size = A.length;

  if (size === 0) {
    return {
      method: 'jacobi',
      x: null,
      iterationLog: [],
      iterations: 0,
      converged: false,
      isConverged: false,
      errorMessage: 'Matrix must not be empty.'
    };
  }

  if (!isSquareMatrix(A)) {
    return {
      method: 'jacobi',
      x: null,
      iterationLog: [],
      iterations: 0,
      converged: false,
      isConverged: false,
      errorMessage: 'Matrix must be square.'
    };
  }

  if (B.length !== size) {
    return {
      method: 'jacobi',
      x: null,
      iterationLog: [],
      iterations: 0,
      converged: false,
      isConverged: false,
      errorMessage: 'Vector length must match matrix size.'
    };
  }

  if (params.epsilon <= 0) {
    return {
      method: 'jacobi',
      x: null,
      iterationLog: [],
      iterations: 0,
      converged: false,
      isConverged: false,
      errorMessage: 'Epsilon must be positive.'
    };
  }

  if (params.maxIterations <= 0) {
    return {
      method: 'jacobi',
      x: null,
      iterationLog: [],
      iterations: 0,
      converged: false,
      isConverged: false,
      errorMessage: 'maxIterations must be positive.'
    };
  }

  if (params.initialGuess && params.initialGuess.length !== size) {
    return {
      method: 'jacobi',
      x: null,
      iterationLog: [],
      iterations: 0,
      converged: false,
      isConverged: false,
      errorMessage: 'Initial guess length must match matrix size.'
    };
  }

  const current: Vector = params.initialGuess ? [...params.initialGuess] : new Array(size).fill(0);
  const iterationLog: IterationEntry[] = [];

  for (let iteration = 1; iteration <= params.maxIterations; iteration += 1) {
    const next: Vector = new Array(size).fill(0);

    for (let i = 0; i < size; i += 1) {
      const diag = A[i][i];
      if (Math.abs(diag) < ZERO_DIAGONAL_TOLERANCE) {
        return {
          method: 'jacobi',
          x: null,
          iterationLog,
          iterations: iteration - 1,
          converged: false,
          isConverged: false,
          errorMessage: 'Zero diagonal element encountered; method cannot proceed.'
        };
      }

      let sum = 0;
      for (let j = 0; j < size; j += 1) {
        if (j === i) continue;
        sum += A[i][j] * current[j];
      }

      next[i] = (B[i] - sum) / diag;
    }

    const difference = subtractVectors(next, current);
    const differenceNorm = vectorNorm(difference);

    iterationLog.push({ iteration, vector: [...next], differenceNorm });

    if (differenceNorm <= params.epsilon) {
      return {
        method: 'jacobi',
        x: next,
        solution: next,
        iterationLog,
        iterations: iteration,
        converged: true,
        isConverged: true
      };
    }

    for (let k = 0; k < size; k += 1) {
      current[k] = next[k];
    }
  }

  const finalResidual = matrixVectorMultiply(A, current);
  const remaining = vectorNorm(subtractVectors(finalResidual, B));

  return {
    method: 'jacobi',
    x: current,
    solution: current,
    iterationLog,
    iterations: params.maxIterations,
    converged: false,
    isConverged: false,
    errorMessage: 'Failed to converge within the maximum number of iterations.',
    warnings: [`Final residual norm: ${remaining}`]
  };
}

export const solveWithJacobi = (
  problem: SlaeProblem,
  options: IterativeSolveOptions
): MethodResult => solveJacobi(problem.matrix, problem.vector, {
    epsilon: options.epsilon,
    maxIterations: options.maxIterations,
    initialGuess: options.initialGuess
  });
