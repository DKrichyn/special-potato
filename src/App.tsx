import { useMemo, useState } from 'react';
import styles from './App.module.css';
import { MethodDescription } from './components/MethodDescription';
import { MethodSelector } from './components/MethodSelector';
import { InputModeSwitcher } from './components/InputModeSwitcher';
import { MatrixInput } from './components/MatrixInput';
import { FileInput } from './components/FileInput';
import { ParametersForm } from './components/ParametersForm';
import { ResultView } from './components/ResultView';
import { IterationTable } from './components/IterationTable';
import { ErrorAlert } from './components/ErrorAlert';
import { VectorInput } from './components/VectorInput';
import { methodMetadata } from './core/methods/metadata';
import { IterativeParams, Matrix, SlaeInput, Vector } from './core/types';
import { useSlaeSolver } from './hooks/useSlaeSolver';
import matrixStyles from './components/MatrixInput.module.css';

const createZeroMatrix = (size: number): Matrix =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

const createZeroVector = (size: number): Vector => Array.from({ length: size }, () => 0);

export const App = () => {
  const [inputMode, setInputMode] = useState<'keyboard' | 'file'>('keyboard');
  const [size, setSize] = useState<number>(3);
  const [fileError, setFileError] = useState<string>('');

  const initialInput = useMemo<SlaeInput>(
    () => ({
      size,
      matrix: createZeroMatrix(size),
      vector: createZeroVector(size)
    }),
    [size]
  );

  const solver = useSlaeSolver(initialInput);
  const { input, method, iterativeParams, result, validationErrors, checkSolutionResult } = solver.state;

  const selectedMetadata = useMemo(
    () => methodMetadata.find((meta) => meta.id === method),
    [method]
  );

  const handleModeChange = (mode: 'keyboard' | 'file') => {
    setInputMode(mode);
    if (mode === 'keyboard') {
      setFileError('');
    }
  };

  const updateMatrix = (matrix: Matrix) => {
    solver.setInput({ ...input, matrix });
  };

  const updateSize = (nextSize: number) => {
    if (Number.isNaN(nextSize) || nextSize <= 0) {
      return;
    }
    setSize(nextSize);
    const resetInput = {
      size: nextSize,
      matrix: createZeroMatrix(nextSize),
      vector: createZeroVector(nextSize)
    };
    solver.setInput(resetInput);
  };

  const handleIterativeParamsChange = (params: IterativeParams) => {
    solver.setIterativeParams(params);
  };

  const handleSolve = () => {
    solver.solve();
  };

  const handleCheckSolution = () => {
    solver.checkCurrentSolution();
  };

  const handleFileParsed = (parsed: SlaeInput) => {
    setFileError('');
    setSize(parsed.size);
    solver.setInput(parsed);
  };

  const handleFileError = (message: string) => {
    setFileError(message);
  };

  const errorMessages = useMemo(() => {
    const messages = [...validationErrors];
    if (result?.errorMessage) {
      messages.push(result.errorMessage);
    }
    if (result?.error) {
      messages.push(result.error);
    }
    if (fileError) {
      messages.push(fileError);
    }
    return messages;
  }, [fileError, result, validationErrors]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>SLAE Solver</h1>
        <p>Solve A·X = B with multiple numerical methods.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <MethodSelector methods={methodMetadata} selected={method} onChange={solver.setMethod} />
          <div className={styles.divider} />
          <MethodDescription method={selectedMetadata} />
        </div>

        <div className={styles.card}>
          <InputModeSwitcher mode={inputMode} onChange={handleModeChange} />
          {inputMode === 'keyboard' && (
            <div className={styles.inlineField}>
              <label htmlFor="size">System size</label>
              <input
                id="size"
                className={styles.smallInput}
                type="number"
                min={1}
                value={size}
                onChange={(event) => updateSize(Number(event.target.value))}
              />
            </div>
          )}
        </div>
      </div>

      {inputMode === 'file' ? (
        <div className={styles.card}>
          <FileInput onParsed={handleFileParsed} onError={handleFileError} />
        </div>
      ) : (
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Matrix A and Vector B</h3>
          <div className={matrixStyles.matrixContainer}>
            <MatrixInput size={size} matrix={input.matrix} onChange={updateMatrix} />
            <VectorInput size={size} vector={input.vector} onChange={(vector) => solver.setInput({ ...input, vector })} />
          </div>
        </div>
      )}

      {selectedMetadata?.supportsIterativeParams && (
        <div className={styles.card}>
          <ParametersForm params={iterativeParams} onChange={handleIterativeParamsChange} />
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={handleSolve}>
            Solve
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={handleCheckSolution}>
            Check Solution
          </button>
        </div>
      </div>

      <ErrorAlert messages={errorMessages} />

      <div className={styles.grid}>
        <div className={styles.card}>
          <ResultView result={result ?? undefined} />
        </div>
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Solution Check</h3>
          {checkSolutionResult ? (
            <div>
              <p>Residual norm: {checkSolutionResult.residualNorm.toExponential(6)}</p>
              <p>Status: {checkSolutionResult.valid ? 'Valid' : 'Invalid'}</p>
            </div>
          ) : (
            <p>Run a solution check to view residuals.</p>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <IterationTable result={result ?? undefined} />
      </div>
    </div>
  );
};
