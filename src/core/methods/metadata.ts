import { MethodMetadata } from '../types';

export const methodMetadata: MethodMetadata[] = [
  {
    id: 'cramer',
    label: "Cramer's Rule",
    description: 'Direct method for small systems (n <= 4).',
    supportsIterativeParams: false
  },
  {
    id: 'gaussianElimination',
    label: 'Gaussian Elimination',
    description: 'Row-reduction to upper triangular form.',
    supportsIterativeParams: false
  },
  {
    id: 'gaussJordan',
    label: 'Gauss–Jordan',
    description: 'Reduced row-echelon form with full pivoting.',
    supportsIterativeParams: false
  },
  {
    id: 'gaussSeidel',
    label: 'Gauss–Seidel',
    description: 'Iterative method using latest updates.',
    supportsIterativeParams: true
  },
  {
    id: 'jacobi',
    label: 'Jacobi',
    description: 'Iterative method using previous iteration values.',
    supportsIterativeParams: true
  }
];
