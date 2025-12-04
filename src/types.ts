/**
 * Common type aliases used across the SLAE solvers.
 */
export type Matrix = number[][];
export type Vector = number[];

/** Options that control iterative methods such as Jacobi and Gauss–Seidel. */
export interface IterationOptions {
  maxIterations?: number;
  tolerance?: number;
  initialX?: Vector;
}

/** Structured result returned by iterative solvers for educational transparency. */
export interface IterativeResult {
  solution: Vector;
  iterations: number;
  converged: boolean;
  residuals?: number[];
  message?: string;
}

/** Structured output of the solution checker that evaluates residual accuracy. */
export interface SolutionCheckResult {
  isValid: boolean;
  residualVector: Vector;
  maxResidual: number;
  tolerance: number;
}
