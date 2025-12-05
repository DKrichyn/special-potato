export type Matrix = number[][];

export type Vector = number[];

export type MethodName = 'cramer' | 'gauss' | 'gaussJordan' | 'seidel' | 'jacobi';

// Temporary compatibility for existing solver implementations using legacy strings.
export type SlaeMethod = MethodName | 'gaussianElimination' | 'gaussSeidel';

export interface SlaeInput {
  size: number;
  matrix: Matrix;
  vector: Vector;
}

// Backwards compatibility alias until all callers migrate to `SlaeInput`.
export type SlaeProblem = SlaeInput;

export interface BaseSolveOptions {
  epsilon?: number;
  maxIterations?: number;
  initialGuess?: Vector;
}

export interface IterativeParams {
  epsilon: number;
  maxIterations: number;
  initialGuess?: Vector;
}

export interface IterativeSolveOptions extends BaseSolveOptions {
  epsilon: number;
  maxIterations: number;
}

export interface IterationEntry {
  iteration: number;
  vector: Vector;
  differenceNorm: number;
}

export interface BaseMethodResult {
  method: SlaeMethod;
  solution?: Vector;
  x?: Vector | null;
  error?: string;
  errorMessage?: string;
  warnings?: string[];
}

export type BaseSolveResult = BaseMethodResult;

export interface IterativeMethodResult extends BaseMethodResult {
  iterationLog: IterationEntry[];
  iterations: number;
  converged: boolean;
}

export type IterativeSolveResult = IterativeMethodResult;

export type MethodResult = BaseMethodResult | IterativeMethodResult;

export type SolveResult = MethodResult;

export interface CheckSolutionResult {
  residual: Vector;
  residualNorm: number;
  valid: boolean;
}

export type SolutionCheck = CheckSolutionResult;

export interface FileParseResult {
  input?: SlaeInput;
  problem?: SlaeInput;
  error?: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface MethodMetadata {
  id: SlaeMethod;
  label: string;
  description: string;
  supportsIterativeParams: boolean;
}
