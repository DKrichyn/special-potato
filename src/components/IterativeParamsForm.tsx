import { ChangeEvent } from 'react';
import { IterativeSolveOptions, Vector } from '../core/types';

interface IterativeParamsFormProps {
  params: IterativeSolveOptions;
  onChange: (params: IterativeSolveOptions) => void;
}

const parseInitialGuess = (value: string): Vector =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map(Number);

export const IterativeParamsForm = ({ params, onChange }: IterativeParamsFormProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'initialGuess') {
      onChange({ ...params, initialGuess: parseInitialGuess(value) });
      return;
    }
    onChange({ ...params, [name]: Number(value) });
  };

  const initialGuessValue = params.initialGuess?.join(', ') ?? '';

  return (
    <div className="card">
      <h2>Iterative Parameters</h2>
      <div className="form-grid">
        <label>
          Epsilon
          <input name="epsilon" type="number" step="any" value={params.epsilon} onChange={handleChange} />
        </label>
        <label>
          Max Iterations
          <input
            name="maxIterations"
            type="number"
            value={params.maxIterations}
            onChange={handleChange}
          />
        </label>
        <label>
          Initial Guess (comma-separated)
          <input
            name="initialGuess"
            type="text"
            value={initialGuessValue}
            onChange={handleChange}
            placeholder="e.g., 0,0,0"
          />
        </label>
      </div>
    </div>
  );
};
