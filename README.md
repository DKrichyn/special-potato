# SLAE Educational Solver

This project is a self-contained TypeScript learning tool for solving systems of linear algebraic equations (SLAE) \(A \cdot X = B\) using multiple numerical methods:

- Cramer
- Gauss (Gaussian elimination with pivoting)
- Gauss–Jordan
- Gauss–Seidel (iterative)
- Jacobi (iterative)

A lightweight web UI allows entering matrices manually or loading them from a text file, running any method, and verifying the residuals.

## Getting started

```bash
npm install
npm run build
```

Open `index.html` in a browser after building to use the UI (the compiled scripts live in `dist/`).

### File format for loading systems
```
n
<row-major entries of A (n^2 numbers)>
<entries of B (n numbers)>
```
Whitespace is flexible (spaces or new lines). For example, a 2×2 system could be written as:
```
2
2 1 5 7
11 13
```

### Running the sample tests

```bash
npm test
```

The test harness exercises each solver, checks residual accuracy, and validates error handling on singular matrices.
