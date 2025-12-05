import { ChangeEvent } from 'react';
import { Vector } from '../core/types';

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
    <div className="card">
      <h2>Vector B</h2>
      <div className="table-input">
        <table>
          <tbody>
            <tr>
              {Array.from({ length: size }).map((_, index) => (
                <td key={index}>
                  <input
                    type="number"
                    value={vector[index] ?? ''}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, event.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
