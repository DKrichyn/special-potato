import {
  checkSolution,
  cramerSolve,
  gaussJordanSolve,
  gaussSolve,
  jacobiSolve,
  parseSystemFromText,
  seidelSolve,
} from "./solvers";

function logTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}: ${(err as Error).message}`);
    throw err;
  }
}

function approximatelyEqual(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

function assertVectorClose(actual: number[], expected: number[], eps = 1e-6) {
  if (actual.length !== expected.length)
    throw new Error(`Length mismatch: expected ${expected.length} got ${actual.length}`);
  expected.forEach((value, i) => {
    if (!approximatelyEqual(actual[i], value, eps)) {
      throw new Error(`Value mismatch at index ${i}: expected ${value} got ${actual[i]}`);
    }
  });
}

logTest("Cramer solves a 2x2 system", () => {
  const A = [
    [2, 1],
    [5, 7],
  ];
  const B = [11, 13];
  const X = cramerSolve(A, B);
  assertVectorClose(X, [7, -3]);
});

logTest("Cramer enforces size limit", () => {
  const A = [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ];
  const B = [1, 1, 1, 1, 1];
  let failed = false;
  try {
    cramerSolve(A, B);
  } catch {
    failed = true;
  }
  if (!failed) throw new Error("Expected failure when n exceeds limit");
});

logTest("Gauss solves a 3x3 system", () => {
  const A = [
    [3, -0.1, -0.2],
    [0.1, 7, -0.3],
    [0.3, -0.2, 10],
  ];
  const B = [7.85, -19.3, 71.4];
  const X = gaussSolve(A, B);
  const check = checkSolution(A, B, X);
  if (!check.isValid) throw new Error("Residual too large");
});

logTest("Gauss uses pivoting to handle zero leading element", () => {
  const A = [
    [0, 2, 9],
    [1, -1, 1],
    [2, 3, 1],
  ];
  const B = [7, 2, 3];
  const X = gaussSolve(A, B);
  // Solution computed with an external check: [1, 1, 0]
  assertVectorClose(X, [1, 1, 0]);
});

logTest("Gauss–Jordan matches Gaussian elimination on the same system", () => {
  const A = [
    [3, -0.1, -0.2],
    [0.1, 7, -0.3],
    [0.3, -0.2, 10],
  ];
  const B = [7.85, -19.3, 71.4];
  const x1 = gaussSolve(A, B);
  const x2 = gaussJordanSolve(A, B);
  assertVectorClose(x2, x1, 1e-6);
});

logTest("Jacobi converges on a diagonally dominant system", () => {
  const A = [
    [4, 1, 2],
    [3, 5, 1],
    [1, 1, 3],
  ];
  const B = [4, 7, 3];
  const result = jacobiSolve(A, B, { tolerance: 1e-8, maxIterations: 500 });
  if (!result.converged) throw new Error("Jacobi failed to converge");
  const check = checkSolution(A, B, result.solution, 1e-5);
  if (!check.isValid) throw new Error("Jacobi solution has large residual");
});

logTest("Jacobi reports non-convergence on a tough system", () => {
  const A = [
    [2, 3],
    [2, 1],
  ];
  const B = [5, 3];
  const result = jacobiSolve(A, B, { tolerance: 1e-10, maxIterations: 10 });
  if (result.converged) throw new Error("Expected Jacobi to flag non-convergence");
});

logTest("Seidel converges quickly on a diagonally dominant system", () => {
  const A = [
    [4, 1, 2],
    [3, 5, 1],
    [1, 1, 3],
  ];
  const B = [4, 7, 3];
  const result = seidelSolve(A, B, { tolerance: 1e-8, maxIterations: 200 });
  if (!result.converged) throw new Error("Gauss–Seidel failed to converge");
  const check = checkSolution(A, B, result.solution, 1e-5);
  if (!check.isValid) throw new Error("Gauss–Seidel solution has large residual");
});

logTest("Cramer rejects singular matrix", () => {
  const A = [
    [1, 2],
    [2, 4],
  ];
  const B = [3, 6];
  let failed = false;
  try {
    cramerSolve(A, B);
  } catch (err) {
    failed = true;
  }
  if (!failed) throw new Error("Expected failure on singular matrix");
});

logTest("Solution checker returns residual details", () => {
  const A = [
    [2, 1],
    [5, 7],
  ];
  const B = [11, 13];
  const X = [7, -3];
  const result = checkSolution(A, B, X, 1e-12);
  if (!result.isValid) throw new Error("Expected solution to pass check");
  if (result.maxResidual !== 0) throw new Error("Residual should be zero for exact solution");
});

logTest("Parser reads matrix and vector from formatted text", () => {
  const text = `3
  3 -0.1 -0.2
  0.1 7 -0.3
  0.3 -0.2 10
  7.85 -19.3 71.4`;
  const { A, B } = parseSystemFromText(text);
  if (A.length !== 3 || A[0].length !== 3) throw new Error("Matrix dimensions incorrect");
  if (B.length !== 3) throw new Error("Vector dimensions incorrect");
  const X = gaussSolve(A, B);
  const check = checkSolution(A, B, X);
  if (!check.isValid) throw new Error("Parsed system did not solve correctly");
});

logTest("Parser rejects malformed input", () => {
  const bad = "2 1 2 3"; // missing values
  let failed = false;
  try {
    parseSystemFromText(bad);
  } catch {
    failed = true;
  }
  if (!failed) throw new Error("Expected parser to reject malformed input");
});

console.log("All tests completed.");
