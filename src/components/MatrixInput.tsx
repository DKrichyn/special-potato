import { Matrix } from '../core/types';
import styles from './MatrixInput.module.css';

interface MatrixInputProps {
  size: number;
  matrix: Matrix;
  onChange: (matrix: Matrix) => void;
}

export const MatrixInput = ({ size, matrix, onChange }: MatrixInputProps) => {
  const handleChange = (row: number, col: number, value: number) => {
    const nextMatrix = matrix.map((matrixRow, rowIndex) =>
      matrixRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return value;
        }
        return cell;
      })
    );
    onChange(nextMatrix);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Matrix A</div>
      <div className={styles.matrixShell} style={{ ['--matrix-columns' as string]: size }}>
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: `repeat(${size}, minmax(52px, 1fr))` }}
        >
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => (
              <input
                key={`${row}-${col}`}
                type="number"
                className={styles.input}
                value={matrix[row]?.[col] ?? 0}
                onChange={(event) => handleChange(row, col, Number(event.target.value))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
