import { describe, expect, it } from 'vitest';
import { methodMetadata } from '../core/methods/metadata';
import {
  solveWithCramer,
  solveWithGaussJordan,
  solveWithGaussSeidel,
  solveWithGaussianElimination,
  solveWithJacobi
} from '../core/methods';

describe('method registry', () => {
  it('exposes all five methods', () => {
    expect(methodMetadata).toHaveLength(5);
  });
});

describe('core method stubs', () => {
  it('provides placeholder implementations', () => {
    expect(typeof solveWithCramer).toBe('function');
    expect(typeof solveWithGaussianElimination).toBe('function');
    expect(typeof solveWithGaussJordan).toBe('function');
    expect(typeof solveWithGaussSeidel).toBe('function');
    expect(typeof solveWithJacobi).toBe('function');
  });
});
