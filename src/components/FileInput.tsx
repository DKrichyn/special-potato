import { ChangeEvent } from 'react';
import { parseSlaeFromText } from '../core/parsers/textFileParser';
import { SlaeInput } from '../core/types';
import styles from './FileInput.module.css';

interface FileInputProps {
  onParsed: (input: SlaeInput) => void;
  onError: (message: string) => void;
}

export const FileInput = ({ onParsed, onError }: FileInputProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '');
        const parsed = parseSlaeFromText(text);
        onParsed(parsed);
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        } else {
          onError('Unable to parse file.');
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="file-input">
        Upload SLAE file
      </label>
      <input
        id="file-input"
        className={styles.input}
        type="file"
        accept=".txt"
        onChange={handleFileChange}
      />
      <p className={styles.helper}>Format: n, n lines for matrix A, final line(s) for vector B.</p>
    </div>
  );
};
