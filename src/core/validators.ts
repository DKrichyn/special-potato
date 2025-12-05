import { determinant } from './utils/matrixUtils';
import { IterativeParams, Matrix, MethodName, Vector } from './types';

const ZERO_DETERMINANT_THRESHOLD = 1e-12;

const isDiagonallyDominant = (matrix: Matrix): boolean => {
  const size = matrix.length;
  return matrix.every((row, rowIndex) => {
    const diagonal = Math.abs(row[rowIndex]);
    const offDiagonalSum = row.reduce((sum, value, colIndex) => {
      if (colIndex === rowIndex) return sum;
      return sum + Math.abs(value);
    }, 0);
    return diagonal >= offDiagonalSum && diagonal !== 0;
  });
};

export const validateDimensions = (matrix: Matrix, vector: Vector): string[] => {
  const errors: string[] = [];
  const size = matrix.length;

  if (size === 0) {
    errors.push('Matrix must not be empty.');
    return errors;
  }

  if (vector.length !== size) {
    errors.push('Vector length must match matrix size.');
  }

  matrix.forEach((row, index) => {
    if (row.length !== size) {
      errors.push(`Matrix row ${index} must have length ${size}.`);
    }
  });

  return errors;
};

export const validateForCramer = (matrix: Matrix, vector: Vector): string[] => {
  const errors = validateDimensions(matrix, vector);
  const size = matrix.length;

  if (size > 4) {
    errors.push('Cramer method supports n <= 4.');
  }

  if (errors.length === 0) {
    const det = determinant(matrix);
    if (Math.abs(det) <= ZERO_DETERMINANT_THRESHOLD) {
      errors.push('Matrix determinant is zero; system is singular.');
    }
  }

  return errors;
};

export const validateForGauss = (matrix: Matrix, vector: Vector): string[] => {
  const errors = validateDimensions(matrix, vector);

  if (errors.length === 0) {
    const det = determinant(matrix);
    if (Math.abs(det) <= ZERO_DETERMINANT_THRESHOLD) {
      errors.push('Matrix determinant is zero; system is singular.');
    }
  }

  return errors;
};

export const validateForGaussJordan = (matrix: Matrix, vector: Vector): string[] => {
  const errors = validateDimensions(matrix, vector);

  if (errors.length === 0) {
    const det = determinant(matrix);
    if (Math.abs(det) <= ZERO_DETERMINANT_THRESHOLD) {
      errors.push('Matrix determinant is zero; system is singular.');
    }
  }

  return errors;
};

export const validateForIterative = (
  matrix: Matrix,
  vector: Vector,
  params: IterativeParams
): string[] => {
  const errors = validateDimensions(matrix, vector);

  if (params.epsilon <= 0) {
    errors.push('Epsilon must be positive.');
  }

  if (params.maxIterations <= 0) {
    errors.push('Maximum iterations must be positive.');
  }

  matrix.forEach((row, index) => {
    if (row[index] === 0) {
      errors.push(`Diagonal element at row ${index} is zero; iterative methods require non-zero diagonals.`);
    }
  });

  if (errors.length === 0) {
    const det = determinant(matrix);
    if (Math.abs(det) <= ZERO_DETERMINANT_THRESHOLD) {
      errors.push('Matrix determinant is zero; system is singular.');
    }

    if (!isDiagonallyDominant(matrix)) {
      errors.push('Warning: matrix is not diagonally dominant; convergence may not be guaranteed.');
    }
  }

  return errors;
};

export const validateForMethod = (
  method: MethodName,
  matrix: Matrix,
  vector: Vector,
  params?: IterativeParams
): string[] => {
  switch (method) {
    case 'cramer':
      return validateForCramer(matrix, vector);
    case 'gauss':
      return validateForGauss(matrix, vector);
    case 'gaussJordan':
      return validateForGaussJordan(matrix, vector);
    case 'seidel':
    case 'jacobi':
      if (!params) {
        return ['Iterative parameters are required for iterative methods.'];
      }
      return validateForIterative(matrix, vector, params);
    default:
      return ['Unknown method.'];
  }
};
