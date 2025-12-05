import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { IterativeParams } from '../core/types';
import styles from './ParametersForm.module.css';

interface ParametersFormProps {
  params: IterativeParams;
  onChange: (params: IterativeParams) => void;
}

export const ParametersForm = ({ params, onChange }: ParametersFormProps) => {
  const [initialGuessText, setInitialGuessText] = useState<string>(
    params.initialGuess?.join(', ') ?? ''
  );

  useEffect(() => {
    setInitialGuessText(params.initialGuess?.join(', ') ?? '');
  }, [params.initialGuess]);

  const parsedInitialGuess = useMemo(() => {
    if (!initialGuessText.trim()) {
      return undefined;
    }
    const values = initialGuessText
      .split(/[,\s]+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token) => Number(token));

    return values.every((value) => Number.isFinite(value)) ? values : undefined;
  }, [initialGuessText]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'epsilon') {
      onChange({ ...params, epsilon: Number(value) });
    }
    if (name === 'maxIterations') {
      onChange({ ...params, maxIterations: Number(value) });
    }
  };

  const handleInitialGuessBlur = () => {
    onChange({ ...params, initialGuess: parsedInitialGuess });
  };

  return (
    <div className={styles.wrapper}>
      <h3>Iterative Parameters</h3>
      <div className={styles.field}>
        <label htmlFor="epsilon">Epsilon</label>
        <input
          id="epsilon"
          name="epsilon"
          className={styles.input}
          type="number"
          step="0.0001"
          value={params.epsilon}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="maxIterations">Max iterations</label>
        <input
          id="maxIterations"
          name="maxIterations"
          className={styles.input}
          type="number"
          value={params.maxIterations}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="initialGuess">Initial guess (comma or space separated)</label>
        <input
          id="initialGuess"
          name="initialGuess"
          className={styles.input}
          type="text"
          value={initialGuessText}
          onChange={(event) => setInitialGuessText(event.target.value)}
          onBlur={handleInitialGuessBlur}
        />
        <p className={styles.note}>Leave empty to start from zeros.</p>
      </div>
    </div>
  );
};
