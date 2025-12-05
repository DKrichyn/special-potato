import { FileParseResult, Matrix, SlaeProblem, Vector } from '../types';

const normalizeNumber = (value: string): number => Number(value.replace(',', '.'));

const parseRow = (line: string, expectedLength: number): number[] => {
  const values = line.trim().split(/\s+/).map(normalizeNumber);
  if (values.length !== expectedLength) {
    throw new Error(`Row must contain ${expectedLength} numbers`);
  }
  return values;
};

export const parseProblemFromText = (content: string): FileParseResult => {
  try {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const size = Number(lines[0]);
    const matrix: Matrix = [];
    let lineIndex = 1;

    for (; lineIndex <= size; lineIndex += 1) {
      matrix.push(parseRow(lines[lineIndex], size));
    }

    const vectorLine = lines.slice(lineIndex).join(' ');
    const vector: Vector = parseRow(vectorLine, size);

    const problem: SlaeProblem = { size, matrix, vector };
    return { problem };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown parsing error' };
  }
};
