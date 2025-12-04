import { Matrix, SolutionCheckResult, Vector } from "./types";
import { multiplyMatrixVector, subtractVectors, vectorNormInf } from "./utils/matrix";

/**
 * Verify a proposed solution by computing the residual r = A·X − B.
 * If the maximum absolute residual is below the tolerance, the solution is
 * considered valid for educational purposes.
 */
export function checkSolution(A: Matrix, B: Vector, X: Vector, tolerance = 1e-6): SolutionCheckResult {
  const Ax = multiplyMatrixVector(A, X);
  const residualVector = subtractVectors(Ax, B);
  const maxResidual = vectorNormInf(residualVector);
  return { isValid: maxResidual <= tolerance, residualVector, maxResidual, tolerance };
}
