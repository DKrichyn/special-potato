import { useState } from 'react';
import {
  CheckSolutionResult,
  IterativeParams,
  MethodName,
  MethodResult,
  SlaeInput,
  SlaeMethod
} from '../core/types';
import {
  checkSolution,
  solveCramer,
  solveGauss,
  solveGaussJordan,
  solveJacobi,
  solveSeidel
} from '../core/methods';
import { validateForMethod } from '../core/validators';

const defaultIterativeParams: IterativeParams = {
  epsilon: 1e-3,
  maxIterations: 50,
  initialGuess: undefined
};

const defaultInput: SlaeInput = {
  size: 3,
  matrix: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  vector: [0, 0, 0]
};

type SolverStatus = 'idle' | 'computing' | 'success' | 'error';

interface UseSlaeSolverState {
  input: SlaeInput;
  method: SlaeMethod;
  iterativeParams: IterativeParams;
  result: MethodResult | null;
  status: SolverStatus;
  validationErrors: string[];
  checkSolutionResult: CheckSolutionResult | null;
}

const normalizeMethod = (method: SlaeMethod): MethodName => {
  switch (method) {
    case 'gaussianElimination':
      return 'gauss';
    case 'gaussSeidel':
      return 'seidel';
    default:
      return method as MethodName;
  }
};

const ensureSolution = (result: MethodResult): MethodResult => {
  const solution = result.x ?? result.solution ?? null;
  return {
    ...result,
    x: solution,
    solution
  };
};

export const useSlaeSolver = (
  initialInput: SlaeInput = defaultInput,
  initialMethod: SlaeMethod = 'cramer',
  initialIterativeParams: IterativeParams = defaultIterativeParams
) => {
  const [state, setState] = useState<UseSlaeSolverState>({
    input: initialInput,
    method: initialMethod,
    iterativeParams: initialIterativeParams,
    result: null,
    status: 'idle',
    validationErrors: [],
    checkSolutionResult: null
  });

  const setMethod = (nextMethod: SlaeMethod) => {
    setState((previous) => ({ ...previous, method: nextMethod }));
  };

  const setInput = (nextInput: SlaeInput) => {
    setState((previous) => ({ ...previous, input: nextInput }));
  };

  const setIterativeParams = (nextParams: IterativeParams) => {
    setState((previous) => ({ ...previous, iterativeParams: nextParams }));
  };

  const solve = () => {
    setState((previous) => ({
      ...previous,
      status: 'computing',
      validationErrors: [],
      result: null,
      checkSolutionResult: null
    }));

    setState((previous) => {
      const canonicalMethod = normalizeMethod(previous.method);
      const validationErrors = validateForMethod(
        canonicalMethod,
        previous.input.matrix,
        previous.input.vector,
        previous.iterativeParams
      );

      if (validationErrors.length > 0) {
        return {
          ...previous,
          status: 'error',
          validationErrors,
          result: null
        };
      }

      let methodResult: MethodResult;
      switch (canonicalMethod) {
        case 'cramer':
          methodResult = solveCramer(previous.input.matrix, previous.input.vector);
          break;
        case 'gauss':
          methodResult = solveGauss(previous.input.matrix, previous.input.vector);
          break;
        case 'gaussJordan':
          methodResult = solveGaussJordan(previous.input.matrix, previous.input.vector);
          break;
        case 'seidel':
          methodResult = solveSeidel(
            previous.input.matrix,
            previous.input.vector,
            previous.iterativeParams
          );
          break;
        case 'jacobi':
          methodResult = solveJacobi(
            previous.input.matrix,
            previous.input.vector,
            previous.iterativeParams
          );
          break;
        default:
          methodResult = {
            method: previous.method,
            x: null,
            errorMessage: 'Unsupported method.'
          } as MethodResult;
      }

      const normalizedResult = ensureSolution(methodResult);
      const hasError = Boolean(normalizedResult.errorMessage || normalizedResult.error);

      return {
        ...previous,
        result: normalizedResult,
        status: hasError ? 'error' : 'success',
        validationErrors: []
      };
    });
  };

  const checkCurrentSolution = () => {
    setState((previous) => {
      const solution = previous.result?.x ?? previous.result?.solution;

      if (!solution) {
        return {
          ...previous,
          status: 'error',
          validationErrors: ['No solution available to check.']
        };
      }

      const check = checkSolution(
        previous.input.matrix,
        previous.input.vector,
        solution,
        previous.iterativeParams.epsilon
      );

      return {
        ...previous,
        checkSolutionResult: check
      };
    });
  };

  return {
    state,
    setMethod,
    setInput,
    setIterativeParams,
    solve,
    checkCurrentSolution
  };
};
