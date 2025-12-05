# SLAE Solver SPA Architecture

## Folder Structure
- `src/App.tsx` — Entry composition of the SPA, connects UI widgets with hooks.
- `src/main.tsx` — React bootstrap targeting `#root`.
- `src/styles/global.css` — Global styles (CSS Modules can be added alongside components).
- `src/core/` — Pure, framework-agnostic math and data utilities.
  - `types.ts` — Shared matrix/vector, solver, and validation types.
  - `methods/` — One file per numerical method (`cramer.ts`, `gaussianElimination.ts`, `gaussJordan.ts`, `gaussSeidel.ts`, `jacobi.ts`) plus `metadata.ts` registry and `index.ts` barrel.
  - `parsers/` — Data ingestion helpers (e.g., `fileParser.ts`).
  - `validators/` — Input and constraint validation (`matrixValidators.ts`).
  - `utils/` — Math helpers and solution checking (`matrixUtils.ts`, `checkSolution.ts`).
- `src/components/` — Presentational React components for UI sections.
- `src/hooks/` — Stateful glue between UI and core (`useSlaeSolver`, `useFileUpload`).
- `src/tests/` — Vitest suites targeting both core and UI contracts.
- `public/` — Static assets (currently empty but reserved for favicons, etc.).

## Key Files and Responsibilities
- **`core/types.ts`** defines the domain model used everywhere, ensuring math code stays pure and UI interactions stay strongly typed.
- **Method files** expose pure solver functions that accept a `SlaeProblem` and options, returning `SolveResult` or `IterativeSolveResult` with rich metadata (errors, warnings, iteration logs).
- **`parsers/fileParser.ts`** normalizes numeric input (dot/comma) and builds a `SlaeProblem` from text uploads.
- **`validators/matrixValidators.ts`** enforces square matrices, matching dimensions, method-specific constraints, and iterative parameter sanity.
- **`utils/checkSolution.ts`** will compute residuals and norms to validate results against an epsilon threshold.
- **`hooks/useSlaeSolver.ts`** orchestrates method selection, result state, and solution checking while delegating math to `core/methods`.
- **`components/*`** render selectors, tables, and outputs; they receive data/handlers as props to remain stateless/presentational.
- **`tests/architecture.spec.ts`** locks in the registry and availability of all five required methods.

## Shared Types and Signatures
Core math contracts (from `core/types.ts`):
- `type Matrix = number[][];`
- `type Vector = number[];`
- `type SlaeMethod = 'cramer' | 'gaussianElimination' | 'gaussJordan' | 'gaussSeidel' | 'jacobi';`
- `interface SlaeProblem { size: number; matrix: Matrix; vector: Vector; }`
- `interface BaseSolveOptions { epsilon?: number; maxIterations?: number; initialGuess?: Vector; }`
- `interface IterativeSolveOptions extends BaseSolveOptions { epsilon: number; maxIterations: number; }`
- `interface IterationEntry { iteration: number; vector: Vector; differenceNorm: number; }`
- `interface BaseSolveResult { method: SlaeMethod; solution?: Vector; error?: string; warnings?: string[]; }`
- `interface IterativeSolveResult extends BaseSolveResult { iterationLog: IterationEntry[]; iterations: number; converged: boolean; }`
- `type SolveResult = BaseSolveResult | IterativeSolveResult;`
- `interface SolutionCheck { residual: Vector; residualNorm: number; valid: boolean; }`
- `interface FileParseResult { problem?: SlaeProblem; error?: string; }`
- `interface ValidationIssue { field: string; message: string; }`
- `interface ValidationResult { valid: boolean; issues: ValidationIssue[]; }`
- `interface MethodMetadata { id: SlaeMethod; label: string; description: string; supportsIterativeParams: boolean; }`

## Component ↔ Core Interaction
1. **User input** — `MethodSelector`, `InputModeSelector`, `MatrixInput`, `VectorInput`, `IterativeParamsForm`, and `FileUpload` collect configuration and data.
2. **Stateful glue** — `useSlaeSolver` exposes `solve` and `checkSolution`. It calls the selected solver from `core/methods` and stores `SolveResult`/`SolutionCheck` outputs.
3. **Validation** — Solver stubs already call `validators` to demonstrate how UI errors will be propagated via `warnings`/`error` fields.
4. **Output** — `ResultOutput`, `IterationTable`, `SolutionCheckPanel`, and `ErrorBanner` present solver results, iteration logs, and residual checks.
5. **File input** — `useFileUpload` uses `parsers/fileParser` to convert uploaded text into a typed `SlaeProblem`, which the App pushes into React state.

## Next Implementation Steps
- Flesh out math inside `core/methods/*` and `utils` respecting the defined interfaces and validation rules.
- Expand tests to cover numeric correctness, convergence criteria, and UI flows with React Testing Library.
- Wire ESLint/Prettier into CI once package management is available (Node tooling currently unavailable in this environment).
