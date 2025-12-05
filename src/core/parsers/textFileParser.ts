import { Matrix, SlaeInput, Vector } from '../types';

const normalizeNumber = (value: string): number => {
  const normalized = value.replace(',', '.');
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return parsed;
};

const parseNumberLine = (line: string): number[] => {
  const parts = line.trim().split(/\s+/).filter((part) => part.length > 0);
  if (parts.length === 0) {
    throw new Error('Empty line where numbers were expected');
  }
  return parts.map(normalizeNumber);
};

/**
 * Parse SLAE data from plain text input.
 * Expected format:
 *  n
 *  n lines of matrix A rows
 *  1 or n lines for vector B
 */
export function parseSlaeFromText(text: string): SlaeInput {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Input text is empty');
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error('Not enough data to parse SLAE');
  }

  const sizeValue = lines[0];
  const size = normalizeNumber(sizeValue);
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('First line must be a positive integer size');
  }

  const expectedRows = Number(size);
  if (lines.length < 1 + expectedRows) {
    throw new Error(`Expected ${expectedRows} rows for matrix A`);
  }

  const matrix: Matrix = [];
  for (let rowIndex = 0; rowIndex < expectedRows; rowIndex += 1) {
    const rowLine = lines[1 + rowIndex];
    const rowValues = parseNumberLine(rowLine);
    if (rowValues.length !== expectedRows) {
      throw new Error(`Row ${rowIndex + 1} of matrix A must contain ${expectedRows} numbers`);
    }
    matrix.push(rowValues);
  }

  const remaining = lines.slice(1 + expectedRows);
  if (remaining.length === 0) {
    throw new Error('Missing vector B');
  }

  const vectorTokens = remaining
    .map((line) => parseNumberLine(line))
    .reduce<number[]>((acc, curr) => acc.concat(curr), []);

  if (vectorTokens.length !== expectedRows) {
    throw new Error(`Vector B must contain ${expectedRows} numbers`);
  }

  const vector: Vector = vectorTokens;

  return {
    size: expectedRows,
    matrix,
    vector,
  };
}
