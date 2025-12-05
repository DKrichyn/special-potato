import { IterativeMethodResult, MethodResult } from '../core/types';
import styles from './IterationTable.module.css';

interface IterationTableProps {
  result?: MethodResult | null;
}

const isIterativeResult = (result?: MethodResult | null): result is IterativeMethodResult => {
  return Boolean(result && 'iterationLog' in result);
};

export const IterationTable = ({ result }: IterationTableProps) => {
  if (!isIterativeResult(result) || result.iterationLog.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>Iterations</h3>
      <table className={styles.table}>
        <thead className={styles.header}>
          <tr>
            <th>#</th>
            <th>Vector</th>
            <th>Δ Norm</th>
          </tr>
        </thead>
        <tbody>
          {result.iterationLog.map((entry) => (
            <tr key={entry.iteration}>
              <td>{entry.iteration}</td>
              <td>[{entry.vector.map((value) => value.toFixed(6)).join(', ')}]</td>
              <td>{entry.differenceNorm.toExponential(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
