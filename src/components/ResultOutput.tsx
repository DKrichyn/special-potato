import { SolveResult } from '../core/types';

interface ResultOutputProps {
  result?: SolveResult;
}

export const ResultOutput = ({ result }: ResultOutputProps) => {
  if (!result) {
    return (
      <div className="card">
        <h2>Result</h2>
        <p>No solution yet.</p>
      </div>
    );
  }

  const solution = result.solution ?? result.x;
  const error = result.error || result.errorMessage;

  return (
    <div className="card">
      <h2>Result</h2>
      {error ? <p>{error}</p> : <pre>{JSON.stringify(solution, null, 2)}</pre>}
    </div>
  );
};
