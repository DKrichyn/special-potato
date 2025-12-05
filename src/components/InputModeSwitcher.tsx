import styles from './InputModeSwitcher.module.css';

interface InputModeSwitcherProps {
  mode: 'keyboard' | 'file';
  onChange: (mode: 'keyboard' | 'file') => void;
}

export const InputModeSwitcher = ({ mode, onChange }: InputModeSwitcherProps) => {
  return (
    <div className={styles.wrapper}>
      <span>Input Mode</span>
      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.button} ${mode === 'keyboard' ? styles.active : ''}`}
          onClick={() => onChange('keyboard')}
        >
          Keyboard
        </button>
        <button
          type="button"
          className={`${styles.button} ${mode === 'file' ? styles.active : ''}`}
          onClick={() => onChange('file')}
        >
          File
        </button>
      </div>
    </div>
  );
};
