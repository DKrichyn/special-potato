import {
  checkSolution,
  cramerSolve,
  gaussJordanSolve,
  gaussSolve,
  IterationOptions,
  IterativeResult,
  jacobiSolve,
  Matrix,
  parseSystemFromText,
  seidelSolve,
  Vector,
} from "./solvers";

let lastSolution: { A: Matrix; B: Vector; X: Vector } | null = null;

function qs<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el as T;
}

function createMatrixInputs(n: number): void {
  const container = qs<HTMLDivElement>("#matrixContainer");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.className = "matrix-table";

  for (let i = 0; i < n; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.value = "0";
      input.dataset.row = i.toString();
      input.dataset.col = j.toString();
      input.className = "matrix-entry";
      cell.appendChild(input);
      row.appendChild(cell);
    }
    const rhsCell = document.createElement("td");
    const rhsInput = document.createElement("input");
    rhsInput.type = "number";
    rhsInput.value = "0";
    rhsInput.dataset.row = i.toString();
    rhsInput.className = "vector-entry";
    rhsCell.appendChild(rhsInput);
    row.appendChild(rhsCell);
    table.appendChild(row);
  }
  container.appendChild(table);
}

function readSystemFromInputs(): { A: Matrix; B: Vector } {
  const sizeInput = qs<HTMLInputElement>("#sizeInput");
  const n = Number(sizeInput.value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Please specify a positive integer size n.");
  }
  const A: Matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  const B: Vector = new Array(n).fill(0);

  const matrixInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input.matrix-entry"));
  const vectorInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input.vector-entry"));
  if (matrixInputs.length !== n * n || vectorInputs.length !== n) {
    throw new Error("Matrix/vector inputs are incomplete. Rebuild the grid.");
  }

  matrixInputs.forEach((input) => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    const value = Number(input.value);
    if (Number.isNaN(value)) throw new Error("Matrix entries must be numbers.");
    A[row][col] = value;
  });

  vectorInputs.forEach((input) => {
    const row = Number(input.dataset.row);
    const value = Number(input.value);
    if (Number.isNaN(value)) throw new Error("Vector entries must be numbers.");
    B[row] = value;
  });

  return { A, B };
}

function renderSystem(A: Matrix, B: Vector): void {
  const sizeInput = qs<HTMLInputElement>("#sizeInput");
  sizeInput.value = A.length.toString();
  createMatrixInputs(A.length);
  const matrixInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input.matrix-entry"));
  const vectorInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input.vector-entry"));

  matrixInputs.forEach((input) => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    input.value = A[row][col].toString();
  });
  vectorInputs.forEach((input) => {
    const row = Number(input.dataset.row);
    input.value = B[row].toString();
  });
}

function displayResult(html: string): void {
  qs<HTMLDivElement>("#resultArea").innerHTML = html;
}

function attachHandlers(): void {
  const sizeInput = qs<HTMLInputElement>("#sizeInput");
  sizeInput.addEventListener("change", () => {
    const n = Number(sizeInput.value);
    if (Number.isInteger(n) && n > 0) createMatrixInputs(n);
  });

  qs<HTMLButtonElement>("#buildBtn").addEventListener("click", () => {
    const n = Number(sizeInput.value);
    if (!Number.isInteger(n) || n <= 0) {
      alert("Enter a positive integer for n before building the grid.");
      return;
    }
    createMatrixInputs(n);
  });

  qs<HTMLInputElement>("#fileInput").addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    file.text()
      .then((text) => parseSystemFromText(text))
      .then(({ A, B }) => {
        renderSystem(A, B);
        displayResult(`<p class="success">Loaded system from file.</p>`);
      })
      .catch((err) => displayResult(`<p class="error">${err}</p>`));
  });

  qs<HTMLButtonElement>("#solveBtn").addEventListener("click", () => {
    try {
      const method = qs<HTMLSelectElement>("#methodSelect").value;
      const { A, B } = readSystemFromInputs();
      const options: IterationOptions = {
        tolerance: Number(qs<HTMLInputElement>("#toleranceInput").value) || 1e-6,
        maxIterations: Number(qs<HTMLInputElement>("#iterationInput").value) || 1000,
      };

      let solution: Vector;
      let details: IterativeResult | null = null;

      switch (method) {
        case "cramer":
          solution = cramerSolve(A, B);
          break;
        case "gauss":
          solution = gaussSolve(A, B);
          break;
        case "gaussJordan":
          solution = gaussJordanSolve(A, B);
          break;
        case "seidel":
          details = seidelSolve(A, B, options);
          solution = details.solution;
          break;
        case "jacobi":
          details = jacobiSolve(A, B, options);
          solution = details.solution;
          break;
        default:
          throw new Error("Unknown method selected.");
      }

      lastSolution = { A, B, X: solution };

      const baseList = solution
        .map((value, i) => `<li>x<sub>${i + 1}</sub> = ${value.toPrecision(8)}</li>`)
        .join("");

      let html = `<h3>Solution</h3><ul>${baseList}</ul>`;
      if (details) {
        html += `<p><strong>Iterations:</strong> ${details.iterations}</p>`;
        html += `<p><strong>Converged:</strong> ${details.converged ? "Yes" : "No"}</p>`;
        if (details.residuals && details.residuals.length) {
          const lastResidual = details.residuals[details.residuals.length - 1];
          html += `<p><strong>Final residual (∞-norm):</strong> ${lastResidual.toExponential(3)}</p>`;
        }
        if (details.message) html += `<p class="info">${details.message}</p>`;
      }

      displayResult(html);
    } catch (err) {
      displayResult(`<p class="error">${(err as Error).message}</p>`);
    }
  });

  qs<HTMLButtonElement>("#verifyBtn").addEventListener("click", () => {
    if (!lastSolution) {
      displayResult(`<p class="error">No solution available to verify. Solve a system first.</p>`);
      return;
    }
    const { A, B, X } = lastSolution;
    const result = checkSolution(A, B, X, Number(qs<HTMLInputElement>("#toleranceInput").value) || 1e-6);
    const residualList = result.residualVector
      .map((value, i) => `<li>r<sub>${i + 1}</sub> = ${value.toExponential(4)}</li>`)
      .join("");
    const html = `
      <h3>Verification</h3>
      <p><strong>Valid within tolerance:</strong> ${result.isValid ? "Yes" : "No"}</p>
      <p><strong>Max residual:</strong> ${result.maxResidual.toExponential(6)} (tolerance ${result.tolerance})</p>
      <ul>${residualList}</ul>
    `;
    displayResult(html);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize with a 3x3 system grid by default for convenience
  qs<HTMLInputElement>("#sizeInput").value = "3";
  createMatrixInputs(3);
  attachHandlers();
});
