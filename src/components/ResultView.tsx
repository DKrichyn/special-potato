import { MethodResult } from '../core/types';
import styles from './ResultView.module.css';

interface ResultViewProps {
  result?: MethodResult | null;
}

const formatVector = (vector: number[]): string => `[${vector.map((v) => v.toFixed(6)).join(', ')}]`;

export const ResultView = ({ result }: ResultViewProps) => {
  if (!result) {
    return null;
  }

  if (result.errorMessage || result.error) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Result</h3>
        <p>{result.errorMessage ?? result.error}</p>
      </div>
    );
  }

  const solution = result.x ?? result.solution;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        Result <span className={styles.badge}>{result.method}</span>
      </h3>
      {solution && <p>Solution: {formatVector(solution)}</p>}
      {result.warnings && result.warnings.length > 0 && (
        <ul className={styles.list}>
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
