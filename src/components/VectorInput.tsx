import { ChangeEvent } from 'react';
import { Vector } from '../core/types';
import styles from './MatrixInput.module.css';

interface VectorInputProps {
  size: number;
  vector: Vector;
  onChange: (vector: Vector) => void;
}

export const VectorInput = ({ size, vector, onChange }: VectorInputProps) => {
  const handleChange = (index: number, value: string) => {
    const updated = vector.map((item, current) => (current === index ? Number(value) : item));
    onChange(updated);
  };

  return (
    <div className={styles.vectorWrapper}>
      <div className={styles.vectorLabel}>Vector B</div>
      <div className={styles.vectorShell}>
        <div className={styles.vectorColumn}>
          {Array.from({ length: size }).map((_, index) => (
            <input
              key={index}
              type="number"
              className={styles.vectorInput}
              value={vector[index] ?? 0}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChange(index, event.target.value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
