# SLAE Solver SPA (Architecture Plan)

This repository contains the scaffold for a React + TypeScript single-page application that will solve systems of linear algebraic equations (SLAE) using five numerical methods (Cramer, Gaussian elimination, Gauss–Jordan, Gauss–Seidel, Jacobi).

## What is included
- Vite-based React/TypeScript project skeleton with strict TS settings.
- Core module layout for math methods, validators, parsers, and utilities.
- Shared domain types for matrices, vectors, solver options/results, and validation.
- Presentational UI components and hooks wiring user input to the math core.
- Documentation of folder architecture and type contracts in `docs/ARCHITECTURE.md`.
- Vitest setup with a contract test ensuring all required methods are registered.

## Next steps
1. Implement the numerical algorithms inside `src/core/methods/*` and utility math functions.
2. Expand validation and error handling to cover degeneracy checks and convergence criteria.
3. Build out automated tests for correctness and UI flows.
4. Run `npm install` (Node tooling unavailable in this environment) and then `npm run dev` for local development.
