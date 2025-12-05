import { SolutionCheck } from '../core/types';

interface SolutionCheckProps {
  check?: SolutionCheck;
}

export const SolutionCheckPanel = ({ check }: SolutionCheckProps) => {
  if (!check) return null;
  return (
    <div className="card">
      <h2>Solution Check</h2>
      <p>Residual: [{check.residual.join(', ')}]</p>
      <p>Norm: {check.residualNorm}</p>
      <p>Status: {check.valid ? 'Within tolerance' : 'Outside tolerance'}</p>
    </div>
  );
};
